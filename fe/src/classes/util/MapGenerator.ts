import Phaser from "phaser";
import { TowerController } from "./TowerController";
import { BaseEnemy } from "../enemies/BaseEnemy";

export class MapTile extends Phaser.GameObjects.Sprite {
  occupied: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, scaleFactor: number, origin_x?: number, origin_y?: number) {
    super(scene, x, y, texture);
    this.setOrigin(origin_x ?? 0, origin_y).setScale(scaleFactor);
    this.occupied = false; // Initialize to false by default
  }
}


export class MapGenerator {
  // ! background tile must use the name 'tile' in for this code to work
  // ! path tile must use the name 'path' in for this code to work
  scene: Phaser.Scene;
  tileSize: number;
  scaleFactor: number;
  towerController: TowerController;
  path: Phaser.Curves.Line[];
  grid: MapTile[][];

  constructor(scene: Phaser.Scene, tileSize: number, scaleFactor: number) {
    this.scene = scene;
    this.tileSize = tileSize;
    this.scaleFactor = scaleFactor;
    this.towerController = new TowerController(scene);
    this.path = [];
    this.grid = [];
  }

  generate(gridWidth: number, gridHeight: number) {
    for (let y = 0; y < gridHeight; y++) {
      this.grid[y] = [];
      for (let x = 0; x < gridWidth; x++) {
        const tile = new MapTile(this.scene, x * this.tileSize, y * this.tileSize, "tile", this.scaleFactor);
        tile.setInteractive();
        this.scene.add.existing(tile);

        tile.on("pointerdown", (pointer: any) =>
          this.handleTileInteraction(x, y, tile, pointer)
        );
        this.grid[y][x] = tile;
      }
    }
    return this.grid;
  }

  handleTileInteraction(x: number, y: number, tile: MapTile, pointer: any) {
    const currentTime = pointer.downTime;
    const timeSinceLastClick = currentTime - this.towerController.lastClickTime;

    if (timeSinceLastClick < this.towerController.clickThreshold) {
      this.towerController.sellTower(x, y, tile, this.tileSize);
    } else {
      if (!tile.occupied) {
        this.towerController.placeTower(x, y, tile, this.tileSize, this.scaleFactor);
      } else {
        console.log("Tile is already occupied.");
      }
    }

    this.towerController.lastClickTime = currentTime;
  }

  definePath(grid: MapTile[][], points: Phaser.Math.Vector2[]): Phaser.Curves.Line[] {
    console.log("Path points:", points);

    const placePathTile = (x: number, y: number) => {
      if (grid[y] && grid[y][x]) {
        grid[y][x].destroy();

        const tile = new MapTile(this.scene, x * this.tileSize, y * this.tileSize, "path", this.scaleFactor);
        tile.setInteractive();
        this.scene.add.existing(tile);

        grid[y][x] = tile;
        grid[y][x].occupied = true;
      }
    };

    const lines: Phaser.Curves.Line[] = [];

    const scaledPoints = points.map(point =>
      new Phaser.Math.Vector2(point.x * this.tileSize, point.y * this.tileSize)
    );

    const startPoint = scaledPoints[0];
    const endPoint = scaledPoints[scaledPoints.length - 1];
    placePathTile(Math.floor(startPoint.x / this.tileSize), Math.floor(startPoint.y / this.tileSize));

    const placeBase = (x: number, y: number, origin_x: number, origin_y: number, name: string) => {
      if (grid[y] && grid[y][x]) {
        const tile = new MapTile(this.scene, x * this.tileSize, y * this.tileSize, name, this.scaleFactor, origin_x, origin_y);
        tile.setInteractive();
        this.scene.add.existing(tile);
        
        grid[y][x] = tile;
        grid[y][x].occupied = true;
      }
    };
    // Place Base
    placeBase(Math.floor(startPoint.x / this.tileSize), Math.floor(startPoint.y / this.tileSize) - 1, 0.32, 0.5, "enemy_base");
    placeBase(Math.floor(endPoint.x / this.tileSize), Math.floor(endPoint.y / this.tileSize) - 1, 0, 0, "player_base");

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
