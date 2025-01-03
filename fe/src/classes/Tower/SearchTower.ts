import { BaseTower, LevelData } from "./BaseTower";

// Crit Bullet

export class SearchTower extends BaseTower {
    constructor(scene: Phaser.Scene, pos?: Phaser.Math.Vector2) {
        super(scene, pos, 5, "path", "crit");
        this.levelData = this.initializeLevelData();
        this.setTexture(this.levelData[0].sprite);
    }
    
    initializeLevelData(): LevelData[] {
        return [
            {
                range: 300, attack: 100, reloadTime: 1.2, maxTarget: 1, critChance: 0.2, critMultiplier: 2,
                sprite: "se_lv1"
            },
            {
                range: 325, attack: 200, reloadTime: 1.1, maxTarget: 2, critChance: 0.35, critMultiplier: 4,
                sprite: "se_lv2"
            },
            {
                range: 350, attack: 300, reloadTime: 1, maxTarget: 3, critChance: 0.5, critMultiplier: 6,
                sprite: "se_lv3"
            },
            {
                range: 375, attack: 400, reloadTime: 0.9, maxTarget: 5, critChance: 0.5, critMultiplier: 8,
                sprite: "se_lv4"
            },
            {
                range: 400, attack: 500, reloadTime: 0.8, maxTarget: 7, critChance: 0.7, critMultiplier: 10,
                sprite: "se_lv5"
            }
        ];
    }
}
