import { GameController } from "../util/GameController";
import { BaseEnemy } from "./BaseEnemy";

export class CupCakeEnemy extends BaseEnemy {
    constructor(
        scene: Phaser.Scene,
        Name: string = "CupCake",
        Name_Color: string = "#FDFBD4", 
        maxHealth: number = 40,          
        speed: number = 150,            
        attack: number = 8,           
        isPoisonResist: boolean = false, 
        isBurnResist: boolean = false,
        isSlowResist: boolean = false,
        isFreezeResist: boolean = false,
        sprite: string = "fe/src/enemies/cupcake.png",
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