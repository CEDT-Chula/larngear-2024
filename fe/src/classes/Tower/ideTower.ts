import { BaseTower, LevelData } from "./BaseTower";

// ricochet bullet

export class IdeTower extends BaseTower {
    constructor(scene: Phaser.Scene, pos?: Phaser.Math.Vector2) {
        super(scene, pos, 5, "ricochet", "ricochet");
        this.levelData = this.initializeLevelData();
        this.setTexture(this.levelData[0].sprite);
    }
    
    initializeLevelData(): LevelData[] {
        return [
            {
                range: 275, attack: 200, reloadTime: 1.2, maxTarget: 1, ricochetCount: 3,
                sprite: "ide_lv1"
            },
            {
                range: 300, attack: 400, reloadTime: 1.1, maxTarget: 1, ricochetCount: 5,
                sprite: "ide_lv2"
            },
            {
                range: 325, attack: 500, reloadTime: 1, maxTarget: 2, ricochetCount: 7,
                sprite: "ide_lv3"
            },
            {
                range: 350, attack: 600, reloadTime: 0.9, maxTarget: 3, ricochetCount: 10,
                sprite: "ide_lv4"
            },
            {
                range: 375, attack: 700, reloadTime: 0.8, maxTarget: 4, ricochetCount: 15,
                sprite: "ide_lv5"
            }
        ];
    }
}
