import { BaseTower, LevelData } from "./BaseTower";

// Fire bullet

export class MeetingTower extends BaseTower {
    constructor(scene: Phaser.Scene, pos?: Phaser.Math.Vector2) {
        super(scene, pos, 5, "fire", "burn");
        this.levelData = this.initializeLevelData();
        this.setTexture(this.levelData[0].sprite);
    }

    initializeLevelData(): LevelData[] {
        return [
            {
                range: 250, attack: 100, reloadTime: 2, maxTarget: 1, burnDamage: 100, burnDuration: 3000,
                sprite: "meet_lv1"
            },
            {
                range: 275, attack: 200, reloadTime: 1.8, maxTarget: 2, burnDamage: 300, burnDuration: 3000,
                sprite: "meet_lv2"
            },
            {
                range: 300, attack: 300, reloadTime: 1.6, maxTarget: 3, burnDamage: 500, burnDuration: 4000,
                sprite: "meet_lv3"
            },
            {
                range: 325, attack: 400, reloadTime: 1.4, maxTarget: 4, burnDamage: 700, burnDuration: 4000,
                sprite: "meet_lv4"
            },
            {
                range: 350, attack: 500, reloadTime: 1.2, maxTarget: 5, burnDamage: 1000, burnDuration: 6000,
                sprite: "meet_lv5"
            }
        ];
    }
}
