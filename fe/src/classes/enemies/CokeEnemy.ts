import { GameController } from "../util/GameController";
import { BaseEnemy } from "./BaseEnemy";

export class CokeEnemy extends BaseEnemy {
    constructor(
        scene: Phaser.Scene,
        Name: string = "Coke",
        Name_Color: string = "#8B4513",
        maxHealth: number = (5 + (GameController.getInstance().currentWave / 3)) + (30 * GameController.getInstance().currentWave * GameController.getInstance().enemyHealth_Multiplier),
        baseSpeed: number = 275,
        attack: number = 1,
        sprite: string = "coke",
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
