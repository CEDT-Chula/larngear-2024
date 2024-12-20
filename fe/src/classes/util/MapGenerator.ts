import Phaser from "phaser";
import { TowerController } from "./TowerController";
import { BaseEnemy } from "../enemies/BaseEnemy";
import { GameController } from "./GameController";

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

  waveConfirmButton!: Phaser.GameObjects.Rectangle;
  waveConfirmText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, tileSize: number, scaleFactor: number) {
    this.scene = scene;
    this.tileSize = tileSize;
    this.scaleFactor = scaleFactor;
    this.towerController = GameController.getInstance().towerController;
    this.path = [];
    this.grid = GameController.getInstance().gridMap;
  }

  generate(gridWidth: number, gridHeight: number, trimTop: number = 4) {
    for (let y = 0; y < gridHeight; y++) {
      this.grid[y] = [];
      for (let x = 0; x < gridWidth; x++) {
        const tile = new MapTile(this.scene, x * this.tileSize, y * this.tileSize, "tile", this.scaleFactor);
        this.scene.add.existing(tile);

        if (y >= trimTop) { // Trim the top
          tile.setInteractive();
          tile.on("pointerup", (pointer: any) => {
            if (!GameController.getInstance().isDragging) {
              if (!tile.occupied) {
                this.towerController.placeTower(x, y, this.tileSize, this.scaleFactor);
              } else {
                console.log("Tile is already occupied.");
              }
            }
          });
        }
        this.grid[y][x] = tile;
      }
    }
    return this.grid;
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
    const playerBaseX = Math.floor(endPoint.x / this.tileSize);
    const playerBaseY = Math.floor(endPoint.y / this.tileSize) - 1;

    placeBase(playerBaseX, playerBaseY, 0, 0, "player_base");

    this.waveConfirmButton = this.scene.add.rectangle(
      playerBaseX * this.tileSize,
      playerBaseY * this.tileSize,
      this.tileSize * 3.32,
      this.tileSize - 16,
      0xffffff,
      1
    ).setOrigin(0.34, -0.16).setInteractive().setDepth(5);

    this.waveConfirmText = this.scene.add.text(
      playerBaseX * this.tileSize,
      playerBaseY * this.tileSize,
      'Start Wave',
      {
        fontFamily: 'PressStart2P',
        fontSize: '18px',
        color: '#FFFFFF', // White text
        backgroundColor: '#000000',
        padding: { left: 5, right: 5, top: 5, bottom: 5 },
        align: 'center',
      }
    ).setOrigin(0.32, -0.64).setDepth(6);

    this.scene.events.on('wait_confirm_release_wave', () => {
      console.log("wait_confirm_release_wave triggered");
      this.showWaveConfirmButton();
    });

    this.waveConfirmButton.on('pointerdown', () => {
      this.scene.sound.play("start_wave")
      this.scene.events.emit('confirm_release_wave');
      this.hideWaveConfirmButton();
    });

    this.hideWaveConfirmButton();

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
    this.scene.add.existing(enemy.healthBar);
  }

  moveEnemy(enemy: BaseEnemy) {
    let currentSegment = 0;
    let segmentProgress = 0;

    const updateHandler = (time: number, delta: number) => {
      if (!enemy.isAlive) {
        this.scene.events.off('update', updateHandler);
        return;
      }
      if (currentSegment >= this.path.length) return;

      const startPoint = this.path[currentSegment].getStartPoint();
      const endPoint = this.path[currentSegment].getEndPoint();

      const segmentDistance = Phaser.Math.Distance.Between(startPoint.x, startPoint.y, endPoint.x, endPoint.y);

      // Use the **current speed** dynamically
      const distanceToMove = (enemy.speed * delta * this.scene.time.timeScale) / 1000;

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
    };

    this.scene.events.on('update', updateHandler);
  }

  showWaveConfirmButton() {
    this.waveConfirmButton.setVisible(true).setInteractive();
    this.waveConfirmText.setVisible(true);
  }

  hideWaveConfirmButton() {
    this.waveConfirmButton.setVisible(false).disableInteractive();
    this.waveConfirmText.setVisible(false);
  }

}
