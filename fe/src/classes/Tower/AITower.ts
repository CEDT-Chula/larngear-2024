import { BaseTower, LevelData } from "./BaseTower";

// Explosion Bullet

export class AITower extends BaseTower {
    constructor(scene: Phaser.Scene, pos?: Phaser.Math.Vector2) {
        super(scene, pos, 5, "bomb", "explosion");
        this.levelData = this.initializeLevelData();
        this.setTexture(this.levelData[0].sprite);
    }

    initializeLevelData(): LevelData[] {
        return [
            {
                range: 250, attack: 200, reloadTime: 1.2, maxTarget: 1, explosionRange: 200,
                sprite: "ai_lv1"
            },
            {
                range: 300, attack: 300, reloadTime: 1.1, maxTarget: 2, explosionRange: 250,
                sprite: "ai_lv2"
            },
            {
                range: 350, attack: 400, reloadTime: 1, maxTarget: 3, explosionRange: 300,
                sprite: "ai_lv3"
            },
            {
                range: 400, attack: 500, reloadTime: 0.9, maxTarget: 4, explosionRange: 350,
                sprite: "ai_lv4"
            },
            {
                range: 400, attack: 600, reloadTime: 0.8, maxTarget: 5, explosionRange: 400,
                sprite: "ai_lv5"
            }
        ];
    }
}
