import { GameController } from "../util/GameController";
import { BaseEnemy } from "./BaseEnemy";

export class CoffeeEnemy extends BaseEnemy {
    constructor(
        scene: Phaser.Scene,
        Name: string = "Coffee",
        Name_Color: string = "#6F4E37", 
        maxHealth: number = 40 * GameController.getInstance().currentWave * GameController.getInstance().enemyHealth_Multiplier,          
        speed: number = 600,            
        attack: number = 1,           
        sprite: string = "coffee",
        // path: Phaser.Curves.Path
    ) {
        super(
            scene,
            Name,
            Name_Color,
            maxHealth,
            speed,
            attack,
            sprite,
            // path
        );
    }

}
