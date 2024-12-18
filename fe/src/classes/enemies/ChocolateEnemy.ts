import { GameController } from "../util/GameController";
import { BaseEnemy } from "./BaseEnemy";

export class ChocolateEnemy extends BaseEnemy {
    constructor(
        scene: Phaser.Scene,
        Name: string = "Chocolate",
        Name_Color: string = "#8B4513",
        maxHealth: number = 30 * GameController.getInstance().currentWave * GameController.getInstance().enemyHealth_Multiplier,
        speed: number = 400,
        attack: number = 1,
        sprite: string = "choco",
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
