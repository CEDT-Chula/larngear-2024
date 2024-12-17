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
                range: 200, attack: 15, reloadTime: 2, maxTarget: 1, burnDamage: 5, burnDuration: 3000,
                sprite: "meet_lv1"
            },
            {
                range: 200, attack: 20, reloadTime: 1.8, maxTarget: 1, burnDamage: 7, burnDuration: 3000,
                sprite: "meet_lv2"
            },
            {
                range: 200, attack: 25, reloadTime: 1.6, maxTarget: 1, burnDamage: 12, burnDuration: 4000,
                sprite: "meet_lv3"
            },
            {
                range: 250, attack: 30, reloadTime: 1.4, maxTarget: 1, burnDamage: 15, burnDuration: 4000,
                sprite: "meet_lv4"
            },
            {
                range: 300, attack: 35, reloadTime: 1.2, maxTarget: 1, burnDamage: 20, burnDuration: 6000,
                sprite: "meet_lv5"
            }
        ];
    }
}
