import { GameController } from "../util/GameController";
import { BaseEnemy } from "./BaseEnemy";

export class CoffeeEnemy extends BaseEnemy {
    constructor(
        scene: Phaser.Scene,
        Name: string = "Coffee",
        Name_Color: string = "#6F4E37", 
        maxHealth: number = 25 + (30 * GameController.getInstance().currentWave * GameController.getInstance().enemyHealth_Multiplier),          
        speed: number = 325 * GameController.getInstance().enemySpeed_Multiplier,            
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
