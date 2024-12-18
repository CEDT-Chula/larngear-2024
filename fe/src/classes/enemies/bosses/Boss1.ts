import { Scene } from "phaser";
import { BaseEnemy } from "../BaseEnemy";
import { GameController } from "../../util/GameController";

export class Boss1 extends BaseEnemy {
    constructor(scene: Phaser.Scene) {
        super(scene, "Boss", "", 100 * GameController.getInstance().currentWave * GameController.getInstance().bossHealth_Multiplier, 500, 30, "boss")
    }

    onDeath(): void {
        GameController.getInstance().bossHealth_Multiplier = 1;
        super.onDeath()
    }
}