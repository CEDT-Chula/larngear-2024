import { CokeEnemy } from "../../enemies/CokeEnemy";
import { GameController } from "../GameController";
import { GameUI } from "../GameUI";
import { WaveEffect } from "./WaveEffect";

export class GambleWave extends WaveEffect {
    constructor() {
        super(CokeEnemy, "Everyone's favorite", "50% to gain 500 coins", "20% to lose all coins")
    }

    effect(): void {
        const randomValue = Math.random();
    
        if (randomValue < 0.5) {
            // 50% chance: Gain 500 coins
            GameUI.increaseCoin(500);
            GameController.getInstance().addFloatText("+500 coins Nice~")
        } else if (randomValue < 0.7) {
            // 20% chance: Lose all coins
            const currentCoins = GameController.getInstance().coin;
            GameUI.reduceCoin(currentCoins);
            GameController.getInstance().addFloatText("UNLUCKY YOU!")
        } else {
            // 30% chance: Nothing happens
            GameController.getInstance().addFloatText("Nothing happened.")
        }
    }
    
}