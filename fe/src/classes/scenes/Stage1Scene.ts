import Phaser from "phaser";
import WebFont from 'webfontloader';
import { MapGenerator } from "../util/MapGenerator";
import { AssetLoader } from "../util/AssetLoader";
import { ParticleEmitter } from "../util/ParticleEmitter";
import { IceCreamEnemy } from "../enemies/IceCreamEnemy";
import { WaveController } from "../util/WaveController";

export class Stage1Scene extends Phaser.Scene {
  fontLoaded: boolean = false;

  constructor() {
    super({ key: 'Stage1Scene' });
  }

  preload() {
    const assetLoader = new AssetLoader(this);

    assetLoader.preloadTowers();

    const stage1Tiles = [
      { key: "tile", path: "src/assets/tiles/grass.png" },
      { key: "path", path: "src/assets/tiles/dirt.png" },
    ];
    assetLoader.preloadTiles(stage1Tiles);

    assetLoader.preloadCoins();

    assetLoader.preloadEnemies();

    this.loadFont();
  }

  loadFont() {
    WebFont.load({
      custom: {
        families: ['PressStart2P'],  // Replace with your font name
        urls: ['src/index.css']   // The CSS file for your custom font
      },
      active: () => {
        this.fontLoaded = true; // Mark the font as loaded
        // this.createText(); // Call function to create the text
      },
      inactive: () => {
        console.error('Font failed to load');
      }
    });
  }

  create() {
    const mapGen = new MapGenerator(this, 64, 4);
    const wave = new WaveController(this, 30, mapGen);
    const grid = mapGen.generate(20, 17);
    const emitter = new ParticleEmitter(this, "tower4")

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
    const enemies = [
      new IceCreamEnemy(this),
      new IceCreamEnemy(this),
      new IceCreamEnemy(this),
    ];

    wave.releaseWave(enemies, 200);

    // TODO : add map decorations

    this.input.on('pointerdown', (pointer: any) => {

      emitter.play(12, pointer.x, pointer.y);

    });
  }

  update() {

  }
}
