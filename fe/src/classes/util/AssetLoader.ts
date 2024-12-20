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
    this.scene.load.image("browser_lv1", "assets/towers/browser/internet_explorer.png");
    this.scene.load.image("browser_lv2", "assets/towers/browser/chrome.png");
    this.scene.load.image("browser_lv3", "assets/towers/browser/firefox.png");
    this.scene.load.image("browser_lv4", "assets/towers/browser/microsoft_edge.png");
    this.scene.load.image("browser_lv5", "assets/towers/browser/opera_gx.png");
    // Programming Language Tower
    this.scene.load.image("pl_lv1", "assets/towers/pl/cpp.png");
    this.scene.load.image("pl_lv2", "assets/towers/pl/python.png");
    this.scene.load.image("pl_lv3", "assets/towers/pl/java.png");
    this.scene.load.image("pl_lv4", "assets/towers/pl/javascript.png");
    this.scene.load.image("pl_lv5", "assets/towers/pl/typescript.png");
    // IDE Tower
    this.scene.load.image("ide_lv1", "assets/towers/ide/notepad.png");
    this.scene.load.image("ide_lv2", "assets/towers/ide/scratch.png");
    this.scene.load.image("ide_lv3", "assets/towers/ide/vscode.png");
    this.scene.load.image("ide_lv4", "assets/towers/ide/visualstudio.png");
    this.scene.load.image("ide_lv5", "assets/towers/ide/intellij.png");
    // AI Tower
    this.scene.load.image("ai_lv1", "assets/towers/ai/gemini.png");
    this.scene.load.image("ai_lv2", "assets/towers/ai/copilot.png");
    this.scene.load.image("ai_lv3", "assets/towers/ai/perplexity.png");
    this.scene.load.image("ai_lv4", "assets/towers/ai/mistral.png");
    this.scene.load.image("ai_lv5", "assets/towers/ai/chatGPT.png");
    // Command Line Interface Tower
    this.scene.load.image("cli_lv1", "assets/towers/cli/terminal.png");
    this.scene.load.image("cli_lv2", "assets/towers/cli/powershell.png");
    this.scene.load.image("cli_lv3", "assets/towers/cli/ohMyZhs.png");
    this.scene.load.image("cli_lv4", "assets/towers/cli/bash.png");
    this.scene.load.image("cli_lv5", "assets/towers/cli/fish.png");
    // Database Tower
    this.scene.load.image("db_lv1", "assets/towers/database/mySql.png");
    this.scene.load.image("db_lv2", "assets/towers/database/pgAdmin.png");
    this.scene.load.image("db_lv3", "assets/towers/database/mongo.png");
    this.scene.load.image("db_lv4", "assets/towers/database/sqlite.png");
    this.scene.load.image("db_lv5", "assets/towers/database/oracle.png");
    // Meeting Tower
    this.scene.load.image("meet_lv1", "assets/towers/meeting/teams.png");
    this.scene.load.image("meet_lv2", "assets/towers/meeting/meet.png");
    this.scene.load.image("meet_lv3", "assets/towers/meeting/zoom.png");
    this.scene.load.image("meet_lv4", "assets/towers/meeting/webex.png");
    this.scene.load.image("meet_lv5", "assets/towers/meeting/discord.png");
    // Search Engine Tower
    this.scene.load.image("se_lv1", "assets/towers/search engine/yahoo.png");
    this.scene.load.image("se_lv2", "assets/towers/search engine/bing.png");
    this.scene.load.image("se_lv3", "assets/towers/search engine/google.png");
    this.scene.load.image("se_lv4", "assets/towers/search engine/baidu.png");
    this.scene.load.image("se_lv5", "assets/towers/search engine/duckduck.png");
    // TODO : Add more tower types as needed
  }

  preloadTiles(tileAssets: AssetImport[]) {
    tileAssets.forEach((tile) => {
      this.scene.load.image(tile.key, tile.path);
    });
  }

  preloadEnemies() {
    this.scene.load.image("ice_cream", "assets/enemies/ice_cream.png");
    this.scene.load.image("choco", "assets/enemies/choco.png");
    this.scene.load.image("cake", "assets/enemies/cake.png");
    this.scene.load.image("coffee", "assets/enemies/coffee.png");
    this.scene.load.image("coke", "assets/enemies/coke.png");
    this.scene.load.image("cupcake", "assets/enemies/cupcake.png");
    this.scene.load.image("macaroon", "assets/enemies/macaron.png");
    this.scene.load.image("boss", "assets/enemies/boss.png");
  }

  preloadSounds() {
    this.scene.load.audio("bgm", "assets/sfx/Funny_Bits.mp3")
    
    this.scene.load.audio("select", "assets/sfx/select.wav")
    this.scene.load.audio("error", "assets/sfx/error.wav")
    this.scene.load.audio("cancel", "assets/sfx/cancel.wav")
    
    this.scene.load.audio("explosion_1", "assets/sfx/explosions/explosion_1.wav")
    this.scene.load.audio("explosion_2", "assets/sfx/explosions/explosion_2.wav")
    this.scene.load.audio("explosion_3", "assets/sfx/explosions/explosion_3.wav")

    this.scene.load.audio("hit_1", "assets/sfx/hits/hit_1.wav")
    this.scene.load.audio("hit_2", "assets/sfx/hits/hit_2.wav")
    this.scene.load.audio("hit_3", "assets/sfx/hits/hit_3.wav")
    
    this.scene.load.audio("w_1", "assets/sfx/wave_select/w_1.wav")
    this.scene.load.audio("w_2", "assets/sfx/wave_select/w_2.wav")
    this.scene.load.audio("w_3", "assets/sfx/wave_select/w_3.wav")
    this.scene.load.audio("w_4", "assets/sfx/wave_select/w_4.wav")
    this.scene.load.audio("w_5", "assets/sfx/wave_select/w_5.wav")
    
    this.scene.load.audio("place_1", "assets/sfx/place_tower/place_1.wav")
    this.scene.load.audio("place_2", "assets/sfx/place_tower/place_2.wav")
    this.scene.load.audio("place_3", "assets/sfx/place_tower/place_3.wav")
    
    this.scene.load.audio("upgrade", "assets/sfx/upgrade.wav")
    this.scene.load.audio("start_wave", "assets/sfx/start_wave.wav")
  }

  preloadOthers() {
    this.scene.load.image("coin", "assets/coin.png");
    this.scene.load.image("heart", "assets/heart.png");

    this.scene.load.image("bomb", "assets/effects/bomb.png")
    this.scene.load.image("fire", "assets/effects/fire.png")
    this.scene.load.image("poison", "assets/effects/poison.png")
    this.scene.load.image("slow", "assets/effects/slow.png")
    this.scene.load.image("smoke", "assets/effects/smoke.png")
    this.scene.load.image("ricochet", "assets/effects/ricochet.png")
    this.scene.load.image("crit", "assets/effects/crit.png")
  }
}
