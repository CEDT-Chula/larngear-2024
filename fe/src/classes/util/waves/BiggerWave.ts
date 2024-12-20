import { ChocolateEnemy } from "../../enemies/ChocolateEnemy";
import { GameController } from "../GameController";
import { WaveEffect } from "./WaveEffect";

export class BiggerWave extends WaveEffect {
    constructor() {
        super(ChocolateEnemy, "High Tide", "+5 enemy in every wave", "+1 coin per kill", "w_1");
    }

    effect(): void {
        GameController.getInstance().enemyPerWave += 5;
        GameController.getInstance().coinPerKill += 1;
    }
}