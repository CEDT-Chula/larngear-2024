import Phaser from "phaser";

export class AssetImport {
  key!: string;
  path!: string;
}

export class AssetLoader {
  scene: any;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene; // Pass the scene to the loader
  }

  // Preload common assets for towers
  preloadTowers() {
    this.scene.load.image("tower", "src/assets/towers/internet_explorer.png");
    this.scene.load.image("tower1", "src/assets/towers/chrome.png");
    this.scene.load.image("tower2", "src/assets/towers/firefox.png");
    this.scene.load.image("tower3", "src/assets/towers/microsoft_edge.png");
    this.scene.load.image("tower4", "src/assets/towers/opera_gx.png");
    // TODO : Add more tower types as needed
  }

  // Preload specific assets for tiles (this will vary per stage)
  preloadTiles(tileAssets: AssetImport[]) {
    tileAssets.forEach((tile) => {
      this.scene.load.image(tile.key, tile.path);
    });
  }

  preloadCoins() {
    this.scene.load.image("coin", "src/assets/coin.png")
  }
}
