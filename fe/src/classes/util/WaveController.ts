import { BaseEnemy } from "../enemies/BaseEnemy";
import { MapGenerator } from "./MapGenerator";

export class WaveController {
    scene: Phaser.Scene;
    currentWave: number;
    maxWave: number;
    mapGen: MapGenerator;
    activeEnemies: BaseEnemy[];

    constructor(scene: Phaser.Scene, maxWave: number, mapGen: MapGenerator) {
        this.scene = scene;
        this.currentWave = 1;
        this.maxWave = maxWave;
        this.mapGen = mapGen;
        this.activeEnemies = [];
    }

    releaseWave(enemyList: BaseEnemy[], delay: number) {
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
        
    }
}