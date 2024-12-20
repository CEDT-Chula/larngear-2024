import { BaseEnemy } from "../../enemies/BaseEnemy";

export class WaveEffect {
    enemy: new (scene: Phaser.Scene) => BaseEnemy;
    title: string;
    debuff: string;
    buff: string;
    sfx_key: string;

    constructor(enemy: new (scene: Phaser.Scene) => BaseEnemy, title: string, debuff: string, buff: string, sfx_key: string) {
        this.enemy = enemy;
        this.title = title;
        this.debuff = debuff;
        this.buff = buff;
        this.sfx_key = sfx_key;
    }

    effect() {
        throw new Error("effect must be implemented in derived classes.");
    }
}