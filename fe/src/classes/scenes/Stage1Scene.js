import Phaser from "phaser";
import { MapGenerator } from "../util/MapGenerator";
import { AssetLoader } from "../util/AssetLoader";

export class Stage1Scene extends Phaser.Scene {
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
  }

  create() {
    const mapGen = new MapGenerator(this, 64, 4);
    const grid = mapGen.generate(20, 15); // Adjust grid size

    // Add coin image to the left side of the screen
    this.coinImage = this.add.sprite(10, 14, 'coin') // Adjust coordinates as needed
      .setOrigin(0, 0) // Set origin to the top-left corner
      .setScale(0.15); // Adjust scale as needed


    // TODO : add pathing to grid

    // TODO : add map decorations
  }
}
