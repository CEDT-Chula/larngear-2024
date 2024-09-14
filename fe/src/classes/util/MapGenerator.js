export class MapGenerator {
  // ! background tile must use the name 'tile' in for this code to work

  constructor(scene, tileSize, scaleFactor) {
    this.scene = scene;
    this.tileSize = tileSize;
    this.scaleFactor = scaleFactor;
    this.currency = 500; // Initialize player currency (for example)
    this.towerPrices = 100;
    this.sellingPrices = [80, 160, 240, 320, 400]; // Selling prices for towers Lv1 to Lv5

    // Add the coin image
    this.coinImage = this.scene.add.sprite(16, 16, 'coin') // Ensure 'coin' is loaded in preload
      .setOrigin(0, 0)
      .setScale(0.5); // Adjust scale as needed

      document.fonts.ready.then(() => {
        this.moneyText = this.scene.add.text(68, 24, `${this.currency}`, {
          font: '20px "PressStart2P"',
          fill: '#ffd700', // Gold color
        }).setDepth(1); // Ensure the text is on top of other game elements
      });
    // Create the money display text

    this.lastClickTime = 0;
    this.clickThreshold = 300; // Time threshold in milliseconds for double-click
  }

  // use to generate background tiles
  generate(gridWidth, gridHeight) {
    let grid = [];
    for (let y = 0; y < gridHeight; y++) {
      grid[y] = [];
      for (let x = 0; x < gridWidth; x++) {
        const tile = this.scene.add
          .sprite(x * this.tileSize, y * this.tileSize, "tile")
          .setOrigin(0)
          .setInteractive()
          .setScale(this.scaleFactor);

        tile.on("pointerdown", (pointer) => this.handleTileInteraction(x, y, tile, pointer));
        grid[y][x] = tile;
      }
    }
    return grid;
  }

  handleTileInteraction(x, y, tile, pointer) {
    const currentTime = pointer.downTime;
    const timeSinceLastClick = currentTime - this.lastClickTime;

    if (timeSinceLastClick < this.clickThreshold) {
      // It's a double-click
      this.sellTower(x, y, tile);
    } else {
      // It's a single-click
      if (!tile.occupied) {
        this.placeTower(x, y, tile);
      } else {
        console.log("Tile is already occupied.");
      }
    }

    // Update last click time
    this.lastClickTime = currentTime;
  }

  placeTower(x, y, tile) {
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
        x * this.tileSize + this.tileSize / 2,
        y * this.tileSize + this.tileSize / 2,
        randomTower
      )
      .setScale(this.scaleFactor);

    tile.occupied = true;
    tile.towerLevel = randomTowerIndex + 1; // Track tower level
    console.log(`Tower placed at (${x}, ${y})`);
  }

  sellTower(x, y, tile) {
    if (!tile.occupied) {
      console.log("No tower to sell at this tile.");
      return;
    }

    // Calculate selling price based on tower level
    let sellingPrice = this.sellingPrices[tile.towerLevel - 1];
    this.currency += sellingPrice;
    this.updateMoneyDisplay(); // Update the money display

    // Remove the tower sprite from the scene
    this.scene.children.getAll().forEach(child => {
      if (child.x === x * this.tileSize + this.tileSize / 2 && 
          child.y === y * this.tileSize + this.tileSize / 2) {
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
