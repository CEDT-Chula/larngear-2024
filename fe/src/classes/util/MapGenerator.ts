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

        tile.on("pointerdown", (pointer: any) =>
          this.handleTileInteraction(x, y, tile, pointer)
        );
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
        this.towerController.placeTower(
          x,
          y,
          tile,
          this.tileSize,
          this.scaleFactor
        );
      } else {
        console.log("Tile is already occupied.");
      }
    }

    // Update last click time
    this.towerController.lastClickTime = currentTime;
  }

  // Define the path for the enemy to walk
  definePath(): Phaser.Curves.Line[] {
    const points: Phaser.Math.Vector2[] = [
        new Phaser.Math.Vector2(0, 0),
        new Phaser.Math.Vector2(5 * this.tileSize, 0),
        new Phaser.Math.Vector2(5 * this.tileSize, 5 * this.tileSize),
        new Phaser.Math.Vector2(0, 5 * this.tileSize),
        new Phaser.Math.Vector2(0, 10 * this.tileSize),
    ];

    console.log("Path points:", points); // Debug log for path points

    const lines: Phaser.Curves.Line[] = [];
    for (let i = 0; i < points.length - 1; i++) {
        lines.push(new Phaser.Curves.Line(points[i], points[i + 1]));
    }

    return lines;
}

  // Create an enemy and set its initial position
  createEnemy(): Phaser.GameObjects.Sprite {
    const enemy = this.scene.add
      .sprite(1, 1, "tower")
      .setOrigin(0)
      .setScale(this.scaleFactor);
    this.moveEnemy(enemy, this.definePath());
    return enemy;
  }

  // Move the enemy along the defined path
  moveEnemy(
    enemy: Phaser.GameObjects.Sprite,
    path: Phaser.Curves.Line[]
  ) {
    const speed = 500; // Define a constant speed (units per second)

    const tweens = path.map((line, index) => {
      const startPoint = line.getStartPoint();
      const endPoint = line.getEndPoint();
      const distance = Phaser.Math.Distance.Between(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      const duration = (distance / speed) * 1000; // Convert to milliseconds

      return {
        targets: enemy,
        x: endPoint.x,
        y: endPoint.y,
        duration: duration,
        ease: "Linear",
        delay: 0,
        onComplete: () => {
          console.log(`Enemy moved to (${endPoint.x}, ${endPoint.y})`); // Debug log for movement
          if (index < path.length - 1) {
            this.scene.tweens.add(tweens[index + 1]);
          }
        }
      };
    });

  // Start the first tween
  this.scene.tweens.add(tweens[0]);
}}
