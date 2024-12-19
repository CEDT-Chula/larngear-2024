import { MacaroonEnemy } from "../../enemies/MacaroonEnemy";
import { GameController } from "../GameController";
import { WaveEffect } from "./WaveEffect";

export class BossBuffWave extends WaveEffect {
    constructor() {
        super(MacaroonEnemy, "Stronger Boss", "Boss +75% Health", "Enemy -15% Health this wave");
    }

    effect(): void {
        GameController.getInstance().bossHealth_Multiplier += 0.75;
        GameController.getInstance().enemyHealth_Multiplier -= 0.15;
    }
}