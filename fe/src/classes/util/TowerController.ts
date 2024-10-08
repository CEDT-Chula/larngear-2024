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
  boostedTowers: string[];
  boostedPrices: Map<string, number[]>;

  towerPool: (new (scene: Phaser.Scene) => BaseTower)[];

  towersMap: Map<string, BaseTower>;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.coin = GameController.getInstance().coin;
    this.towerPrices = 100;
    this.sellingPrices = [80, 160, 240, 320, 400];
    this.towerPool = GameController.getInstance().towerPool_Current;

    this.towersMap = new Map<string, BaseTower>();

    this.coinImage = this.scene.add
      .sprite(10, 14, "coin")
      .setOrigin(0, 0)
      .setScale(0.15)
      .setDepth(1);

    this.moneyText = this.scene.add
      .text(68, 20, `${this.coin}`, {
        fontFamily: "PressStart2P",
        fontSize: "30px",
        fill: "#ffd700",
      })
      .setDepth(1);

    this.lastClickTime = 0;
    this.clickThreshold = 300;

    this.boostedTowers = [];
    this.boostedPrices = new Map<string, number[]>();
  }

  placeTower(
    x: number,
    y: number,
    tile: any,
    tileSize: number,
    scaleFactor: number
  ) {
    if (this.coin < this.towerPrices) {
      return;
    }

    this.coin -= this.towerPrices;
    this.updateMoneyDisplay();

    let randomTowerIndex = Math.floor(Math.random() * this.towerPool.length);
    let randomTower = this.towerPool[randomTowerIndex];

    let newTower: BaseTower = new randomTower(this.scene);

    newTower.setPosition(
      x * tileSize + tileSize / 2,
      y * tileSize + tileSize / 2
    );
    newTower.setScale(scaleFactor);

    this.scene.add.existing(newTower);

    const towerKey = `${x},${y}`;
    this.towersMap.set(towerKey, newTower);

    tile.occupied = true;
    tile.towerLevel = randomTowerIndex + 1;
  }

  sellTower(x: number, y: number, tile: any, tileSize: number) {
    if (!tile.occupied) {
      return;
    }

    const towerKey = `${x},${y}`;
    const tower = this.towersMap.get(towerKey);

    if (tower) {
      tower.destroy();
      this.towersMap.delete(towerKey);
    }

    let sellingPrice = this.sellingPrices[tile.towerLevel - 1];

    const towerClassName = tower?.constructor.name || "";
    if (this.boostedPrices.has(towerClassName)) {
      const boostedPrices = this.boostedPrices.get(towerClassName);
      if (boostedPrices) {
        sellingPrice = boostedPrices[tile.towerLevel - 1];
      }
    }

    this.coin += sellingPrice;
    this.updateMoneyDisplay();

    tile.occupied = false;
    tile.towerLevel = null;
  }

  updateMoneyDisplay() {
    this.moneyText.setText(`${this.coin}`);
  }

  boostTowerSellingPrices() {
    this.boostedTowers = [];
    this.boostedPrices.clear();

    let towerClassNames = this.towerPool.map((towerClass) => towerClass.name);
    Phaser.Utils.Array.Shuffle(towerClassNames);

    this.boostedTowers = towerClassNames.slice(0, 3);

    this.boostedTowers.forEach((towerClassName) => {
      let boostedTowerPrices: number[] = [];

      this.sellingPrices.forEach((price, level) => {
        const boostedPrice = price * Phaser.Math.Between(3, 5);
        boostedTowerPrices.push(boostedPrice);
      });

      this.boostedPrices.set(towerClassName, boostedTowerPrices);
    });
  }

  resetBoostedPrices() {
    this.boostedTowers = [];
    this.boostedPrices.clear();
  }
}
