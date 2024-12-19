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
                range: 300, attack: 100, reloadTime: 2, maxTarget: 2,
                sprite: "db_lv1"
            },
            {
                range: 300, attack: 200, reloadTime: 2, maxTarget: 2,
                sprite: "db_lv2"
            },
            {
                range: 350, attack: 300, reloadTime: 2, maxTarget: 3,
                sprite: "db_lv3"
            },
            {
                range: 350, attack: 400, reloadTime: 2, maxTarget: 4,
                sprite: "db_lv4"
            },
            {
                range: 400, attack: 500, reloadTime: 2, maxTarget: 5,
                sprite: "db_lv5"
            }
        ];
    }
}
