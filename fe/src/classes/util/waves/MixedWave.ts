import { CupCakeEnemy } from "../../enemies/CupCakeEnemy";
import { AITower } from "../../Tower/AITower";
import { GameController } from "../GameController";
import { WaveEffect } from "./WaveEffect";

export class MixedWave extends WaveEffect {
    constructor() {
        super(CupCakeEnemy, "That's the whole army!", "Increase Enemy Speed +25%", "Only got AI this turn")
    }

    effect(): void {
        GameController.getInstance().enemySpeed_Multiplier += 0.25 * GameController.getInstance().enemySpeed_Multiplier
        GameController.getInstance().towerPool_Current = [
            AITower
        ]
    }
}