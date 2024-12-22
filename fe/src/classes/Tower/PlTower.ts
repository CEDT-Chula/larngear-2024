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
                range: 300, attack: 150, reloadTime: 1.2, maxTarget: 2, slowAmount: 0.4, slowDuration: 1000,
                sprite: "pl_lv1"
            },
            {
                range: 325, attack: 200, reloadTime: 1.1, maxTarget: 3, slowAmount: 0.5, slowDuration: 1250,
                sprite: "pl_lv2"
            },
            {
                range: 350, attack: 250, reloadTime: 1, maxTarget: 5, slowAmount: 0.6, slowDuration: 1500,
                sprite: "pl_lv3"
            },
            {
                range: 350, attack: 300, reloadTime: 0.9, maxTarget: 7, slowAmount: 0.7, slowDuration: 1750,
                sprite: "pl_lv4"
            },
            {
                range: 400, attack: 350, reloadTime: 0.8, maxTarget: 10, slowAmount: 0.8, slowDuration: 2000,
                sprite: "pl_lv5"
            }
        ];
    }
}