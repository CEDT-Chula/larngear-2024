import Phaser from "phaser";
import { GameController } from "./GameController";
import { BaseTower } from "../Tower/BaseTower";
import { BrowserTower } from "../Tower/BrowserTower";
import { BrowserTower1 } from "../Tower/BrowserTower1";
import { BrowserTower2 } from "../Tower/BrowserTower2";

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
    // this.towersMap.set("browserTower", new BrowserTower(scene)); 
    // this.towersMap.set("anotherTower", new BrowserTower1(scene)); 
    // this.towersMap.set("yetAnotherTower", new BrowserTower2(scene));

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

    console.log(`Random Tower: ${randomTower.name}`);

    let newTower: BaseTower = new randomTower(this.scene);

    newTower.setPosition(
      x * tileSize + tileSize / 2,
      y * tileSize + tileSize / 2
    );
    newTower.setScale(scaleFactor);

    this.scene.add.existing(newTower);

    const towerKey = `${x},${y}`;
    this.towersMap.set(towerKey, newTower);
    console.log(this.towersMap);

    tile.occupied = true;
    tile.towerLevel = randomTowerIndex + 1;

    this.debugTowers();
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
    this.debugTowers();
  }

  updateMoneyDisplay() {
    this.moneyText.setText(`${this.coin}`);
  }

  debugTowers() {
    console.log("All Towers and their Levels:");
    console.log(this.towersMap);

    // Loop through towersMap and log each tower's class name and level
    this.towersMap.forEach((tower, key) => {
      console.log(
        `Tower at ${key}: ${tower.constructor.name}, Level: ${tower.currentLevel}`
      );
    });
  }

  boostTowerSellingPrices() {
    this.debugTowers();
    this.boostedTowers = [];
    this.boostedPrices.clear();

    const allTowers = Array.from(this.towersMap.values());

    if (allTowers.length < 3) {
      console.log("Not enough towers to boost.");
      return;
    }

    let selectedTowers: BaseTower[] = [];

    // Loop to find three towers of the same class and level
    while (selectedTowers.length < 3) {
      Phaser.Utils.Array.Shuffle(allTowers);
      selectedTowers = allTowers
        .filter(
          (tower) =>
            tower.constructor.name === allTowers[0].constructor.name &&
            tower.currentLevel === allTowers[0].currentLevel
        )
        .slice(0, 3);

      if (selectedTowers.length < 3) {
        selectedTowers = [];
      }
    }

    const towerClassName = selectedTowers[0].constructor.name;
    const towerLevel = selectedTowers[0].currentLevel;

    console.log(`Boosting towers: ${towerClassName} at level ${towerLevel}`);

    // Create boosted prices specific to the tower level
    let boostedPrices = [...this.sellingPrices];
    boostedPrices[towerLevel - 1] =
      GameController.getInstance().towerPrice_Multiplier *
      boostedPrices[towerLevel - 1];

    this.boostedPrices.set(towerClassName, boostedPrices);

    // Display the boosted towers
    this.displayBoostedTowers(selectedTowers);
  }

  displayBoostedTowers(towers: BaseTower[]) {
    // Clear previous boosted tower display
    this.scene.children.getByName("boostedTowersDisplay")?.destroy();

    const displayGroup = this.scene.add.group({ name: "boostedTowersDisplay" });

    towers.forEach((tower, index) => {
      const towerClassName = tower.constructor.name;
      const towerLevel = tower.currentLevel;
      const sellingPrice =
        this.boostedPrices.get(towerClassName)?.[towerLevel - 1] ||
        this.sellingPrices[towerLevel - 1];

      const text = this.scene.add.text(
        this.scene.cameras.main.width - 250,
        50 + index * 40,
        `${towerClassName} Lvl ${towerLevel}: ${sellingPrice}`,
        {
          fontFamily: "PressStart2P",
          fontSize: "20px",
          fill: "#ffffff",
        }
      );

      displayGroup.add(text);
    });
  }
}
