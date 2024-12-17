import { BaseTower, LevelData } from "./BaseTower";

// Slow Bullet

export class PlTower extends BaseTower {
    constructor(scene: Phaser.Scene, pos?: Phaser.Math.Vector2) {
        super(scene, pos, 5, "path", "slow");
        this.levelData = this.initializeLevelData();
        this.setTexture(this.levelData[0].sprite);
    }
    
    initializeLevelData(): LevelData[] {
        return [
            {
                range: 100, attack: 15, reloadTime: 2, maxTarget: 1, slowAmount: 0.25, slowDuration: 2000,
                sprite: "pl_lv1"
            },
            {
                range: 100, attack: 20, reloadTime: 1.8, maxTarget: 1, slowAmount: 0.25, slowDuration: 4000,
                sprite: "pl_lv2"
            },
            {
                range: 150, attack: 25, reloadTime: 1.6, maxTarget: 1, slowAmount: 0.5, slowDuration: 2000,
                sprite: "pl_lv3"
            },
            {
                range: 175, attack: 30, reloadTime: 1.4, maxTarget: 1, slowAmount: 0.5, slowDuration: 4000,
                sprite: "pl_lv4"
            },
            {
                range: 200, attack: 35, reloadTime: 1.2, maxTarget: 1, slowAmount: 0.8, slowDuration: 2000,
                sprite: "pl_lv5"
            }
        ];
    }
}