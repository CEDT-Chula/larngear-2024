import { CupCakeEnemy } from "../../enemies/CupCakeEnemy";
import { AITower } from "../../Tower/AITower";
import { GameController } from "../GameController";
import { WaveEffect } from "./WaveEffect";

export class MixedWave extends WaveEffect {
    constructor() {
        super(CupCakeEnemy, "That's the whole army!", "Enemy Speed +20% this wave", "Only got AI this turn")
    }

    effect(): void {
        GameController.getInstance().enemySpeed_Multiplier += 0.2 * GameController.getInstance().enemySpeed_Multiplier
        GameController.getInstance().towerPool_Current = [
            AITower
        ]
    }
}