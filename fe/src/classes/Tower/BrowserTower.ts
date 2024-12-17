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
                range: 125, attack: 10, reloadTime: 0.25, maxTarget: 1,
                sprite: "browser_lv1"
            },
            {
                range: 150, attack: 20, reloadTime: 0.25, maxTarget: 1,
                sprite: "browser_lv2"
            },
            {
                range: 150, attack: 25, reloadTime: 0.25, maxTarget: 1,
                sprite: "browser_lv3"
            },
            {
                range: 200, attack: 25, reloadTime: 0.1, maxTarget: 1,
                sprite: "browser_lv4"
            },
            {
                range: 200, attack: 30, reloadTime: 0.05, maxTarget: 1,
                sprite: "browser_lv5"
            }
        ];
    }
}
