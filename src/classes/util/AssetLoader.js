export class AssetLoader {
  constructor(scene) {
    this.scene = scene; // Pass the scene to the loader
  }

  // Preload common assets for towers
  preloadTowers() {
    this.scene.load.image("tower", "src/assets/towers/internet_explorer_outlined.png");
    // TODO : Add more tower types as needed
  }

  // Preload specific assets for tiles (this will vary per stage)
  preloadTiles(tileAssets) {
    tileAssets.forEach((tile) => {
      this.scene.load.image(tile.key, tile.path);
    });
  }
}
