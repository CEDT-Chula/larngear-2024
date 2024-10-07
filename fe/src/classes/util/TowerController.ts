import Phaser from "phaser";
import { GameController } from "./GameController";
import { BaseTower } from "../Tower/BaseTower";

export class TowerController {
  coin: number;
  towerPrices: number;
  sellingPrices: number[];
  boostedPrices: Map<number, number>;
  boostedMultiplier: number;
  scene: Phaser.Scene;
  coinImage!: Phaser.GameObjects.Sprite;
  moneyText: any;
  lastClickTime: number;
  clickThreshold: number;
  towerPool: (new (scene: Phaser.Scene) => BaseTower)[];
  boostedTowers: Set<number>;

  // Map to track placed towers by their positions
  towersMap: Map<string, BaseTower>;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.coin = GameController.getInstance().coin;
    this.towerPrices = 100;
    this.sellingPrices = [80, 160, 240, 320, 400]; // Selling prices for towers Lv1 to Lv5
    this.boostedPrices = new Map();
    this.boostedTowers = new Set();
    this.boostedMultiplier = 3; //
    this.towerPool = GameController.getInstance().towerPool_Current;

    this.towersMap = new Map<string, BaseTower>();

    // Add coin image to the left side of the screen
    this.coinImage = this.scene.add
      .sprite(10, 14, "coin")
      .setOrigin(0, 0)
      .setScale(0.15)
      .setDepth(1);

    this.moneyText = this.scene.add
      .text(68, 20, `${this.coin}`, {
        fontFamily: "PressStart2P",
        fontSize: "30px",
        fill: "#ffd700", // Gold color
      })
      .setDepth(1);

    this.lastClickTime = 0;
    this.clickThreshold = 300; // Time threshold in milliseconds for double-click
  }

  resetBoostedPricesForRound() {
    this.boostedTowers.clear(); // Clear previous boosted towers
    const towerCount = this.towerPool.length;

    while (this.boostedTowers.size < 3) {
      const randomIndex = Math.floor(Math.random() * towerCount);
      this.boostedTowers.add(randomIndex); // Add randomly selected tower index
    }

    this.updateBoostedPrices();
    this.displayBoostedPrices();
  }

  // Update boosted prices
  updateBoostedPrices() {
    this.boostedPrices.clear(); // Clear previous prices

    this.boostedTowers.forEach((index) => {
      const boostedPrice = this.towerPrices * this.boostedMultiplier;  //TODO: find how to calculate the boosted price
      this.boostedPrices.set(index, boostedPrice);
    });
  }

  // Display boosted prices (log for now, can replace with in-game UI display)
  displayBoostedPrices() {
    console.log("Boosted Tower Prices for this round:");
    this.boostedTowers.forEach((index) => {
      const boostedPrice = this.boostedPrices.get(index);
      console.log(`Tower ${index + 1}: Price = ${boostedPrice}`);
    });
  }

//TODO: fix the getTowerPrice function
  getTowerPrice(towerIndex: number) {
    return this.boostedPrices.has(towerIndex)
      ? this.boostedPrices.get(towerIndex)
      : 0// TODO: what should be the default price if the tower is not boosted?;
  }

  placeTower(
    x: number,
    y: number,
    tile: any,
    tileSize: number,
    scaleFactor: number
  ) {
    const randomTowerIndex = Math.floor(Math.random() * this.towerPool.length);
    const towerPrice = this.getTowerPrice(randomTowerIndex); // Get the price of t
    if (this.coin < this.towerPrices) {
      console.log("Not enough currency to place a tower.");
      return;
    }

    this.coin -= this.towerPrices;
    this.updateMoneyDisplay();

    let randomTower = this.towerPool[randomTowerIndex];

    let newTower: BaseTower = new randomTower(this.scene);

    newTower.setPosition(
      x * tileSize + tileSize / 2,
      y * tileSize + tileSize / 2
    );
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
    console.log("Tile:", this.towerPool);
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
