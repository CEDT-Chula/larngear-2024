import { IceCreamEnemy } from "../../enemies/IceCreamEnemy";
import { WaveEffect } from "./WaveEffect";

export class BiggerWave extends WaveEffect {
    constructor() {
        super(IceCreamEnemy, "High Tide", "+1 enemy in every wave", "+1 coin per kill");
    }

    effect(): void {
        
    }
}