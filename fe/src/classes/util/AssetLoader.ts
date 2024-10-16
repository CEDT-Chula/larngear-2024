import Phaser from "phaser";

export class AssetImport {
  key!: string;
  path!: string;
}

export class AssetLoader {
  scene: any;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  preloadTowers() {
    // Browser Tower
    this.scene.load.image("browser_lv1", "src/assets/towers/browser/internet_explorer.png");
    this.scene.load.image("browser_lv2", "src/assets/towers/browser/chrome.png");
    this.scene.load.image("browser_lv3", "src/assets/towers/browser/firefox.png");
    this.scene.load.image("browser_lv4", "src/assets/towers/browser/microsoft_edge.png");
    this.scene.load.image("browser_lv5", "src/assets/towers/browser/opera_gx.png");
    // Programming Language Tower
    this.scene.load.image("pl_lv1", "src/assets/towers/pl/cpp.png");
    this.scene.load.image("pl_lv2", "src/assets/towers/pl/python.png");
    this.scene.load.image("pl_lv3", "src/assets/towers/pl/java.png");
    this.scene.load.image("pl_lv4", "src/assets/towers/pl/javascript.png");
    this.scene.load.image("pl_lv5", "src/assets/towers/pl/typescript.png");
    // IDE Tower
    this.scene.load.image("ide_lv1", "src/assets/towers/ide/notepad.png");
    this.scene.load.image("ide_lv2", "src/assets/towers/ide/scratch.png");
    this.scene.load.image("ide_lv3", "src/assets/towers/ide/vscode.png");
    this.scene.load.image("ide_lv4", "src/assets/towers/ide/visualstudio.png");
    this.scene.load.image("ide_lv5", "src/assets/towers/ide/intellij.png");
    // TODO : Add more tower types as needed
  }

  preloadTiles(tileAssets: AssetImport[]) {
    tileAssets.forEach((tile) => {
      this.scene.load.image(tile.key, tile.path);
    });
  }

  preloadEnemies() {
    this.scene.load.image("ice_cream", "src/assets/enemies/ice_cream.png");
    this.scene.load.image("choco", "src/assets/enemies/choco.png");
    this.scene.load.image("cake", "src/assets/enemies/cake.png");
    this.scene.load.image("coffee", "src/assets/enemies/coffee.png");
  }

  preloadOthers() {
    this.scene.load.image("coin", "src/assets/coin.png");
    this.scene.load.image("heart", "src/assets/heart.png");
  }
}
