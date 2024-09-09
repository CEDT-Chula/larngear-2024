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

    this.scene.add
      .sprite(
        x * this.tileSize + this.tileSize / 2,
        y * this.tileSize + this.tileSize / 2,
        "tower"
      )
      .setScale(this.scaleFactor);
    tile.occupied = true;
  }
}
