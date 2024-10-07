import { BaseEnemy } from "../enemies/BaseEnemy";
import { IceCreamEnemy } from "../enemies/IceCreamEnemy";
import { GameController } from "./GameController";
import { MapGenerator } from "./MapGenerator";
import { BiggerWave } from "./waves/BiggerWave";
import { DuplicateWave } from "./waves/DuplicateWave";
import { SlowWave } from "./waves/SlowWave";
import { SpeedWave } from "./waves/SpeedWave";
import { WaveEffect } from "./waves/WaveEffect";

export class WaveController {
    scene: Phaser.Scene;
    currentWave: number;
    maxWave: number;
    mapGen: MapGenerator;
    activeEnemies: BaseEnemy[]; // store enemies currently in the scene
    popupElements: Phaser.GameObjects.GameObject[];

    waveText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, maxWave: number, mapGen: MapGenerator) {
        this.scene = scene;
        this.currentWave = GameController.getInstance().currentWave;
        this.maxWave = maxWave;
        this.mapGen = mapGen;
        this.activeEnemies = [];
        this.waveText = this.scene.add
            .text(1000, 20, `${'Wave ' + this.currentWave + '/' + this.maxWave}`, {
                fontFamily: 'PressStart2P',
                fontSize: '30px',
            })
            .setDepth(1);

        this.popupElements = [];
    }

    releaseWave(enemyList: BaseEnemy[]) {
        enemyList.forEach((enemy, index) => {
            this.mapGen.scene.time.delayedCall(
                index * 100,
                () => {
                    this.mapGen.createEnemy(enemy);
                    this.mapGen.moveEnemy(enemy);
                    this.activeEnemies.push(enemy);

                    enemy.on('onDeath', () => this.onEnemyDefeated(enemy));
                    enemy.on('onArrived', () => this.onEnemyArrived(enemy));
                },
                [],
                this
            );
        });
    }

    onEnemyDefeated(enemy: BaseEnemy) {
        this.activeEnemies = this.activeEnemies.filter(e => e !== enemy);
        this.checkWaveCleared();
    }

    onEnemyArrived(enemy: BaseEnemy) {
        this.activeEnemies = this.activeEnemies.filter(e => e !== enemy);
        this.checkWaveCleared();
    }

    checkWaveCleared() {
        if (this.activeEnemies.length === 0) {
            console.log(`Wave ${this.currentWave} cleared!`);
            this.currentWave++;

            if (this.currentWave > this.maxWave) {
                this.GameOver();
            } else {
                this.triggerNextWave();
            }
        }
    }

    triggerNextWave() {
        this.waveText.text = `${'Wave ' + this.currentWave + '/' + this.maxWave}`;

        if (this.currentWave % 5 == 0) {
            // TODO : Call boss
            let mockBoss: BaseEnemy[] = [
                new IceCreamEnemy(this.scene),
            ]
            this.releaseWave(mockBoss);
        } else {
            this.showEnemySelectionPopup();
        }
    }

    showEnemySelectionPopup() {
        const popupElements: Phaser.GameObjects.GameObject[] = [];

        const popupBg = this.scene.add
            .rectangle(0, 0, this.scene.scale.width, this.scene.scale.height, 0x000000, 0.8)
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

            button.on('pointerdown', () => {
                this.onEnemyTypeSelected(choice);
                console.log("wait_confirm_release_wave fired");
                this.scene.events.emit("wait_confirm_release_wave");
            });

            popupElements.push(button);
        });

        this.popupElements = popupElements;
    }


    onEnemyTypeSelected(choice: WaveEffect) {
        this.cleanUpPopup();

        choice.effect();

        const waveEnemies: BaseEnemy[] = [];

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

    // TODO : Handle Game Win & Lose
    GameOver() {

    }
}