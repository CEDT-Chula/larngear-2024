import { IceCreamEnemy } from "../../enemies/IceCreamEnemy";
import { WaveEffect } from "./WaveEffect";

export class SpeedWave extends WaveEffect {
    constructor() {
        super(IceCreamEnemy, "Need for Speed", "Immune to burn this wave", "Only got Browser this turn.");
    }

    effect(): void {
        
    }
}