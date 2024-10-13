import Phaser from "phaser";
import WebFont from "webfontloader";
import { MapGenerator } from "../util/MapGenerator";
import { AssetLoader } from "../util/AssetLoader";
import { ParticleEmitter } from "../util/ParticleEmitter";
import { IceCreamEnemy } from "../enemies/IceCreamEnemy";
import { WaveController } from "../util/WaveController";
import { GameController } from "../util/GameController";

export class Stage1Scene extends Phaser.Scene {
  fontLoaded: boolean = false;
  speedButton!: Phaser.GameObjects.Text;
  heartImage!: Phaser.GameObjects.Image;
  healthText!: Phaser.GameObjects.Text;

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
    gameController.enemiesGroup = this.physics.add.group();

    const mapGen = new MapGenerator(this, gameController.tileSize, gameController.scaleFactor);
    const wave = new WaveController(this, gameController.enemyPerWave, mapGen);
    const grid = mapGen.generate(20, 17);
    const emitter = new ParticleEmitter(this, "");

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

    this.speedButton = this.add
      .text(
        this.cameras.main.width - 150,
        this.cameras.main.height - 50,
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

    this.input.on("pointerdown", (pointer: any) => {
      emitter.play(12, pointer.x, pointer.y);
    });

    this.scale.on("resize", this.resize.bind(this));
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

  resize() {
    this.speedButton.setPosition(
      this.cameras.main.width - 150,
      this.cameras.main.height - 50
    );
  }

  update() {
    this.healthText.setText(GameController.getInstance().playerHealth.toString())
  }
}
