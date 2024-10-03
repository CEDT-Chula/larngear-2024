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

    this.towerController.lastClickTime = currentTime;
  }

  definePath(grid: any, points: Phaser.Math.Vector2[]): Phaser.Curves.Line[] {
    console.log("Path points:", points);

    const placePathTile = (x: number, y: number) => {
      if (grid[y] && grid[y][x]) {
        grid[y][x].destroy();
        grid[y][x] = this.scene.add
          .sprite(x * this.tileSize, y * this.tileSize, "path")
          .setOrigin(0)
          .setScale(this.scaleFactor);
        grid[y][x].occupied = true;
      }
    };

    const lines: Phaser.Curves.Line[] = [];

    const scaledPoints = points.map(point =>
      new Phaser.Math.Vector2(point.x * this.tileSize, point.y * this.tileSize)
    );

    const startPoint = scaledPoints[0];
    placePathTile(Math.floor(startPoint.x / this.tileSize), Math.floor(startPoint.y / this.tileSize));

    lines.push(new Phaser.Curves.Line(scaledPoints[0], scaledPoints[0]))

    for (let i = 0; i < scaledPoints.length - 1; i++) {
      const startPoint = scaledPoints[i];
      const endPoint = scaledPoints[i + 1];

      const distance = Phaser.Math.Distance.Between(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      const stepCount = Math.ceil(distance / this.tileSize);

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

  createEnemy(enemy: BaseEnemy) {
    const startPoint = this.path[0].getStartPoint();
    enemy.setPosition(startPoint.x, startPoint.y);
    this.scene.add.existing(enemy);
  }

  moveEnemy(enemy: BaseEnemy) {
    const speed = enemy.speed;
    let currentSegment = 0;
    let segmentProgress = 0;

    this.scene.events.on('update', (time: number, delta: number) => {
      if (currentSegment >= this.path.length) return;


      const startPoint = this.path[currentSegment].getStartPoint();
      const endPoint = this.path[currentSegment].getEndPoint();

      const segmentDistance = Phaser.Math.Distance.Between(startPoint.x, startPoint.y, endPoint.x, endPoint.y);

      const distanceToMove = (speed * delta) / 1000;

      segmentProgress += distanceToMove;

      if (segmentProgress >= segmentDistance) {
        segmentProgress = 0;
        currentSegment++;

        if (currentSegment >= this.path.length) {
          enemy.onArrived();
          return;
        }
      } else {
        // Calculate the interpolation factor (between 0 and 1) based on the segment progress
        const t = segmentProgress / segmentDistance;

        // Interpolate the enemy's position between the start and end points of the segment
        enemy.x = Phaser.Math.Interpolation.Linear([startPoint.x, endPoint.x], t);
        enemy.y = Phaser.Math.Interpolation.Linear([startPoint.y, endPoint.y], t);
      }
    });
  }

}