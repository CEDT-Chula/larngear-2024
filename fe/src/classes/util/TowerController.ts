import Phaser from "phaser";
import { GameController } from "./GameController";
import { BaseTower } from "../Tower/BaseTower";
import { GameUI } from "./GameUI";

export class TowerController {
	towerPrices: number;
	sellingPrices: number[];
	scene: Phaser.Scene;
	lastClickTime: number;
	clickThreshold: number;

	towerPool: (new (scene: Phaser.Scene) => BaseTower)[];

	// Map to track placed towers by their positions
	towersMap: Map<string, BaseTower>;

	constructor(scene: Phaser.Scene) {
		this.scene = scene;
		this.towerPrices = 100;
		this.sellingPrices = [80, 160, 240, 320, 400]; // Selling prices for towers Lv1 to Lv5
		this.towerPool = GameController.getInstance().towerPool_Current;

		this.towersMap = new Map<string, BaseTower>();

		this.lastClickTime = 0;
		this.clickThreshold = 300; // Time threshold in milliseconds for double-click
	}

	placeTower(x: number, y: number, tile: any, tileSize: number, scaleFactor: number) {
		if (GameController.getInstance().coin < this.towerPrices) {
			console.log("Not enough currency to place a tower.");
			return;
		}

		GameUI.reduceCoin(this.towerPrices);

		let randomTowerIndex = Math.floor(Math.random() * this.towerPool.length);
		let randomTower = this.towerPool[randomTowerIndex];

		let newTower: BaseTower = new randomTower(this.scene);

		newTower.setPosition(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
		newTower.setScale(scaleFactor);

		this.scene.add.existing(newTower);
		newTower.placeRangeCircle();

		// Keep track of the tower position
		const towerKey = `${x},${y}`;
		this.towersMap.set(towerKey, newTower);

		tile.occupied = true;
		tile.towerLevel = randomTowerIndex + 1;
		console.log(`Tower placed at (${x}, ${y})`);
	}

	sellTower(x: number, y: number, tile: any, tileSize: number) {
		if (!tile.occupied) {
			console.log("No tower to sell at this tile.");
			return;
		}

		const towerKey = `${x},${y}`;
		const tower = this.towersMap.get(towerKey);

		if (tower) {
			// Destroy the tower instance
			tower.destroy();
			this.towersMap.delete(towerKey); // Remove it from the map
			console.log(`Tower instance destroyed at (${x}, ${y})`);
		}

		let sellingPrice = this.sellingPrices[tile.towerLevel - 1];
		GameUI.increaseCoin(sellingPrice);

		tile.occupied = false;
		tile.towerLevel = null;
		console.log(`Tower sold at (${x}, ${y})`);
	}

	public sellTowerPLEASE_FIX(tower: BaseTower) {
		// Destroy the tower instance
		let sellingPrice = this.sellingPrices[tower!.currentLevel - 1];
		GameUI.increaseCoin(sellingPrice);
		tower.destroy();
	}
}
