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
                range: 200, attack: 30, reloadTime: 1.5, maxTarget: 1, poisonDamage: 20, poisonDuration: 3000,
                sprite: "cli_lv1"
            },
            {
                range: 200, attack: 40, reloadTime: 1.4, maxTarget: 1, poisonDamage: 30, poisonDuration: 3000,
                sprite: "cli_lv2"
            },
            {
                range: 250, attack: 50, reloadTime: 1.3, maxTarget: 2, poisonDamage: 40, poisonDuration: 4000,
                sprite: "cli_lv3"
            },
            {
                range: 250, attack: 60, reloadTime: 1.2, maxTarget: 2, poisonDamage: 80, poisonDuration: 4000,
                sprite: "cli_lv4"
            },
            {
                range: 300, attack: 70, reloadTime: 1.1, maxTarget: 3, poisonDamage: 100, poisonDuration: 6000,
                sprite: "cli_lv5"
            }
        ];
    }
}
