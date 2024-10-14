import { GameController } from "../util/GameController";

export class BaseEnemy extends Phaser.GameObjects.Sprite {
    currentHealth: number;
    maxHealth: number;
    speed: number;
    baseSpeed: number;
    attack: number;
    sprite: string;
    path: Phaser.Curves.Path;
    pathPosition: number;
    currentPoint: Phaser.Math.Vector2;

    constructor(
        scene: Phaser.Scene,
        maxHealth: number,
        speed: number,
        attack: number,
        sprite: string,
        path: Phaser.Curves.Path
    ) {
        super(scene, 0, 0, sprite);

        const gameController = GameController.getInstance();

        this.maxHealth = maxHealth * gameController.enemyHealth_Multiplier;
        this.currentHealth = this.maxHealth;
        this.baseSpeed = speed;
        this.speed = speed * gameController.enemySpeed_Multiplier;
        this.attack = attack;
        this.sprite = sprite;
        this.path = path;
        this.pathPosition = 0;
        this.currentPoint = new Phaser.Math.Vector2();

        this.setOrigin(0);
        this.setScale(4);
    }

    applySpeed(gameSpeed: number) {

        this.speed = this.baseSpeed * gameSpeed;
    }

    update(time: number, delta: number) {
        const movement = this.speed * (delta / 1000);
        this.pathPosition += movement;

        this.path.getPoint(this.pathPosition, this.currentPoint);
        this.setPosition(this.currentPoint.x, this.currentPoint.y);

        if (this.pathPosition >= this.path.getLength()) {
            this.pathPosition = 0; // Reset or handle end of path
            this.destroy(); // Destroy the enemy when it reaches the end
        }
    }
    takeDamage(dmg: number) {
        this.currentHealth -= dmg;

        if (this.currentHealth <= 0) {
            this.onDeath()
            this.destroy(true)
        }
    }

    onArrived() {
        // TODO: decrease Player's base hp by attack

        console.log(this.sprite, " reached the end!");

        GameController.getInstance().playerHealth -= this.attack;

        if (GameController.getInstance().playerHealth <= 0) {
            GameController.getInstance().gameOver('lose')
        }

        this.emit('onArrived');
        this.destroy(true);
    }

    onDeath() {
        this.emit('onDeath');
    }
}
