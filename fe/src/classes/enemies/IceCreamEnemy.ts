import { GameController } from "../util/GameController";
import { BaseEnemy } from "./BaseEnemy";

export class IceCreamEnemy extends BaseEnemy {
    constructor(
        scene: Phaser.Scene,
        Name: string = "Ice Cream",
        Name_Color: string = "#FF69B4", 
        maxHealth: number = (5 + (GameController.getInstance().currentWave / 3)) * (60 * GameController.getInstance().currentWave * GameController.getInstance().enemyHealth_Multiplier),
        baseSpeed: number = 225,
        attack: number = 1,
        sprite: string = "ice_cream",
        // path: Phaser.Curves.Path
    ) {
        super(
            scene,
            Name,
            Name_Color,
            maxHealth,
            baseSpeed,
            attack,
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
