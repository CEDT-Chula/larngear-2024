import Phaser from "phaser";
import { TowerController } from "./TowerController";
import { BaseEnemy } from "../enemies/BaseEnemy";

export class MapGenerator {
  // ! background tile must use the name 'tile' in for this code to work
  // ! path tile must use the name 'path' in for this code to work
  scene: Phaser.Scene;
  tileSize: number;
  scaleFactor: number;
  towerController: TowerController;
  path: Phaser.Curves.Line[];

  constructor(scene: Phaser.Scene, tileSize: number, scaleFactor: number) {
    this.scene = scene;
    this.tileSize = tileSize;
    this.scaleFactor = scaleFactor;
    this.towerController = new TowerController(scene);
    this.path = [];
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
  definePath(grid: any, points: Phaser.Math.Vector2[]): Phaser.Curves.Line[] {
    console.log("Path points:", points); // Debug log for path points

    // Helper function to replace tiles with path tiles
    const placePathTile = (x: number, y: number) => {
      if (grid[y] && grid[y][x]) {
        grid[y][x].destroy(); // Remove the background tile
        grid[y][x] = this.scene.add
          .sprite(x * this.tileSize, y * this.tileSize, "path") // Add the path tile
          .setOrigin(0)
          .setScale(this.scaleFactor);
        grid[y][x].occupied = true; // Mark this tile as occupied
      }
    };

    const lines: Phaser.Curves.Line[] = [];

    // Convert the points by multiplying them with this.tileSize inside the function
    const scaledPoints = points.map(point => 
      new Phaser.Math.Vector2(point.x * this.tileSize, point.y * this.tileSize)
    );
    
    // Handle starting point tile
    const startPoint = scaledPoints[0];
    placePathTile(Math.floor(startPoint.x / this.tileSize), Math.floor(startPoint.y / this.tileSize));

    lines.push(new Phaser.Curves.Line(scaledPoints[0], scaledPoints[0]))

    // Replace background tiles with path tiles based on the defined points
    for (let i = 0; i < scaledPoints.length - 1; i++) {
      const startPoint = scaledPoints[i];
      const endPoint = scaledPoints[i + 1];

      // Calculate the distance between the points
      const distance = Phaser.Math.Distance.Between(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      const stepCount = Math.ceil(distance / this.tileSize);

      // Interpolate between the start and end points
      for (let step = 0; step <= stepCount; step++) {
        const t = step / stepCount;
        const x = Phaser.Math.Interpolation.Linear([startPoint.x, endPoint.x], t);
        const y = Phaser.Math.Interpolation.Linear([startPoint.y, endPoint.y], t);

        const tileX = Math.floor(x / this.tileSize);
        const tileY = Math.floor(y / this.tileSize);

        placePathTile(tileX, tileY);
      }
    }

    for (let i = 0; i < scaledPoints.length - 1; i++) {
      lines.push(new Phaser.Curves.Line(scaledPoints[i], scaledPoints[i + 1]));
    }

    this.path = lines;

    return lines;
  }


  // Create an enemy and set its initial position
  createEnemy(enemy: BaseEnemy): Phaser.GameObjects.Sprite {
    return enemy;
  }

  // Move the enemy along the defined path
  moveEnemy(
    enemy: BaseEnemy,
  ) {
    const speed = enemy.speed; // Define a constant speed (units per second)

    const tweens = this.path.map((line, index) => {
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

          if (index >= this.path.length - 1) {
            enemy.arrived(); // reach the end of the road
          }

          if (index < this.path.length - 1) {
            this.scene.tweens.add(tweens[index + 1]);
          }
        }
      };
    });

    // Start the first tween
    this.scene.tweens.add(tweens[0]);
  }
}
