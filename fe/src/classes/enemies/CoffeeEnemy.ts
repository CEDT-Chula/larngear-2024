import { GameController } from "../util/GameController";
import { BaseEnemy } from "./BaseEnemy";

export class CoffeeEnemy extends BaseEnemy {
    constructor(
        scene: Phaser.Scene,
        Name: string = "Coffee",
        Name_Color: string = "#6F4E37", 
        maxHealth: number = 40,          
        speed: number = 800,            
        attack: number = 1,           
        isPoisonResist: boolean = false, 
        isBurnResist: boolean = false,
        isSlowResist: boolean = false,
        isFreezeResist: boolean = false,
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
            isPoisonResist,
            isBurnResist,
            isSlowResist,
            isFreezeResist,
            sprite,
            // path
        );
    }

}
