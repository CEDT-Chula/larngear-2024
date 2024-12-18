import { MacaroonEnemy } from "../../enemies/MacaroonEnemy";
import { GameController } from "../GameController";
import { WaveEffect } from "./WaveEffect";

export class BossBuff extends WaveEffect {
    constructor() {
        super(MacaroonEnemy, "Stronger Boss", "Boss got +50% Health", "+5 coin per kill");
    }

    effect(): void {
        GameController.getInstance().coinPerKill += 5;
        GameController.getInstance().bossHealth_Multiplier += 0.5;
    }
}