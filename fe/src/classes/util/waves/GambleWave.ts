import { CokeEnemy } from "../../enemies/CokeEnemy";
import { GameController } from "../GameController";
import { GameUI } from "../GameUI";
import { WaveEffect } from "./WaveEffect";

export class GambleWave extends WaveEffect {
    constructor() {
        super(CokeEnemy, "Everyone's favorite", "20% to lose all coins", "Gain 200 coins")
    }

    effect(): void {
        const randomValue = Math.random();
        GameUI.increaseCoin(200);
    
        if (randomValue < 0.2) {
            // 20% chance: Lose all coins
            const currentCoins = GameController.getInstance().coin;
            GameUI.reduceCoin(currentCoins);
            GameController.getInstance().addFloatText("UNLUCKY YOU!")
        }
    }
    
}