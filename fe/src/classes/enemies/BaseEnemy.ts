import { Events } from "phaser";

export class BaseEnemy extends Phaser.GameObjects.Sprite {
    currentHealth: number;
    maxHealth: number;
    speed: number;
    attack: number;
    sprite: string;

    constructor(scene: Phaser.Scene, maxHealth: number, speed: number, attack: number, sprite: string) {
        super(scene, 0, 0, "")
        this.maxHealth = maxHealth;
        this.currentHealth = this.maxHealth;
        this.speed = speed;
        this.attack = attack;
        this.sprite = sprite;
        
        this.setTexture(sprite);
        this.setOrigin(0);
        this.setScale(4);

        Events.EventEmitter.call(this);
    }

    takeDamage(dmg: number) {
        this.currentHealth -= dmg;

        if (this.currentHealth <= 0) {
            this.onDeath()
            this.destroy(true)
        }
    }

    // call when enemy reach the end of the road
    onArrived() {
        // TODO: decrease Player's base hp by attack

        console.log(this.sprite, " reached the end!");
        this.emit('onArrived');
        this.destroy(true);
    }

    onDeath() {
        this.emit('onDeath');
    }
}