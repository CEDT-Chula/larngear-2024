import { CakeEnemy } from "../../enemies/CakeEnemy";
import { GameController } from "../GameController";
import { GameUI } from "../GameUI";
import { WaveEffect } from "./WaveEffect";

export class DuplicateWave extends WaveEffect {
    constructor() {
        super(CakeEnemy, "Unstoppable Force", "Immune to Poison this turn", "Gain 400 coins", "w_3");
    }

    effect(): void {
        GameUI.increaseCoin(400)
        GameController.getInstance().isPoisonImmune = true;
    }
}