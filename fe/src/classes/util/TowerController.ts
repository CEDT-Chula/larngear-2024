import Phaser from "phaser";
import { GameController } from "./GameController";
import { BaseTower } from "../Tower/BaseTower";

export class TowerController {
  coin: number;
  towerPrices: number;
  sellingPrices: number[];
  scene: Phaser.Scene;
  coinImage!: Phaser.GameObjects.Sprite;
  moneyText: any;
  lastClickTime: number;
  clickThreshold: number;

  towerPool: (new (scene: Phaser.Scene) => BaseTower)[];

  // Map to track placed towers by their positions
  towersMap: Map<string, BaseTower>;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.coin = GameController.getInstance().coin;
    this.towerPrices = 100;
    this.sellingPrices = [80, 160, 240, 320, 400]; // Selling prices for towers Lv1 to Lv5
    this.towerPool = GameController.getInstance().towerPool_Current;

    this.towersMap = new Map<string, BaseTower>();

    // Add coin image to the left side of the screen
    this.coinImage = this.scene.add.sprite(10, 14, 'coin')
      .setOrigin(0, 0)
      .setScale(0.15)
      .setDepth(1);

    this.moneyText = this.scene.add
      .text(68, 20, `${this.coin}`, {
        fontFamily: 'PressStart2P',
        fontSize: '30px',
        color: "#ffd700", // Gold color
      })
      .setDepth(1);

    this.lastClickTime = 0;
    this.clickThreshold = 300; // Time threshold in milliseconds for double-click
  }

  placeTower(x: number, y: number, tile: any, tileSize: number, scaleFactor: number) {
    if (this.coin < this.towerPrices) {
      console.log("Not enough currency to place a tower.");
      return;
    }

    this.coin -= this.towerPrices;
    this.updateMoneyDisplay();

    let randomTowerIndex = Math.floor(Math.random() * this.towerPool.length);
    let randomTower = this.towerPool[randomTowerIndex];

    let newTower: BaseTower = new randomTower(this.scene);

    newTower.setPosition(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
    newTower.setScale(scaleFactor);

    this.scene.add.existing(newTower);

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
    this.coin += sellingPrice;
    this.updateMoneyDisplay();

    tile.occupied = false;
    tile.towerLevel = null;
    console.log(`Tower sold at (${x}, ${y})`);
  }

  updateMoneyDisplay() {
    this.moneyText.setText(`${this.coin}`);
  }
}
