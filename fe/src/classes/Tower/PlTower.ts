import { BaseTower, LevelData } from "./BaseTower";
import { TowerSkill } from "./TowerSkill";

export class PlTower extends BaseTower {
    constructor(scene: Phaser.Scene) {
        super(scene, 10, 5, 1.2, 5, 5);
        const missileSkill = new TowerSkill(15); 
        this.setSkill(missileSkill);
        this.levelData = this.initializeLevelData();
        this.setTexture(this.levelData[0].sprite);
    }
    
    initializeLevelData(): LevelData[] {
        return [
            {
                range: 20, attack: 15, reloadTime: 2, targetCount: 1,
                sprite: "assets/towers/pl/cpp.png"
            },
            {
                range: 25, attack: 20, reloadTime: 1.8, targetCount: 1,
                sprite: "assets/towers/pl/python.png"
            },
            {
                range: 30, attack: 25, reloadTime: 1.6, targetCount: 1,
                sprite: "assets/towers/pl/java.png"
            },
            {
                range: 35, attack: 30, reloadTime: 1.4, targetCount: 1,
                sprite: "assets/towers/pl/javascript.png"
            },
            {
                range: 40, attack: 35, reloadTime: 1.2, targetCount: 1,
                sprite: "assets/towers/pl/typescript.png"
            }
        ];
    }

    useSkill() {
//
    }
}