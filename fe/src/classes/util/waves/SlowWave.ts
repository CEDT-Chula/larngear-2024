import { IceCreamEnemy } from "../../enemies/IceCreamEnemy";
import { GameController } from "../GameController";
import { WaveEffect } from "./WaveEffect";

export class SlowWave extends WaveEffect {
    constructor() {
        super(IceCreamEnemy, "Icy Threat", "Enemy Health +25%", "Decrease Enemy Speed -15%");
    }

    effect(): void {
        GameController.getInstance().enemyHealth_Multiplier += 0.25 * GameController.getInstance().enemyHealth_Multiplier;
        GameController.getInstance().enemySpeed_Multiplier -= 0.15 * GameController.getInstance().enemySpeed_Multiplier;
    }
}