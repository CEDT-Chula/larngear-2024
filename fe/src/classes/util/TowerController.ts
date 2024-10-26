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
	towerList: BaseTower[]; // track towers in the scene

	constructor(scene: Phaser.Scene) {
		this.scene = scene;
		this.towerPrices = 100;
		this.sellingPrices = [80, 160, 240, 320, 400]; // Selling prices for towers Lv1 to Lv5
		this.towerPool = GameController.getInstance().towerPool_Current;

		this.towerList = GameController.getInstance().towerList;

		this.lastClickTime = 0;
		this.clickThreshold = 300; // Time threshold in milliseconds for double-click
	}

	placeTower(x: number, y: number, tileSize: number, scaleFactor: number) {
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

		// Update the tower position
		newTower.pos = new Phaser.Math.Vector2(x, y);
		this.towerList.push(newTower);

		GameController.getInstance().gridMap[newTower.pos.y][newTower.pos.x].occupied = true;
		console.log(`Tower placed at (${x}, ${y})`);
	}

	sellTower(sell: BaseTower) {
		const towerIndex = this.towerList.findIndex(x => x == sell);

		if (towerIndex < 0) {
			return;
		}

		const tower = this.towerList[towerIndex]

		// Destroy the tower instance
		tower.destroy();
		this.towerList.splice(towerIndex, 1); // Remove it from the list
		console.log(`Tower instance destroyed at (${tower.pos.x}, ${tower.pos.y})`);

		let sellingPrice = this.sellingPrices[tower.currentLevel - 1];
		GameUI.increaseCoin(sellingPrice);

		GameController.getInstance().gridMap[tower.pos.y][tower.pos.x].occupied = false;
		console.log(`Tower sold at (${tower.pos.x}, ${tower.pos.y})`);
	}
}
