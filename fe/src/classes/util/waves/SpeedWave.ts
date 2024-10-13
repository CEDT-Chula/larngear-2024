import { IceCreamEnemy } from "../../enemies/IceCreamEnemy";
import { BrowserTower } from "../../Tower/BrowserTower";
import { GameController } from "../GameController";
import { WaveEffect } from "./WaveEffect";

export class SpeedWave extends WaveEffect {
    constructor() {
        super(IceCreamEnemy, "Need for Speed", "Immune to burn this wave", "Only got Browser this turn.");
    }

    effect(): void {
        GameController.getInstance().isBurnImmune = true;
        GameController.getInstance().towerPool_Current = [
            BrowserTower
        ];
    }
}