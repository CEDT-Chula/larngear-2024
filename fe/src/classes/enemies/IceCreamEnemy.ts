import { GameController } from "../util/GameController";
import { BaseEnemy } from "./BaseEnemy";

export class IceCreamEnemy extends BaseEnemy {
    constructor(
        scene: Phaser.Scene,
        Name: string = "Ice Cream",
        Name_Color: string = "#FF69B4", 
        maxHealth: number = 20,
        speed: number = 300,
        attack: number = 1,
        isPoisonResist: boolean = true,
        isBurnResist: boolean = false, 
        isSlowResist: boolean = true,
        isFreezeResist: boolean = true, 
        sprite: string = "ice_cream",
        // path: Phaser.Curves.Path
    ) {
        super(
            scene,
            Name,
            Name_Color,
            maxHealth,
            speed,
            attack,
            isPoisonResist,
            isBurnResist,
            isSlowResist,
            isFreezeResist,
            sprite,
            // path
        );

    }

    takeDamage(dmg: number, damageType: string = 'physical') {
        if (damageType === 'fire') {
            console.log(this.Name, " is melting under fire damage!");
            dmg *= 2; 
        }
        super.takeDamage(dmg);
    }

    onDeath() {
        console.log(this.Name, " melted away!");
        super.onDeath();
    }
}
