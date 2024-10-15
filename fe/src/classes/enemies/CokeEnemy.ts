import { GameController } from "../util/GameController";
import { BaseEnemy } from "./BaseEnemy";

export class CokeEnemy extends BaseEnemy {
    constructor(
        scene: Phaser.Scene,
        Name: string = "Coke",
        Name_Color: string = "#8B4513",
        maxHealth: number = 70,
        speed: number = 60,
        attack: number = 15,
        isPoisonResist: boolean = true, 
        isBurnResist: boolean = false,  
        isSlowResist: boolean = false,    
        isFreezeResist: boolean = false,
        sprite: string = "fe/src/enemies/coke.png",
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
