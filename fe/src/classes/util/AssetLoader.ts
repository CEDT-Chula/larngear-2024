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
    // AI Tower
    this.scene.load.image("ai_lv1", "src/assets/towers/ai/gemini.png");
    this.scene.load.image("ai_lv2", "src/assets/towers/ai/copilot.png");
    this.scene.load.image("ai_lv3", "src/assets/towers/ai/perplexity.png");
    this.scene.load.image("ai_lv4", "src/assets/towers/ai/mistral.png");
    this.scene.load.image("ai_lv5", "src/assets/towers/ai/chatGPT.png");
    // Command Line Interface Tower
    this.scene.load.image("cli_lv1", "src/assets/towers/cli/terminal.png");
    this.scene.load.image("cli_lv2", "src/assets/towers/cli/powershell.png");
    this.scene.load.image("cli_lv3", "src/assets/towers/cli/ohMyZhs.png");
    this.scene.load.image("cli_lv4", "src/assets/towers/cli/bash.png");
    this.scene.load.image("cli_lv5", "src/assets/towers/cli/fish.png");
    // Database Tower
    this.scene.load.image("db_lv1", "src/assets/towers/database/mySql.png");
    this.scene.load.image("db_lv2", "src/assets/towers/database/pgAdmin.png");
    this.scene.load.image("db_lv3", "src/assets/towers/database/mongo.png");
    this.scene.load.image("db_lv4", "src/assets/towers/database/sqlite.png");
    this.scene.load.image("db_lv5", "src/assets/towers/database/oracle.png");
    // Meeting Tower
    this.scene.load.image("meet_lv1", "src/assets/towers/meeting/teams.png");
    this.scene.load.image("meet_lv2", "src/assets/towers/meeting/meet.png");
    this.scene.load.image("meet_lv3", "src/assets/towers/meeting/zoom.png");
    this.scene.load.image("meet_lv4", "src/assets/towers/meeting/webex.png");
    this.scene.load.image("meet_lv5", "src/assets/towers/meeting/discord.png");
    // Search Engine Tower
    this.scene.load.image("se_lv1", "src/assets/towers/search engine/yahoo.png");
    this.scene.load.image("se_lv2", "src/assets/towers/search engine/bing.png");
    this.scene.load.image("se_lv3", "src/assets/towers/search engine/google.png");
    this.scene.load.image("se_lv4", "src/assets/towers/search engine/baidu.png");
    this.scene.load.image("se_lv5", "src/assets/towers/search engine/duckduck.png");
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
    this.scene.load.image("coke", "src/assets/enemies/coke.png");
    this.scene.load.image("cupcake", "src/assets/enemies/cupcake.png");
    this.scene.load.image("macaroon", "src/assets/enemies/macaron.png");
    this.scene.load.image("boss", "src/assets/enemies/boss.png");
  }

  preloadOthers() {
    this.scene.load.image("coin", "src/assets/coin.png");
    this.scene.load.image("heart", "src/assets/heart.png");

    this.scene.load.image("bomb", "src/assets/effects/bomb.png")
    this.scene.load.image("fire", "src/assets/effects/fire.png")
    this.scene.load.image("poison", "src/assets/effects/poison.png")
    this.scene.load.image("slow", "src/assets/effects/slow.png")
    this.scene.load.image("smoke", "src/assets/effects/smoke.png")
    this.scene.load.image("ricochet", "src/assets/effects/ricochet.png")
    this.scene.load.image("crit", "src/assets/effects/crit.png")
  }
}
