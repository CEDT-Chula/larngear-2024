import { GameController } from "../util/GameController";
import { BaseEnemy } from "./BaseEnemy";

export class MacaroonEnemy extends BaseEnemy {
    constructor(
        scene: Phaser.Scene,
        Name: string = "Macaroon",
        Name_Color: string = "#3944BC",
        maxHealth: number = 60,
        speed: number = 80,
        attack: number = 12,
        isPoisonResist: boolean = false,
        isBurnResist: boolean = false,
        isSlowResist: boolean = false,
        isFreezeResist: boolean = false,
        sprite: string = "fe/src/enemies/macaroon.png",
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
