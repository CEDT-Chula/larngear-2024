import { GameController } from "../util/GameController";
import { BaseEnemy } from "./BaseEnemy";

export class CokeEnemy extends BaseEnemy {
    constructor(
        scene: Phaser.Scene,
        Name: string = "Coke",
        Name_Color: string = "#8B4513",
        maxHealth: number = 25 + (30 * GameController.getInstance().currentWave * GameController.getInstance().enemyHealth_Multiplier),
        speed: number = 275 * GameController.getInstance().enemySpeed_Multiplier,
        attack: number = 1,
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
            sprite,
            // path
        );
    }

}
