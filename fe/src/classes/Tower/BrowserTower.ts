import { BaseTower, LevelData } from "./BaseTower";

// Fast fire-rate, low damage

export class BrowserTower extends BaseTower {
    constructor(scene: Phaser.Scene, pos?: Phaser.Math.Vector2) {
        super(scene, pos, 5, "path");
        this.levelData = this.initializeLevelData();
        this.setTexture(this.levelData[0].sprite);
    }
    
    initializeLevelData(): LevelData[] {
        return [
            {
                range: 200, attack: 60, reloadTime: 0.1, maxTarget: 1,
                sprite: "browser_lv1"
            },
            {
                range: 220, attack: 70, reloadTime: 0.1, maxTarget: 1,
                sprite: "browser_lv2"
            },
            {
                range: 230, attack: 80, reloadTime: 0.05, maxTarget: 1,
                sprite: "browser_lv3"
            },
            {
                range: 240, attack: 90, reloadTime: 0.01, maxTarget: 1,
                sprite: "browser_lv4"
            },
            {
                range: 250, attack: 100, reloadTime: 0.001, maxTarget: 1,
                sprite: "browser_lv5"
            }
        ];
    }
}
