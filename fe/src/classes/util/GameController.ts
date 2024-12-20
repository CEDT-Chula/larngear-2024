import { BaseEnemy } from "../enemies/BaseEnemy";
import { BaseTower } from "../Tower/BaseTower";
import { BrowserTower } from "../Tower/BrowserTower";
import { TowerController } from "./TowerController";
import { MapGenerator, MapTile } from "./MapGenerator";
import { PlTower } from "../Tower/PlTower";
import { GameUI } from "./GameUI";
import { IdeTower } from "../Tower/ideTower";
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
	enemySummon: number;
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
	bossHealth_Multiplier: number;

	// Pool
	towerPool_All: (new (scene: Phaser.Scene) => BaseTower)[];
	towerPool_Current: (new (scene: Phaser.Scene) => BaseTower)[];
	enemyPool: (new (scene: Phaser.Scene) => BaseEnemy)[];

	private constructor() {
		this.isPause = false;
		this.timeSpeedBuffer = 1;
		this.currentWave = 1;
		this.maxWave = 30;
		this.enemyPerWave = 20;
		this.enemySummon = 0;
		this.enemyKilled = 0;
		this.playerHealth = 30;
		this.accumCoin = 0;
		this.coin = 500;
		this.coinPerKill = 5;

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
		this.bossHealth_Multiplier = 1;

		this.towerPool_All = [
			BrowserTower, IdeTower, PlTower, AITower, CliTower, DataBaseTower, MeetingTower, SearchTower
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

		this.enemySpeed_Multiplier = 1 + (this.currentWave / (this.maxWave * 1.5))
		this.enemyHealth_Multiplier = 1 + (this.currentWave / 6) + (this.enemyPerWave / (this.enemyPerWave * 1.5))
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

	gameOver(key: string) {
		this.pause();

		const overlay = this.currentScene.add.rectangle(
			this.currentScene.cameras.main.width / 2,
			this.currentScene.cameras.main.height / 2,
			this.currentScene.cameras.main.width,
			this.currentScene.cameras.main.height,
			0x000000,
			0.8
		)
			.setDepth(9)
			.setOrigin(0.5, 0.5)
			.setInteractive(); // Block interactions below the overlay

		const offsetX = 300;
		const offsetY = 80;

		// Game over message
		this.currentScene.add.text(
			this.currentScene.cameras.main.width / 2 - offsetX,
			this.currentScene.cameras.main.height / 3,
			`You ${key}!`,
			{ fontSize: '48px', color: '#ffffff', fontFamily: 'PressStart2P' }
		).setOrigin(0.5).setDepth(10);

		// Game stats
		this.currentScene.add.text(
			this.currentScene.cameras.main.width / 2 - offsetX,
			this.currentScene.cameras.main.height / 3 + offsetY,
			`You survived: ${this.currentWave} waves`,
			{ fontSize: '24px', color: '#ffffff', fontFamily: 'PressStart2P' }
		).setOrigin(0.5).setDepth(10);

		this.currentScene.add.text(
			this.currentScene.cameras.main.width / 2 - offsetX,
			this.currentScene.cameras.main.height / 3 + offsetY * 2,
			`You earned: ${this.accumCoin} coin`,
			{ fontSize: '24px', color: '#ffffff', fontFamily: 'PressStart2P' }
		).setOrigin(0.5).setDepth(10);

		this.currentScene.add.text(
			this.currentScene.cameras.main.width / 2 - offsetX,
			this.currentScene.cameras.main.height / 3 + offsetY * 3,
			`You killed: ${this.enemyKilled} enemies`,
			{ fontSize: '24px', color: '#ffffff', fontFamily: 'PressStart2P' }
		).setOrigin(0.5).setDepth(10);

		this.currentScene.add.text(
			this.currentScene.cameras.main.width / 2 - offsetX,
			this.currentScene.cameras.main.height / 3 + offsetY * 4,
			`Health left: ${this.playerHealth}`,
			{ fontSize: '24px', color: '#ffffff', fontFamily: 'PressStart2P' }
		).setOrigin(0.5).setDepth(10);

		// Final score
		const finalScore = this.accumCoin + this.enemyKilled * 10 + this.playerHealth * 5;
		this.currentScene.add.text(
			this.currentScene.cameras.main.width / 2 - offsetX,
			this.currentScene.cameras.main.height / 3 + offsetY * 5,
			`Final Score: ${finalScore}`,
			{ fontSize: '28px', color: '#FFD700', fontFamily: 'PressStart2P' }
		).setOrigin(0.5).setDepth(10);

		// Embed a form using DOMElement
		const formHTML = `
			<div style="margin-top: 60%; display: flex; flex-direction: column; align-items: center; gap: 10px; font-family: PressStart2P; color: #FFD700;">
				<label for="playerName">Name:</label>
				<input id="playerName" type="text" placeholder="Enter Name" maxlength="15" style="width: 400px; height: 80px; font-size: 24px; text-align: center; border: 2px solid #FFD700; border-radius: 8px; background-color: #333333; color: #FFD700;">

				<label for="playerHouse">House:</label>
				<select id="playerHouse" style="width: 400px; height: 80px; font-family: 2ndPixelus; font-size: 24px; text-align: center; border: 8px solid #FFD700; border-radius: 8px; background-color: #333333; color: #FFD700;">
					<option value="" disabled selected>Select House</option>
					<option value="ติดตลก">ติดตลก</option>
					<option value="ติดเตียง">ติดเตียง</option>
					<option value="ติดบั๊ก">ติดบั๊ก</option>
					<option value="ติดลิฟต์">ติดลิฟต์</option>
					<option value="ติดจุฬา">ติดจุฬา</option>
					<option value="ติดแกลม">ติดแกลม</option>
					<option value="ติดใจ">ติดใจ</option>
					<option value="ติดฝน">ติดฝน</option>
				</select>

				<button id="submitScoreButton" style="width: 400px; height: 80px; font-size: 24px; border: 8px solid #FFD700; border-radius: 8px; background-color: #000000; color: #FFD700;">Submit Score</button>
				<button id="replayButton" style="width: 400px; height: 80px; font-size: 24px; border: 8px solid #FFD700; border-radius: 8px; background-color: #555555; color: #999999; opacity: 0.5; cursor: not-allowed;" disabled>Replay</button>
				<button id="leaderboardButton" style="width: 400px; height: 80px; font-size: 24px; border: 8px solid #FFD700; border-radius: 8px; background-color: #555555; color: #999999; opacity: 0.5; cursor: not-allowed;" disabled>Leaderboard</button>
			</div>
		`;

		const formElement = this.currentScene.add.dom(
			this.currentScene.cameras.main.width - 550,
			0
		).createFromHTML(formHTML);

		formElement.setOrigin(0).setDepth(10);

		// Event listener for Submit Score button
		formElement.getChildByID('submitScoreButton')?.addEventListener('click', async () => {
			const playerName = (document.getElementById('playerName') as HTMLInputElement).value;
			const playerHouse = (document.getElementById('playerHouse') as HTMLSelectElement).value;

			if (!playerName || !playerHouse) {
				alert('Please enter your name and select your house!');
				return;
			}

			// Enable Replay and Leaderboard buttons
			const replayButton = formElement.getChildByID('replayButton') as HTMLButtonElement;
			const leaderboardButton = formElement.getChildByID('leaderboardButton') as HTMLButtonElement;

			const finalScore = this.accumCoin + this.enemyKilled * 10 + this.playerHealth * 5;

			// Prepare the data to send
			const postData = {
				name: playerName,
				team: playerHouse,
				score: finalScore,
			};

			try {
				// Send the POST request
				const response = await fetch('http://localhost:5000/api/scores', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(postData),
				});

				if (!response.ok) {
					throw new Error(`Error: ${response.statusText}`);
				}

				alert('Score submitted successfully!');
				replayButton.disabled = false;
				leaderboardButton.disabled = false;

				// Update styles for enabled state
				replayButton.style.backgroundColor = '#000000';
				replayButton.style.color = '#FFD700';
				replayButton.style.opacity = '1';
				replayButton.style.cursor = 'pointer';

				leaderboardButton.style.backgroundColor = '#000000';
				leaderboardButton.style.color = '#FFD700';
				leaderboardButton.style.opacity = '1';
				leaderboardButton.style.cursor = 'pointer';
			} catch (error) {
				console.error('Failed to submit score:', error);
				alert('Failed to submit score. Please try again later.');
			}
		});


		formElement.getChildByID('leaderboardButton')?.addEventListener('click', () => {
			window.location.href = `/LeaderBoard`;
		});


		// Event listener for Replay button
		formElement.getChildByID('replayButton')?.addEventListener('click', () => {
			// Logic for replay will go here
			console.log('Replay the game');
		});
	}

}
