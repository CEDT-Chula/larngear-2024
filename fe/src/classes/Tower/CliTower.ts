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
                range: 250, attack: 100, reloadTime: 1.2, maxTarget: 1, poisonDamage: 200, poisonDuration: 3000,
                sprite: "cli_lv1"
            },
            {
                range: 275, attack: 200, reloadTime: 1.1, maxTarget: 2, poisonDamage: 400, poisonDuration: 3000,
                sprite: "cli_lv2"
            },
            {
                range: 300, attack: 300, reloadTime: 1, maxTarget: 3, poisonDamage: 600, poisonDuration: 4000,
                sprite: "cli_lv3"
            },
            {
                range: 350, attack: 400, reloadTime: 0.9, maxTarget: 4, poisonDamage: 800, poisonDuration: 4000,
                sprite: "cli_lv4"
            },
            {
                range: 375, attack: 500, reloadTime: 0.8, maxTarget: 5, poisonDamage: 1000, poisonDuration: 6000,
                sprite: "cli_lv5"
            }
        ];
    }
}
