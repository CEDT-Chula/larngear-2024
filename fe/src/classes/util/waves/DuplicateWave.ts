import { CakeEnemy } from "../../enemies/CakeEnemey";
import { GameController } from "../GameController";
import { WaveEffect } from "./WaveEffect";

export class DuplicateWave extends WaveEffect {
    constructor() {
        super(CakeEnemy, "Unstoppable Force", "Immune to Poison this turn", "Gain 100 coins");
    }

    effect(): void {
        GameController.getInstance().coin += 100;
        GameController.getInstance().isPoisonImmune = true;
    }
}