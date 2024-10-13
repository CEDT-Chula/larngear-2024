import { BaseEnemy } from "../enemies/BaseEnemy";
import { IceCreamEnemy } from "../enemies/IceCreamEnemy";
import { GameController } from "./GameController";
import { MapGenerator } from "./MapGenerator";
import { TowerController } from "./TowerController";
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
    activeEnemies: BaseEnemy[]; 
    popupElements: Phaser.GameObjects.GameObject[];
    towerController: TowerController;

    waveText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, maxWave: number, mapGen: MapGenerator, towerController: TowerController) {
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
        this.towerController = towerController;
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
        this.towerController.resetBoostedPrices();
        this.towerController.boostTowerSellingPrices();
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
                this.showBoostedTower();
                
            });

            popupElements.push(button);
        });

        this.popupElements = popupElements;

        // this.showBoostedTower();
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

    showBoostedTower() {
        const boostedTowers = this.towerController.boostedTowers;
        const boostedPrices = this.towerController.boostedPrices;
    
        const popupElements: Phaser.GameObjects.GameObject[] = [];
    
        // Background for the popup
        const popupBg = this.scene.add
            .rectangle(0, 0, this.scene.scale.width, this.scene.scale.height, 0x000000, 0.8)
            .setOrigin(0)
            .setDepth(9)
            .setInteractive();
    
        // Cleanup popup on click
        popupBg.on('pointerdown', () => {
            this.cleanUpPopup();
        });
    
        popupElements.push(popupBg);
    
        // Add the header
        const headerText = this.scene.add.text(this.scene.scale.width / 2, 50, "Selling Merchant", {
            fontFamily: 'PressStart2P',
            fontSize: '32px',
            color: '#FFDD00',
        })
        .setOrigin(0.5) // Center the text
        .setDepth(10);
    
        popupElements.push(headerText);
    
        // Create the tower images and prices
        boostedTowers.forEach((towerClassName, index) => {
            const imageX = this.scene.scale.width / 2 - 300; // Adjust for bigger image on left
            const imageY = 275 + index * 250; // Increase the multiplier for more spacing between towers
    
            // Find the tower class in the towerPool
            const towerClass = this.towerController.towerPool.find(
                (towerClass) => towerClass.name === towerClassName
            );
    
            if (towerClass) {
                const tempTower = new towerClass(this.scene);
                const towerSprite = tempTower.texture.key;
    
                // Tower image (bigger size)
                const towerImage = this.scene.add.image(imageX, imageY, towerSprite)
                    .setScale(10) // Scale the image to fit the design (bigger)
                    .setDepth(10);
    
                popupElements.push(towerImage);
    
                // Position for price text
                const priceX = this.scene.scale.width / 2 + 50; // Position for price text
                const priceY = imageY; // Align prices with the top of the image
    
                // Create a formatted price string with more space between levels
                const towerPrices = boostedPrices.get(towerClassName) || [];
                const priceText = this.scene.add.text(priceX, priceY, towerPrices.map((price, index) => `Lv${index + 1}: ${price}`).join('\n\n'), { // Added extra newline for spacing
                    fontFamily: 'PressStart2P',
                    fontSize: '20px',
                    color: '#FFDD00',
                })
                .setOrigin(0.5)
                .setDepth(10);
    
                popupElements.push(priceText);
            }
        });
    
        this.popupElements = popupElements;
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