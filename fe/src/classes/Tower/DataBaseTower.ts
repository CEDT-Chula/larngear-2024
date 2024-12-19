import { BaseTower, LevelData } from "./BaseTower";

// High damage, low fire-rate, multi-attack

export class DataBaseTower extends BaseTower {
    constructor(scene: Phaser.Scene, pos?: Phaser.Math.Vector2) {
        super(scene, pos, 5, "path");
        this.levelData = this.initializeLevelData();
        this.setTexture(this.levelData[0].sprite);
    }
    
    initializeLevelData(): LevelData[] {
        return [
            {
                range: 300, attack: 300, reloadTime: 1.5, maxTarget: 2,
                sprite: "db_lv1"
            },
            {
                range: 325, attack: 400, reloadTime: 1.5, maxTarget: 4,
                sprite: "db_lv2"
            },
            {
                range: 350, attack: 500, reloadTime: 1.5, maxTarget: 6,
                sprite: "db_lv3"
            },
            {
                range: 375, attack: 600, reloadTime: 1.5, maxTarget: 8,
                sprite: "db_lv4"
            },
            {
                range: 400, attack: 700, reloadTime: 1.5, maxTarget: 10,
                sprite: "db_lv5"
            }
        ];
    }
}
