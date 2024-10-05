import { IceCreamEnemy } from "../../enemies/IceCreamEnemy";
import { GameController } from "../GameController";
import { WaveEffect } from "./WaveEffect";

export class DuplicateWave extends WaveEffect {
    constructor() {
        super(IceCreamEnemy, "Unstoppable Force", "Immune to Poison this turn", "Gain 100 coins");
    }

    effect(): void {
        GameController.getInstance().coin += 100;
    }
}