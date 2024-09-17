import { BaseTower } from "./BaseTower";
import { TowerSkill } from "./TowerSkill";

export class MissileTower extends BaseTower {
    constructor() {
        super(10, 5, 1.2, 5, 5);  
        const missileSkill = new TowerSkill(15); 
        this.setSkill(missileSkill);
    }
    
    initializeLevelData() {
        return [
            { range: 20, attack: 15, reloadTime: 2, targetCount: 1 },
            { range: 25, attack: 20, reloadTime: 1.8, targetCount: 1 },
            { range: 30, attack: 25, reloadTime: 1.6, targetCount: 1 },
            { range: 35, attack: 30, reloadTime: 1.4, targetCount: 1 },
            { range: 40, attack: 35, reloadTime: 1.2, targetCount: 1 }
        ];
    }

    useSkill() {
        const currentTime = Date.now();

        // ? Typescipt?? lmao
        if (this.skill.isReady()) {
            this.attack += 5;
            this.targetCount = 9; 
            console.log(`Missile Tower's attack increased to ${this.attack}.`);
            this.skill.lastUsed = currentTime;
        } else {
            const remainingTime = ((this.skill.cooldown * 1000 - (currentTime - this.skill.lastUsed)) / 1000).toFixed(1);
            console.log(`Skill on cooldown. Please wait ${remainingTime} seconds.`);
        }
    }
}
