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
                range: 300, attack: 100, reloadTime: 1.75, maxTarget: 2, slowAmount: 0.25, slowDuration: 2000,
                sprite: "pl_lv1"
            },
            {
                range: 325, attack: 150, reloadTime: 1.6, maxTarget: 3, slowAmount: 0.25, slowDuration: 4000,
                sprite: "pl_lv2"
            },
            {
                range: 350, attack: 200, reloadTime: 1.5, maxTarget: 5, slowAmount: 0.5, slowDuration: 2000,
                sprite: "pl_lv3"
            },
            {
                range: 350, attack: 250, reloadTime: 1.25, maxTarget: 7, slowAmount: 0.5, slowDuration: 4000,
                sprite: "pl_lv4"
            },
            {
                range: 400, attack: 300, reloadTime: 1, maxTarget: 10, slowAmount: 0.8, slowDuration: 2000,
                sprite: "pl_lv5"
            }
        ];
    }
}