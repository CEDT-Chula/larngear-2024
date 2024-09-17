import Phaser from "phaser";

export class TowerController {
  currency: number;
  towerPrices: number;
  sellingPrices: number[];
  coinImage: Phaser.GameObjects.Sprite;
  scene: any;
  moneyText: any;
  lastClickTime: number;
  clickThreshold: number;

  constructor(scene) {
    this.scene = scene;
    this.currency = 500; // Initialize player currency (for example)
    this.towerPrices = 100;
    this.sellingPrices = [80, 160, 240, 320, 400]; // Selling prices for towers Lv1 to Lv5

    // Add the coin image
    this.coinImage = this.scene.add
      .sprite(16, 16, "coin") // Ensure 'coin' is loaded in preload
      .setOrigin(0, 0)
      .setScale(0.5); // Adjust scale as needed

    document.fonts.ready.then(() => {
      this.moneyText = this.scene.add
        .text(68, 24, `${this.currency}`, {
          font: '20px "PressStart2P"',
          fill: "#ffd700", // Gold color
        })
        .setDepth(1); // Ensure the text is on top of other game elements
    });
    // Create the money display text

    this.lastClickTime = 0;
    this.clickThreshold = 300; // Time threshold in milliseconds for double-click
  }

  placeTower(x, y, tile, tileSize, scaleFactor) {
    if (this.currency < this.towerPrices) {
      console.log("Not enough currency to place a tower.");
      return;
    }

    // Deduct currency for placing a tower
    this.currency -= this.towerPrices;
    this.updateMoneyDisplay(); // Update the money display

    let randomTowerIndex = Math.floor(Math.random() * 5);
    let randomTower =
      "tower" + (randomTowerIndex === 0 ? "" : randomTowerIndex);

    this.scene.add
      .sprite(
        x * tileSize + tileSize / 2,
        y * tileSize + tileSize / 2,
        randomTower
      )
      .setScale(scaleFactor);

    tile.occupied = true;
    tile.towerLevel = randomTowerIndex + 1; // Track tower level
    console.log(`Tower placed at (${x}, ${y})`);
  }

  sellTower(x, y, tile, tileSize) {
    if (!tile.occupied) {
      console.log("No tower to sell at this tile.");
      return;
    }

    // Calculate selling price based on tower level
    let sellingPrice = this.sellingPrices[tile.towerLevel - 1];
    this.currency += sellingPrice;
    this.updateMoneyDisplay(); // Update the money display

    // Remove the tower sprite from the scene
    this.scene.children.getAll().forEach((child) => {
      if (
        child.x === x * tileSize + tileSize / 2 &&
        child.y === y * tileSize + tileSize / 2
      ) {
        child.destroy();
      }
    });

    tile.occupied = false;
    tile.towerLevel = null; // Clear tower level
    console.log(`Tower sold at (${x}, ${y})`);
  }

  // Function to update the displayed currency
  updateMoneyDisplay() {
    this.moneyText.setText(`${this.currency}`);
  }
}
