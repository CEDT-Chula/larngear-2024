export class MapGenerator {
  // ! background tile must use the name 'tile' in for this code to work

  constructor(scene, tileSize, scaleFactor) {
    this.scene = scene;
    this.tileSize = tileSize;
    this.scaleFactor = scaleFactor;
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

        tile.on("pointerdown", () => this.placeTower(x, y, tile));
        grid[y][x] = tile;
      }
    }
    return grid;
  }

  placeTower(x, y, tile) {
    // TODO : Make tower behave like one
    if (tile.occupied) {
      console.log("occupied at ", x, y);
      return;
    }

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
  }
}
