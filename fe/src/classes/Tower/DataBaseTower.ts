import { BaseTower, LevelData } from "./BaseTower";
import { TowerSkill } from "./TowerSkill";

export class DataBaseTower extends BaseTower {
    constructor(scene: Phaser.Scene, pos?: Phaser.Math.Vector2) {
        super(scene, pos, 300, 5, 1.2, 5, 5, "path");
        this.levelData = this.initializeLevelData();
        this.setTexture(this.levelData[0].sprite);
    }
    
    initializeLevelData(): LevelData[] {
        return [
            {
                range: 20, attack: 15, reloadTime: 2, targetCount: 1,
                sprite: "db_lv1"
            },
            {
                range: 25, attack: 20, reloadTime: 1.8, targetCount: 1,
                sprite: "db_lv2"
            },
            {
                range: 30, attack: 25, reloadTime: 1.6, targetCount: 1,
                sprite: "db_lv3"
            },
            {
                range: 35, attack: 30, reloadTime: 1.4, targetCount: 1,
                sprite: "db_lv4"
            },
            {
                range: 40, attack: 35, reloadTime: 1.2, targetCount: 1,
                sprite: "db_lv5"
            }
        ];
    }
}
