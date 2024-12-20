import { GameController } from "../util/GameController";
import { BaseEnemy } from "./BaseEnemy";

export class MacaroonEnemy extends BaseEnemy {
    constructor(
        scene: Phaser.Scene,
        Name: string = "Macaroon",
        Name_Color: string = "#3944BC",
        maxHealth: number = (5 + (GameController.getInstance().currentWave / 2)) * (60 * GameController.getInstance().currentWave * GameController.getInstance().enemyHealth_Multiplier),
        baseSpeed: number = 250,
        attack: number = 1,
        sprite: string = "macaroon",
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
}
