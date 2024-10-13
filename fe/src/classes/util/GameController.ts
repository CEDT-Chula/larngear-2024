import { BaseTower } from "../Tower/BaseTower";
import { BrowserTower } from "../Tower/BrowserTower";
import { TowerController } from "./TowerController";

export class GameController {
	private static instance: GameController;

	// Ref
	currentScene!: Phaser.Scene;
	towerController!: TowerController;

	// Game Stats
	enemiesGroup: Phaser.Physics.Arcade.Group | null;
	currentWave: number;
	enemyPerWave: number;
	playerHealth: number;
	coin: number;
	coinPerKill: number;

	// Game Config
	tileSize: number;
	scaleFactor: number;

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
		this.playerHealth = 30;
		this.coin = 500;
		this.coinPerKill = 20;

		this.isPoisonImmune = false;
		this.isBurnImmune = false;

		this.tileSize = 64;
		this.scaleFactor = 4;

		this.enemiesGroup = null;
		this.enemyHealth_Multiplier = 1;
		this.enemySpeed_Multiplier = 1;
		this.moneyDrop_Multiplier = 1;

		this.towerPool_All = [BrowserTower];
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
}
