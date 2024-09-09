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
      { key: "tile", path: "src/assets/tiles/placeholder_green.png" },
    ];
    assetLoader.preloadTiles(stage1Tiles);
  }

  create() {
    const mapGen = new MapGenerator(this, 64, 4);
    const grid = mapGen.generate(20, 15); // Adjust grid size

    // TODO : add pathing to grid

    // TODO : add map decorations
  }
}
