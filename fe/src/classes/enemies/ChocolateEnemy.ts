import { GameController } from "../util/GameController";
import { BaseEnemy } from "./BaseEnemy";

export class ChocolateEnemy extends BaseEnemy {
    constructor(
        scene: Phaser.Scene,
        Name: string = "Chocolate",
        Name_Color: string = "#8B4513",
        maxHealth: number = 70,
        speed: number = 60,
        attack: number = 15,
        isPoisonResist: boolean = true, 
        isBurnResist: boolean = false,  
        isSlowResist: boolean = true,    
        isFreezeResist: boolean = true,
        sprite: string = "fe/src/enemies/chocolate.png",
        path: Phaser.Curves.Path
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
            path
        );
    }

}
