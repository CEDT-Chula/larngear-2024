import { CupCakeEnemy } from "../../enemies/CupCakeEnemy";
import { WaveEffect } from "./WaveEffect";

export class MixedWave extends WaveEffect {
    constructor() {
        super(CupCakeEnemy, "", "", "")
    }

    effect(): void {
        
    }
}