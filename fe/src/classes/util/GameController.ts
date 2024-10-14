import { BaseEnemy } from "../enemies/BaseEnemy";
import { BaseTower } from "../Tower/BaseTower";
import { BrowserTower } from "../Tower/BrowserTower";
import { MapGenerator } from "./MapGenerator";

export class GameController {
    private static instance: GameController;

    // Ref
    currentScene!: Phaser.Scene;

    // Game Stats
    isPause: boolean;
    timeSpeedBuffer: number;
    currentWave: number;
    enemyPerWave: number;
    playerHealth: number;
    coin: number;
    coinPerKill: number;

    activeEnemies: BaseEnemy[]; // store enemies currently in the scene

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
        this.isPause = false;
        this.timeSpeedBuffer = 1;
        this.currentWave = 1;
        this.enemyPerWave = 20;
        this.playerHealth = 30;
        this.coin = 500;
        this.coinPerKill = 20;

        this.activeEnemies = [];

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

    increaseSpeed() {
        this.enemySpeed_Multiplier += 1;
        if (this.enemySpeed_Multiplier > 2) {
            this.enemySpeed_Multiplier = 1;
        }
        console.log(`Enemy speed multiplier set to x${this.enemySpeed_Multiplier}`);
    }

    pause() {
        this.isPause = true;
        this.timeSpeedBuffer = this.currentScene.time.timeScale;
        this.currentScene.time.timeScale = 0;
    }

    unpause() {
        this.isPause = false;
        this.currentScene.time.timeScale = this.timeSpeedBuffer;
    }

    // TODO : Handle Game Win & Lose
    gameOver(key: string) {
        this.pause();

        const overlay = this.currentScene.add.rectangle(
            this.currentScene.cameras.main.width / 2,
            this.currentScene.cameras.main.height / 2,
            this.currentScene.cameras.main.width,
            this.currentScene.cameras.main.height,
            0x000000,
            0.5
        );
        overlay.setOrigin(0.5, 0.5);

        const middleText = this.currentScene.add.text(
            this.currentScene.cameras.main.width / 2,
            this.currentScene.cameras.main.height / 3,
            `You ${key}!`,
            { fontSize: '48px', color: '#ffffff', fontFamily: 'PressStart2P' }
        ).setOrigin(0.5);

        const button = this.currentScene.add.text(
            this.currentScene.cameras.main.width / 2,
            this.currentScene.cameras.main.height / 1.5,
            'Leaderboard',
            {
                fontSize: '24px',
                color: '#FFFFFF',
                backgroundColor: '#000000',
                fontFamily: 'PressStart2P',
                padding: { left: 5, right: 5, top: 5, bottom: 5 },
            }
        ).setOrigin(0.5).setInteractive();

        button.on('pointerdown', () => {
            window.location.href = '/LeaderBoard';
        });
    }
}
