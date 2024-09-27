import { BaseEnemy } from "../enemies/BaseEnemy";
import { MapGenerator } from "./MapGenerator";

export class WaveController {
    scene: Phaser.Scene;
    currentWave: number;
    maxWave: number;
    mapGen: MapGenerator;

    constructor(scene:Phaser.Scene, maxWave: number, mapGen: MapGenerator) {
        this.scene = scene;
        this.currentWave = 1;
        this.maxWave = maxWave;
        this.mapGen = mapGen;
    }

    releaseWave(enemyList: BaseEnemy[], delay: number) {
        enemyList.forEach((enemy, index) => {
            this.mapGen.scene.time.delayedCall(
                index * delay, // Delay increases by 500 ms for each enemy (adjust as needed)
                () => {
                    this.mapGen.createEnemy(enemy);
                    this.mapGen.moveEnemy(enemy);
                },
                [],
                this
            );
        });
    }
}