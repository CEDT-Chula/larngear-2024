import { BaseEnemy } from "../enemies/BaseEnemy";
import { IceCreamEnemy } from "../enemies/IceCreamEnemy";
import { MapGenerator } from "./MapGenerator";

export interface Choice {
    enemy: new (scene: Phaser.Scene) => BaseEnemy;
    title: string;
    description: string;
}

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
        this.currentWave = 1;
        this.maxWave = maxWave;
        this.mapGen = mapGen;
        this.activeEnemies = [];
        this.waveText = this.scene.add
            .text(900, 24, `${'Wave ' + this.currentWave + '/' + this.maxWave}`, {
                fontFamily: 'PressStart2P',
                fontSize: '30px',
            })
            .setDepth(1);

        this.popupElements = [];
    }



    releaseWave(enemyList: BaseEnemy[], delay: number) {
        enemyList.forEach((enemy, index) => {
            this.mapGen.scene.time.delayedCall(
                index * delay,
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

            this.triggerNextWave();
        }
    }

    triggerNextWave() {
        this.waveText.text = `${'Wave ' + this.currentWave + '/' + this.maxWave}`;

        if (this.currentWave % 5 == 0) {
            // TODO : Call boss
            let mockBoss: BaseEnemy[] = [
                new IceCreamEnemy(this.scene),
            ]
            this.releaseWave(mockBoss, 200);
        } else {
            this.showEnemySelectionPopup();
        }
    }

    showEnemySelectionPopup() {
        const popupElements: Phaser.GameObjects.GameObject[] = [];

        const popupBg = this.scene.add
            .rectangle(0, 0, this.scene.scale.width, this.scene.scale.height, 0x000000, 0.8)
            .setOrigin(0)
            .setDepth(9);
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

            const titleText = this.scene.add.text(textX, imageY - 20, choice.title, {
                fontFamily: 'PressStart2P',
                fontSize: '24px',
                color: '#FFDD00',
            }).setDepth(11);
            popupElements.push(titleText);

            const descText = this.scene.add.text(textX, imageY + 10, choice.description, {
                fontFamily: 'PressStart2P',
                fontSize: '18px',
                color: '#FFFFFF',
            }).setDepth(11);
            popupElements.push(descText);

            const button = this.scene.add.rectangle(imageX, imageY, 900, 200, 0xFFFFFF, 0.1)
                .setOrigin(0.1, 0.5)
                .setDepth(10)
                .setInteractive();

            button.on('pointerdown', () => {
                this.onEnemyTypeSelected(choice.enemy);
            });

            popupElements.push(button);
        });

        this.popupElements = popupElements;
    }


    onEnemyTypeSelected(enemyClass: { new(scene: Phaser.Scene, addToScene: boolean): BaseEnemy }) {
        this.cleanUpPopup();

        const waveEnemies: BaseEnemy[] = [];

        for (let i = 0; i < 20; i++) {
            const newEnemy = new enemyClass(this.scene, true);
            waveEnemies.push(newEnemy);
        }

        this.releaseWave(waveEnemies, 200);
    }


    cleanUpPopup() {
        if (this.popupElements) {
            this.popupElements.forEach(element => element.destroy());
            this.popupElements = []; // Clear the array
        }
    }

    randomChoice(): Choice[] {

        
        return [
            { enemy: IceCreamEnemy, title: "Icy Threat", description: "Frozen foes, slow but resilient." },
            { enemy: IceCreamEnemy, title: "Icy Threat", description: "Frozen foes, slow but resilient." },
            { enemy: IceCreamEnemy, title: "Icy Threat", description: "Frozen foes, slow but resilient." },
            { enemy: IceCreamEnemy, title: "Icy Threat", description: "Frozen foes, slow but resilient." },
        ];
    }

    // TODO : Handle Game Win
}