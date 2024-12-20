import { BaseEnemy } from "../enemies/BaseEnemy";
import { Boss1 } from "../enemies/bosses/Boss1";
import { CupCakeEnemy } from "../enemies/CupCakeEnemy";
import { IceCreamEnemy } from "../enemies/IceCreamEnemy";
import { GameController } from "./GameController";
import { GameUI } from "./GameUI";
import { MapGenerator } from "./MapGenerator";
import { BiggerWave } from "./waves/BiggerWave";
import { BossBuffWave } from "./waves/BossBuffWave";
import { DuplicateWave } from "./waves/DuplicateWave";
import { GambleWave } from "./waves/GambleWave";
import { MixedWave } from "./waves/MixedWave";
import { SlowWave } from "./waves/SlowWave";
import { SpeedWave } from "./waves/SpeedWave";
import { WaveEffect } from "./waves/WaveEffect";

export class WaveController {
    scene: Phaser.Scene;
    maxWave: number;
    mapGen: MapGenerator;
    activeEnemies: BaseEnemy[];
    popupElements: Phaser.GameObjects.GameObject[];

    waveText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, maxWave: number, mapGen: MapGenerator) {
        this.scene = scene;
        this.maxWave = maxWave;
        this.mapGen = mapGen;
        this.activeEnemies = GameController.getInstance().activeEnemiesList;
        this.waveText = this.scene.add
            .text(1000, 20, `${'Wave ' + GameController.getInstance().currentWave + '/' + this.maxWave}`, {
                fontFamily: 'PressStart2P',
                fontSize: '30px',
            }).setDepth(8)

        GameUI.getInstance().waveText = this.waveText;

        this.popupElements = [];
        GameController.getInstance().enemySummon += GameController.getInstance().enemyPerWave;
    }

    releaseWave(enemyList: BaseEnemy[]) {
        GameController.getInstance().enemiesGroup!.clear(true, true);
        GameController.getInstance().enemiesGroup!.addMultiple(enemyList);
        enemyList.forEach((enemy, index) => {
            this.mapGen.scene.time.delayedCall(
                index * enemy.speed / 2,
                () => {
                    this.mapGen.createEnemy(enemy);
                    this.mapGen.moveEnemy(enemy);
                    this.activeEnemies.push(enemy);
                    if (enemy instanceof CupCakeEnemy)
                        enemy.startSummoning()

                    enemy.on('destroyed', () => this.checkWaveCleared());
                },
                [],
                this
            );
        });
    }

    checkWaveCleared() {
        GameController.getInstance().enemyKilled++;
        if (GameController.getInstance().enemyKilled == GameController.getInstance().enemySummon) {
            console.log(`Wave ${GameController.getInstance().currentWave} cleared!`);
            GameController.getInstance().currentWave++;

            if (GameController.getInstance().currentWave > this.maxWave) {
                GameController.getInstance().gameOver("win");
            } else {
                GameController.getInstance().resetNonPerma()
                this.triggerNextWave();
            }
        }
    }

    triggerNextWave() {
        this.waveText.text = `${'Wave ' + GameController.getInstance().currentWave + '/' + this.maxWave}`;
        GameController.getInstance().addFloatText("Wave Cleared!")

        if (GameController.getInstance().currentWave % 5 == 0) {
            GameController.getInstance().enemySummon += 1;
            let mockBoss: BaseEnemy[] = [
                new Boss1(this.scene)
            ]
            console.log("wait_confirm_release_wave fired");
            this.scene.events.emit("wait_confirm_release_wave");
            this.confirmReleaseWave(mockBoss);
        } else {
            setTimeout(() => {
                this.showEnemySelectionPopup();
            }, 3000);
        }
    }

    showEnemySelectionPopup() {
        const popupElements: Phaser.GameObjects.GameObject[] = [];

        const popupBg = this.scene.add
            .rectangle(0, 0, 1280, 1088, 0x000000, 0.8)
            .setOrigin(0)
            .setDepth(9)
            .setInteractive();
        popupElements.push(popupBg);

        const choices = this.randomChoice();

        choices.forEach((choice, index) => {
            const imageX = 280;
            const imageY = 180 + (index * 250);
            const textX = imageX + 200;

            const enemyInstance = new choice.enemy(this.scene);

            const enemyImage = this.scene.add.image(imageX, imageY, enemyInstance.sprite)
                .setScale(6)
                .setDepth(11);
            popupElements.push(enemyImage);

            const titleText = this.scene.add.text(textX, imageY - 60, choice.title, {
                fontFamily: 'PressStart2P',
                fontSize: '24px',
                color: '#FFDD00',
            }).setDepth(11);
            popupElements.push(titleText);

            const debuffText = this.scene.add.text(textX, imageY - 10, choice.debuff, {
                fontFamily: 'PressStart2P',
                fontSize: '18px',
                color: '#FF4545',
            }).setDepth(11);
            popupElements.push(debuffText);

            const buffText = this.scene.add.text(textX, imageY + 40, choice.buff, {
                fontFamily: 'PressStart2P',
                fontSize: '18px',
                color: '#45FF58',
            }).setDepth(11);
            popupElements.push(buffText);

            const button = this.scene.add.rectangle(imageX, imageY, 900, 200, 0xFFFFFF, 0.1)
                .setOrigin(0.1, 0.5)
                .setDepth(10)
                .setInteractive();

            button.on('pointerup', () => {
                if (!GameController.getInstance().isDragging) {
                    this.onEnemyTypeSelected(choice);
                    this.scene.sound.play(choice.sfx_key);
                    console.log("wait_confirm_release_wave fired");
                    this.scene.events.emit("wait_confirm_release_wave");
                }
            });

            popupElements.push(button);
        });

        this.popupElements = popupElements;
    }


    onEnemyTypeSelected(choice: WaveEffect) {
        this.cleanUpPopup();

        choice.effect();

        const waveEnemies: BaseEnemy[] = [];

        GameController.getInstance().enemySummon += GameController.getInstance().enemyPerWave;

        for (let i = 0; i < GameController.getInstance().enemyPerWave; i++) {
            const newEnemy = new choice.enemy(this.scene);
            waveEnemies.push(newEnemy);
        }

        this.confirmReleaseWave(waveEnemies);
    }

    confirmReleaseWave(waveEnemies: BaseEnemy[]) {
        this.scene.events.once('confirm_release_wave', () => {
            console.log("confirm_release_wave triggered");
            this.releaseWave(waveEnemies);
        });
    }


    cleanUpPopup() {
        if (this.popupElements) {
            this.popupElements.forEach(element => element.destroy());
            this.popupElements = [];
        }
    }

    randomChoice(): WaveEffect[] {
        const allEffects: WaveEffect[] = [
            new SpeedWave(),
            new SlowWave(),
            new BiggerWave(),
            new DuplicateWave(),
            new GambleWave(),
            new MixedWave(),
            new BossBuffWave(),
        ];

        const randomEffects: WaveEffect[] = [];

        while (randomEffects.length < 4) {
            const randomIndex = Math.floor(Math.random() * allEffects.length);
            const selectedEffect = allEffects[randomIndex];

            if (!randomEffects.includes(selectedEffect)) {
                randomEffects.push(selectedEffect);
            }
        }

        return randomEffects;
    }
}