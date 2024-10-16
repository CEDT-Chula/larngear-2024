import { GameController } from "../util/GameController";
import { BaseEnemy } from "./BaseEnemy";

export class CokeEnemy extends BaseEnemy {
    constructor(
        scene: Phaser.Scene,
        Name: string = "Coke",
        Name_Color: string = "#8B4513",
        maxHealth: number = 25,
        speed: number = 400,
        attack: number = 1,
        isPoisonResist: boolean = true, 
        isBurnResist: boolean = false,  
        isSlowResist: boolean = false,    
        isFreezeResist: boolean = false,
        sprite: string = "coke",
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
