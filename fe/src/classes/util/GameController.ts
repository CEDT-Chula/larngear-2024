import { BaseEnemy } from "../enemies/BaseEnemy";
import { BaseTower } from "../Tower/BaseTower";
import { BrowserTower } from "../Tower/BrowserTower";
import { TowerController } from "./TowerController";
import { MapGenerator, MapTile } from "./MapGenerator";
import { PlTower } from "../Tower/PlTower";
import { GameUI } from "./GameUI";
import { IdeTower } from "../Tower/IdeTower";
import { AITower } from "../Tower/AITower";
import { CliTower } from "../Tower/CliTower";
import { DataBaseTower } from "../Tower/DataBaseTower";
import { MeetingTower } from "../Tower/MeetingTower";
import { SearchTower } from "../Tower/SearchTower";
import { WaveController } from './WaveController';
import { CakeEnemy } from "../enemies/CakeEnemy";
import { ChocolateEnemy } from "../enemies/ChocolateEnemy";
import { CoffeeEnemy } from "../enemies/CoffeeEnemy";
import { CokeEnemy } from "../enemies/CokeEnemy";
import { CupCakeEnemy } from "../enemies/CupCakeEnemy";
import { IceCreamEnemy } from "../enemies/IceCreamEnemy";
import { MacaroonEnemy } from "../enemies/MacaroonEnemy";
import { ParticleEmitter } from "./ParticleEmitter";


export class GameController {
	private static instance: GameController;

	// Ref
	currentScene!: Phaser.Scene;
	towerController!: TowerController;
	mapGen!: MapGenerator;
	waveController!: WaveController;

	// Game Stats
	isPause: boolean;
	timeSpeedBuffer: number;
	enemiesGroup: Phaser.Physics.Arcade.Group | null;
	currentWave: number;
	maxWave: number;
	enemyPerWave: number;
	enemyKilled: number;
	playerHealth: number;
	accumCoin: number;
	coin: number;
	coinPerKill: number;

	// Tracking
	activeEnemiesList: BaseEnemy[]; // store enemies currently in the scene
	towerList: BaseTower[];
	gridMap: MapTile[][]; // y, x notation
	isDragging: boolean;

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
	enemyPool: (new (scene: Phaser.Scene) => BaseEnemy)[];

	private constructor() {
		this.isPause = false;
		this.timeSpeedBuffer = 1;
		this.currentWave = 1;
		this.maxWave = 30;
		this.enemyPerWave = 30; // TODO : 30 is for testing
		this.enemyKilled = 0;
		this.playerHealth = 30;
		this.accumCoin = 0;
		this.coin = 500;
		this.coinPerKill = 10;

		this.activeEnemiesList = [];
		this.towerList = [];
		this.gridMap = [];
		this.isDragging = false;

		this.isPoisonImmune = false;
		this.isBurnImmune = false;

		this.tileSize = 64;
		this.scaleFactor = 4;

		this.enemiesGroup = null;
		this.enemyHealth_Multiplier = 1;
		this.enemySpeed_Multiplier = 1;
		this.moneyDrop_Multiplier = 1;

		this.towerPool_All = [
			// BrowserTower, IdeTower, PlTower, AITower, CliTower, DataBaseTower, MeetingTower, SearchTower
			SearchTower
		];
		this.towerPool_Current = this.towerPool_All;
		this.enemyPool = [
			CakeEnemy, ChocolateEnemy, CoffeeEnemy, CokeEnemy, CupCakeEnemy, IceCreamEnemy, MacaroonEnemy
		]
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

	addFloatText(text: string) {
		const floatText = this.currentScene.add.text(
			this.currentScene.cameras.main.centerX,
			this.currentScene.cameras.main.centerY,
			text,
			{
				fontFamily: 'PressStart2P',
				fontSize: '72px',
				color: '#FFDD00',
			}
		)
			.setOrigin(0.5)
			.setDepth(100)
			.setAlpha(0)

		const fadeIn = this.currentScene.tweens.add({
			targets: floatText,
			alpha: 1,
			duration: 1000,
			ease: 'Sine.easeIn',
		})

		const fadeOut = this.currentScene.tweens.add({
			targets: floatText,
			alpha: 0,
			duration: 1000,
			ease: 'Sine.easeOut',
			delay: 5000,
			onComplete: () => {
				floatText.destroy()
			},
		})

		// Chain tweens: fadeIn -> fadeOut
		this.currentScene.tweens.chain({
			tweens: [fadeIn, fadeOut]
		})
	}

	addParticle(effect: string, amount: number, x: number, y: number) {
		const emitter = new ParticleEmitter(this.currentScene, "");

		emitter.explode(amount, x, y);
	}

	// TODO : Better UI
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

		const offsetY = 80;

		const middleText = this.currentScene.add.text(
			this.currentScene.cameras.main.width / 2,
			this.currentScene.cameras.main.height / 3,
			`You ${key}!`,
			{ fontSize: '48px', color: '#ffffff', fontFamily: 'PressStart2P' }
		).setOrigin(0.5);

		const s1Text = this.currentScene.add.text(
			this.currentScene.cameras.main.width / 2,
			this.currentScene.cameras.main.height / 3 + offsetY,
			`You survived: ${this.currentWave} waves`,
			{ fontSize: '24px', color: '#ffffff', fontFamily: 'PressStart2P' }
		).setOrigin(0.5);

		const s2Text = this.currentScene.add.text(
			this.currentScene.cameras.main.width / 2,
			this.currentScene.cameras.main.height / 3 + offsetY * 2,
			`You earned: ${this.accumCoin} coin`,
			{ fontSize: '24px', color: '#ffffff', fontFamily: 'PressStart2P' }
		).setOrigin(0.5);

		const s3Text = this.currentScene.add.text(
			this.currentScene.cameras.main.width / 2,
			this.currentScene.cameras.main.height / 3 + offsetY * 3,
			`You killed: ${this.enemyKilled} enemies`,
			{ fontSize: '24px', color: '#ffffff', fontFamily: 'PressStart2P' }
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
				padding: { left: 10, right: 10, top: 10, bottom: 10 },
			}
		).setOrigin(0.5).setInteractive();

		button.on('pointerdown', () => {
			window.location.href = '/LeaderBoard';
		});
	}
}
