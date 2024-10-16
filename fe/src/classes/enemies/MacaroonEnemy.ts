import { GameController } from "../util/GameController";
import { BaseEnemy } from "./BaseEnemy";

export class MacaroonEnemy extends BaseEnemy {
    constructor(
        scene: Phaser.Scene,
        Name: string = "Macaroon",
        Name_Color: string = "#3944BC",
        maxHealth: number = 30,
        speed: number = 400,
        attack: number = 1,
        isPoisonResist: boolean = false,
        isBurnResist: boolean = false,
        isSlowResist: boolean = false,
        isFreezeResist: boolean = false,
        sprite: string = "macaroon",
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
