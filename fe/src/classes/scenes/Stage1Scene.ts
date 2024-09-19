import Phaser from "phaser";
import { MapGenerator } from "../util/MapGenerator";
import { AssetLoader } from "../util/AssetLoader";
import { ParticleEmitter } from "../util/ParticleEmitter";

export class Stage1Scene extends Phaser.Scene {

  coinImage!: Phaser.GameObjects.Sprite;
  fontLoaded: boolean = false;

  constructor() {
    super({ key: 'Stage1Scene' });
  }

  preload() {
    const assetLoader = new AssetLoader(this);

    assetLoader.preloadTowers();

    const stage1Tiles = [
      { key: "tile", path: "src/assets/tiles/grass.png" },
    ];
    assetLoader.preloadTiles(stage1Tiles);

    assetLoader.preloadCoins();

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
    const grid = mapGen.generate(20, 15); // Adjust grid size
    const emitter = new ParticleEmitter(this, "tower4")
    
    // Add coin image to the left side of the screen
    this.coinImage = this.add.sprite(10, 14, 'coin') // Adjust coordinates as needed
    .setOrigin(0, 0) // Set origin to the top-left corner
    .setScale(0.15); // Adjust scale as needed
    
    if (this.fontLoaded) {
      // this.createText();
    }
    // TODO : add pathing to grid
    const definePath = mapGen.definePath();
    console.log("Defined Path:", definePath);
    const createEnemies = mapGen.createEnemy();
    console.log("Created Enemy:", createEnemies);
    mapGen.moveEnemy(createEnemies, definePath);
    
    // TODO : add map decorations

    this.input.on('pointerdown', (pointer: any) => {

      emitter.play(12, pointer.x, pointer.y);

    });
  }

}
