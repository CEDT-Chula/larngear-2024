import { BaseEnemy } from "./BaseEnemy";

export class IceCreamEnemy extends BaseEnemy {
    constructor(scene: Phaser.Scene) {
        super(scene, 20, 500, 1, "ice_cream");
    }
}