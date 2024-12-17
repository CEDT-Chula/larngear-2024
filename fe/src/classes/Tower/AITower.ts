import { BaseTower, LevelData } from "./BaseTower";

// Explosion Bullet

export class AITower extends BaseTower {
    constructor(scene: Phaser.Scene, pos?: Phaser.Math.Vector2) {
        super(scene, pos, 150, 5, 1.2, 5, 5, "bomb", "explosion");
        this.levelData = this.initializeLevelData();
        this.setTexture(this.levelData[0].sprite);
    }

    initializeLevelData(): LevelData[] {
        return [
            {
                range: 175, attack: 15, reloadTime: 2, targetCount: 1, explosionRange: 100,
                sprite: "ai_lv1"
            },
            {
                range: 200, attack: 20, reloadTime: 1.8, targetCount: 1, explosionRange: 100,
                sprite: "ai_lv2"
            },
            {
                range: 250, attack: 25, reloadTime: 1.6, targetCount: 1, explosionRange: 150,
                sprite: "ai_lv3"
            },
            {
                range: 250, attack: 30, reloadTime: 1.4, targetCount: 1, explosionRange: 200,
                sprite: "ai_lv4"
            },
            {
                range: 400, attack: 35, reloadTime: 1.2, targetCount: 1, explosionRange: 300,
                sprite: "ai_lv5"
            }
        ];
    }
}
