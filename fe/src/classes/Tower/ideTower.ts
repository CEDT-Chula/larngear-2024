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
                range: 100, attack: 15, reloadTime: 2, maxTarget: 1, ricochetCount: 3,
                sprite: "ide_lv1"
            },
            {
                range: 150, attack: 20, reloadTime: 1.8, maxTarget: 1, ricochetCount: 4,
                sprite: "ide_lv2"
            },
            {
                range: 150, attack: 25, reloadTime: 1.6, maxTarget: 1, ricochetCount: 4,
                sprite: "ide_lv3"
            },
            {
                range: 200, attack: 30, reloadTime: 1.4, maxTarget: 1, ricochetCount: 5,
                sprite: "ide_lv4"
            },
            {
                range: 250, attack: 35, reloadTime: 1.2, maxTarget: 1, ricochetCount: 7,
                sprite: "ide_lv5"
            }
        ];
    }
}
