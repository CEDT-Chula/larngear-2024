import { BaseTower } from "../Tower/BaseTower";
import { BrowserTower } from "../Tower/BrowserTower";

export class GameController {
    private static instance: GameController;

    // Ref
    currentScene!: Phaser.Scene;

    // Game Stats
    currentWave: number;
    enemyPerWave: number;
    coin: number;
    coinPerKill: number;

    isPoisonImmune: boolean;
    isBurnImmune: boolean;
    
    // Multiplier
    enemyHealth_Multiplier: number;
    enemySpeed_Multiplier: number;
    moneyDrop_Multiplier: number;

    // Pool
    towerPool_All: (new (scene: Phaser.Scene) => BaseTower)[];
    towerPool_Current: (new (scene: Phaser.Scene) => BaseTower)[];

    private constructor() {
        this.currentWave = 1;
        this.enemyPerWave = 20;
        this.coin = 500;
        this.coinPerKill = 20;

        this.isPoisonImmune = false;
        this.isBurnImmune = false;

        this.enemyHealth_Multiplier = 1;
        this.enemySpeed_Multiplier = 1;
        this.moneyDrop_Multiplier = 1;

        this.towerPool_All = [
            BrowserTower
        ];
        this.towerPool_Current = this.towerPool_All;
    }

    public static getInstance(): GameController {
        if (!GameController.instance) {
            GameController.instance = new GameController();
        }
        return GameController.instance;
    }

    resetNonPerma() {
        this.isPoisonImmune = false;
        this.isBurnImmune = false;
        this.towerPool_Current = this.towerPool_All;
    }
}