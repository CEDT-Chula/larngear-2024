import { IceCreamEnemy } from "../../enemies/IceCreamEnemy";
import { WaveEffect } from "./WaveEffect";

export class SlowWave extends WaveEffect {
    constructor() {
        super(IceCreamEnemy, "Icy Threat", "Enemy Health +50% this wave", "Increase burn damage");
    }

    effect(): void {
        
    }
}