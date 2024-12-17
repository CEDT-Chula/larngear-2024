import Phaser from "phaser";
import WebFont from "webfontloader";
import { MapGenerator } from "../util/MapGenerator";
import { AssetLoader } from "../util/AssetLoader";
import { ParticleEmitter } from "../util/ParticleEmitter";
import { IceCreamEnemy } from "../enemies/IceCreamEnemy";
import { WaveController } from "../util/WaveController";
import { GameController } from "../util/GameController";
import { TowerController } from "../util/TowerController";
import { GameUI } from "../util/GameUI";

export class Stage1Scene extends Phaser.Scene {
  fontLoaded: boolean = false;
  speedButton!: Phaser.GameObjects.Text;
  heartImage!: Phaser.GameObjects.Image;
  healthText!: Phaser.GameObjects.Text;
  coinIcon!: Phaser.GameObjects.Image;
  coinText!: Phaser.GameObjects.Text;
  popupElements!: Phaser.GameObjects.GameObject[];

  constructor() {
    super({ key: "Stage1Scene" });
  }

  preload() {
    const assetLoader = new AssetLoader(this);

    assetLoader.preloadTowers();

    const stage1Tiles = [
      { key: "tile", path: "src/assets/tiles/grass.png" },
      { key: "path", path: "src/assets/tiles/dirt.png" },
      { key: "enemy_base", path: "src/assets/base/enemy_base.png" },
      { key: "player_base", path: "src/assets/base/player_base_0.png" },
    ];
    assetLoader.preloadTiles(stage1Tiles);
    assetLoader.preloadEnemies();
    assetLoader.preloadOthers();

    this.loadFont();
  }

  loadFont() {
    WebFont.load({
      custom: {
        families: ["PressStart2P"],
        urls: ["src/index.css"],
      },
      active: () => {
        this.fontLoaded = true;
      },
      inactive: () => {
        console.error("Font failed to load");
      },
    });
  }

  create() {
    const gameController = GameController.getInstance();
    gameController.currentScene = this;

    const gameUi = GameUI.getInstance();

    gameController.enemiesGroup = this.physics.add.group();
    gameController.towerController = new TowerController(this);

    const mapGen = new MapGenerator(this, gameController.tileSize, gameController.scaleFactor);
    gameController.mapGen = mapGen;
    const wave = new WaveController(this, gameController.maxWave, mapGen);
    gameController.waveController = wave;
    this.popupElements = wave.popupElements;
    const grid = mapGen.generate(20, 17);
    const emitter = new ParticleEmitter(this, "");

    const screenWidth = this.scale.width;
    const screenHeight = this.scale.height;

    const worldWidth = grid[0].length * gameController.tileSize;
    const worldHeight = grid.length * gameController.tileSize;

    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.setViewport(0, 0, screenWidth, screenHeight);

    console.log("Camera Size:", screenWidth, screenHeight);
    console.log("World Size:", worldWidth, worldHeight);

    // *** Zoom ***
    const minZoom = Math.max(screenWidth / worldWidth, screenHeight / worldHeight);
    this.cameras.main.setZoom(minZoom);

    this.input.on("wheel", (pointer: Phaser.Input.Pointer, gameObjects: any, deltaX: any, deltaY: any) => {
      const zoomSpeed = 0.3;
      const newZoom = Phaser.Math.Clamp(this.cameras.main.zoom - deltaY * zoomSpeed * 0.001, minZoom, 2);

      this.cameras.main.setZoom(newZoom);
    });


    // *** Drag ***
    let dragThreshold = 10;
    let dragStartX = 0;
    let dragStartY = 0;

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      gameController.isDragging = false;
      dragStartX = pointer.worldX; // Use world coordinates for zoom consistency
      dragStartY = pointer.worldY;
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) {
        const deltaX = dragStartX - pointer.worldX;
        const deltaY = dragStartY - pointer.worldY;

        this.cameras.main.scrollX += deltaX;
        this.cameras.main.scrollY += deltaY;

        dragStartX = pointer.worldX;
        dragStartY = pointer.worldY;

        const distance = Phaser.Math.Distance.Between(dragStartX, dragStartY, pointer.x, pointer.y);
        if (distance > dragThreshold) {
          gameController.isDragging = true;
        }
      }
    });


    const points: Phaser.Math.Vector2[] = [
      new Phaser.Math.Vector2(2, 4), // Starting Point
      new Phaser.Math.Vector2(2, 8),
      new Phaser.Math.Vector2(17, 8),
      new Phaser.Math.Vector2(17, 4),
      new Phaser.Math.Vector2(11, 4),
      new Phaser.Math.Vector2(11, 15),
      new Phaser.Math.Vector2(17, 15),
      new Phaser.Math.Vector2(17, 11),
      new Phaser.Math.Vector2(2, 11),
      new Phaser.Math.Vector2(2, 15),
      new Phaser.Math.Vector2(8, 15),
      new Phaser.Math.Vector2(8, 4),
      new Phaser.Math.Vector2(6, 4),
    ];

    const definePath = mapGen.definePath(grid, points);
    console.log("Defined Path:", definePath);

    const enemies = [];
    for (let i = 0; i < gameController.enemyPerWave; i++) {
      const newEnemy = new IceCreamEnemy(this);
      enemies.push(newEnemy);
    }

    wave.confirmReleaseWave(enemies)
    this.events.emit("wait_confirm_release_wave");

    this.coinIcon = this.add
      .image(32, 32, "coin")
      .setScale(3)
      .setDepth(1);

    this.coinText = this.add
      .text(68, 20, `${GameController.getInstance().coin}`, {
        fontFamily: "PressStart2P",
        fontSize: "30px",
        color: "#ffd700", // Gold color
      })
      .setDepth(1);

    this.speedButton = this.add
      .text(
        worldWidth - 150,
        worldHeight - 50,
        "Speed x1",
        {
          fontSize: "24px",
          fontFamily: "PressStart2P",
          backgroundColor: "#000",
          color: "#fff",
          padding: { left: 10, right: 10, top: 5, bottom: 5 },
        }
      )
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", this.handleSpeedToggle.bind(this));


    this.heartImage = this.add.image(200, 32, "heart").setScale(3)

    this.healthText = this.add.text(240, 20, GameController.getInstance().playerHealth.toString(),
      {
        fontSize: "30px",
        fontFamily: "PressStart2P",
        color: "#fe0000",
      }
    );

    gameUi.coinIcon = this.coinIcon;
    gameUi.coinText = this.coinText;
    gameUi.heartIcon = this.heartImage;
    gameUi.healthText = this.healthText;
    gameUi.speedButton = this.speedButton;

    this.input.on("pointerdown", (pointer: any) => {
      emitter.explode(12, pointer.worldX, pointer.worldY);

      console.log("pointer at", pointer.worldX, pointer.worldY)
    });
  }

  handleSpeedToggle() {
    if (this.time.timeScale == 1) {
      this.time.timeScale = 2
    } else {
      this.time.timeScale = 1
    }

    console.log(this.time.timeScale)

    this.speedButton.setText("Speed x" + this.time.timeScale)
  }

  update() {
    this.healthText.setText(GameController.getInstance().playerHealth.toString())

    GameUI.getInstance().alignCamera(this.cameras.main)
  }
}