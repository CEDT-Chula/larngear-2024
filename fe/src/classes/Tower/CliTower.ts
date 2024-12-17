import { BaseTower, LevelData } from "./BaseTower";

// Poison Bullet

export class CliTower extends BaseTower {
    constructor(scene: Phaser.Scene, pos?: Phaser.Math.Vector2) {
        super(scene, pos, 5, "poison", "poison");
        this.levelData = this.initializeLevelData();
        this.setTexture(this.levelData[0].sprite);
    }
    
    initializeLevelData(): LevelData[] {
        return [
            {
                range: 200, attack: 15, reloadTime: 2, maxTarget: 1, poisonDamage: 5, poisonDuration: 3000,
                sprite: "cli_lv1"
            },
            {
                range: 200, attack: 20, reloadTime: 1.8, maxTarget: 1, poisonDamage: 7, poisonDuration: 3000,
                sprite: "cli_lv2"
            },
            {
                range: 250, attack: 25, reloadTime: 1.6, maxTarget: 1, poisonDamage: 12, poisonDuration: 4000,
                sprite: "cli_lv3"
            },
            {
                range: 250, attack: 30, reloadTime: 1.4, maxTarget: 1, poisonDamage: 15, poisonDuration: 4000,
                sprite: "cli_lv4"
            },
            {
                range: 300, attack: 35, reloadTime: 1.2, maxTarget: 1, poisonDamage: 20, poisonDuration: 6000,
                sprite: "cli_lv5"
            }
        ];
    }
}
