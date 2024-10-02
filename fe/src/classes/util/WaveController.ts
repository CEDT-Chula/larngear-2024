import { BaseEnemy } from "../enemies/BaseEnemy";
import { IceCreamEnemy } from "../enemies/IceCreamEnemy";
import { MapGenerator } from "./MapGenerator";

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
            .setDepth(1); // Ensure the text is on top of other game elements

        this.popupElements = [];
    }



    releaseWave(enemyList: BaseEnemy[], delay: number) {
        // this.showEnemySelectionPopup();

        enemyList.forEach((enemy, index) => {
            this.mapGen.scene.time.delayedCall(
                index * delay, // Delay increases by 500 ms for each enemy (adjust as needed)
                () => {
                    this.mapGen.createEnemy(enemy);
                    this.mapGen.moveEnemy(enemy);
                    this.activeEnemies.push(enemy);

                    // Subscribe to enemy defeat or arrival events
                    enemy.on('onDeath', () => this.onEnemyDefeated(enemy));
                    enemy.on('onArrived', () => this.onEnemyArrived(enemy));
                },
                [],
                this
            );
        });
    }

    onEnemyDefeated(enemy: BaseEnemy) {
        // Remove the enemy from the active list
        this.activeEnemies = this.activeEnemies.filter(e => e !== enemy);
        this.checkWaveCleared();
    }

    onEnemyArrived(enemy: BaseEnemy) {
        // Remove the enemy from the active list
        this.activeEnemies = this.activeEnemies.filter(e => e !== enemy);
        this.checkWaveCleared();
    }

    checkWaveCleared() {
        if (this.activeEnemies.length === 0) {
            console.log(`Wave ${this.currentWave} cleared!`);
            this.currentWave++; // Increment the wave counter
            // Optionally trigger the next wave here
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
            // TODO : Select enemy wave type along with debuff / buff
            // let mockWave: BaseEnemy[] = [
            //     new IceCreamEnemy(this.scene),
            //     new IceCreamEnemy(this.scene),
            //     new IceCreamEnemy(this.scene),
            //     new IceCreamEnemy(this.scene),
            // ]
            // this.releaseWave(mockWave, 200);
            this.showEnemySelectionPopup();
        }
    }

    showEnemySelectionPopup() {
        const popupElements: Phaser.GameObjects.GameObject[] = [];

        // Overlay background
        const popupBg = this.scene.add
            .rectangle(0, 0, this.scene.scale.width, this.scene.scale.height, 0x000000, 0.8)
            .setOrigin(0)
            .setDepth(9); // Ensure it's behind other elements
        popupElements.push(popupBg); // Store popup background

        const choices = [
            { enemy: IceCreamEnemy, title: "Icy Threat", description: "Frozen foes, slow but resilient." },
            { enemy: IceCreamEnemy, title: "Icy Threat", description: "Frozen foes, slow but resilient." },
            { enemy: IceCreamEnemy, title: "Icy Threat", description: "Frozen foes, slow but resilient." },
            { enemy: IceCreamEnemy, title: "Icy Threat", description: "Frozen foes, slow but resilient." },
        ];

        choices.forEach((choice, index) => {
            const imageX = 280;
            const imageY = 180 + (index * 250);
            const textX = imageX + 200;

            const enemyInstance = new choice.enemy(this.scene);

            const enemyImage = this.scene.add.image(imageX, imageY, enemyInstance.sprite)
                .setScale(6)
                .setDepth(11);
            popupElements.push(enemyImage); // Store enemy image

            const titleText = this.scene.add.text(textX, imageY - 20, choice.title, {
                fontFamily: 'PressStart2P',
                fontSize: '24px',
                color: '#FFDD00',
            }).setDepth(11);
            popupElements.push(titleText); // Store title text

            const descText = this.scene.add.text(textX, imageY + 10, choice.description, {
                fontFamily: 'PressStart2P',
                fontSize: '18px',
                color: '#FFFFFF',
            }).setDepth(11);
            popupElements.push(descText); // Store description text

            const button = this.scene.add.rectangle(imageX, imageY, 900, 200, 0xFFFFFF, 0.1)
                .setOrigin(0.1, 0.5)
                .setDepth(10)
                .setInteractive();

            button.on('pointerdown', () => {
                this.onEnemyTypeSelected(choice.enemy);
            });

            popupElements.push(button); // Store the button
        });

        this.popupElements = popupElements; // Store popup elements in a class property for later cleanup
    }


    onEnemyTypeSelected(enemyClass: { new(scene: Phaser.Scene, addToScene: boolean): BaseEnemy }) {
        this.cleanUpPopup(); // Remove popup elements

        const waveEnemies: BaseEnemy[] = [];

        // Create new instances of the specific enemy class for each enemy in the wave
        for (let i = 0; i < 20; i++) {
            const newEnemy = new enemyClass(this.scene, true); // Create a new enemy instance
            waveEnemies.push(newEnemy);
        }

        this.releaseWave(waveEnemies, 200); // Release the wave with the new instances
    }


    cleanUpPopup() {
        if (this.popupElements) {
            this.popupElements.forEach(element => element.destroy());
            this.popupElements = []; // Clear the array
        }
    }

    // TODO : Handle Game Win
}