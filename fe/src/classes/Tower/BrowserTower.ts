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
                range: 250, attack: 100, reloadTime: 0.1, maxTarget: 1,
                sprite: "browser_lv1"
            },
            {
                range: 275, attack: 150, reloadTime: 0.1, maxTarget: 2,
                sprite: "browser_lv2"
            },
            {
                range: 300, attack: 200, reloadTime: 0.1, maxTarget: 3,
                sprite: "browser_lv3"
            },
            {
                range: 325, attack: 200, reloadTime: 0.05, maxTarget: 3,
                sprite: "browser_lv4"
            },
            {
                range: 350, attack: 200, reloadTime: 0.01, maxTarget: 3,
                sprite: "browser_lv5"
            }
        ];
    }
}
