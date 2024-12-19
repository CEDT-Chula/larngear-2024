import { GameController } from "../util/GameController";
import { BaseEnemy } from "./BaseEnemy";

export class MacaroonEnemy extends BaseEnemy {
    constructor(
        scene: Phaser.Scene,
        Name: string = "Macaroon",
        Name_Color: string = "#3944BC",
        maxHealth: number = 70 + (75 * GameController.getInstance().currentWave * GameController.getInstance().enemyHealth_Multiplier),
        speed: number = 250 * GameController.getInstance().enemySpeed_Multiplier,
        attack: number = 1,
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
            sprite,
            // path
        );
    }
}
