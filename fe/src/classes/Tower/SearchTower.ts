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
                range: 200, attack: 15, reloadTime: 1.5, maxTarget: 1, critChance: 0.2, critMultiplier: 2,
                sprite: "se_lv1"
            },
            {
                range: 200, attack: 50, reloadTime: 1.4, maxTarget: 1, critChance: 0.35, critMultiplier: 2,
                sprite: "se_lv2"
            },
            {
                range: 200, attack: 50, reloadTime: 1.3, maxTarget: 2, critChance: 0.5, critMultiplier: 2,
                sprite: "se_lv3"
            },
            {
                range: 250, attack: 100, reloadTime: 1.2, maxTarget: 2, critChance: 0.5, critMultiplier: 2.5,
                sprite: "se_lv4"
            },
            {
                range: 300, attack: 100, reloadTime: 1.1, maxTarget: 3, critChance: 0.7, critMultiplier: 3,
                sprite: "se_lv5"
            }
        ];
    }
}
