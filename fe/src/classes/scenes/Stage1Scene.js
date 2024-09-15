import Phaser from "phaser";
import { MapGenerator } from "../util/MapGenerator";
import { AssetLoader } from "../util/AssetLoader";
import { ParticleEmitter } from "../util/ParticleEmitter";

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
  }

  create() {
    const mapGen = new MapGenerator(this, 64, 4);
    const grid = mapGen.generate(20, 15); // Adjust grid size
    const emitter = new ParticleEmitter(this, "tower4")

    // TODO : add pathing to grid

    // TODO : add map decorations

    this.input.on('pointerdown', pointer => {

      emitter.play(12, pointer.x, pointer.y);

  });
  }
}
