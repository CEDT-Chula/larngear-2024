import Phaser from "phaser";
import { TowerController } from "./TowerController";

export class MapGenerator {
  // ! background tile must use the name 'tile' in for this code to work
  scene: Phaser.Scene;
  tileSize: number;
  scaleFactor: number;
  towerController: TowerController;

  constructor(scene: Phaser.Scene, tileSize: number, scaleFactor: number) {
    this.scene = scene;
    this.tileSize = tileSize;
    this.scaleFactor = scaleFactor;
    this.towerController = new TowerController(scene);
  }

  // use to generate background tiles
  generate(gridWidth: number, gridHeight: number) {
    let grid: any = [];
    for (let y = 0; y < gridHeight; y++) {
      grid[y] = [];
      for (let x = 0; x < gridWidth; x++) {
        const tile = this.scene.add
          .sprite(x * this.tileSize, y * this.tileSize, "tile")
          .setOrigin(0)
          .setInteractive()
          .setScale(this.scaleFactor);

        tile.on("pointerdown", (pointer: any) => this.handleTileInteraction(x, y, tile, pointer));
        grid[y][x] = tile;
      }
    }
    return grid;
  }

  handleTileInteraction(x: number, y: number, tile: any, pointer: any) {
    const currentTime = pointer.downTime;
    const timeSinceLastClick = currentTime - this.towerController.lastClickTime;

    if (timeSinceLastClick < this.towerController.clickThreshold) {
      // It's a double-click
      this.towerController.sellTower(x, y, tile, this.tileSize);
    } else {
      // It's a single-click
      if (!tile.occupied) {
        this.towerController.placeTower(x, y, tile, this.tileSize, this.scaleFactor);
      } else {
        console.log("Tile is already occupied.");
      }
    }

    // Update last click time
    this.towerController.lastClickTime = currentTime;
  }
}
