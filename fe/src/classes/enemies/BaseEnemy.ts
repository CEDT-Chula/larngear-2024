import { GameController } from "../util/GameController";

export class BaseEnemy extends Phaser.GameObjects.Sprite {
    Name: string;
    Name_Color: string;
    currentHealth: number;
    maxHealth: number;
    speed: number;
    baseSpeed: number;
    attack: number;
    isPoisonResist: boolean;
    isBurnResist: boolean;
    isSlowResist: boolean;
    isFreezeResist: boolean;
    sprite: string;
    path: Phaser.Curves.Path;
    pathPosition: number;
    currentPoint: Phaser.Math.Vector2;

    constructor(
        scene: Phaser.Scene,
        Name: string,
        Name_Color: string,
        maxHealth: number,
        speed: number,
        attack: number,
        isPoisonResist: boolean = true,
        isBurnResist: boolean = true,
        isSlowResist: boolean = true,
        isFreezeResist: boolean = false,
        sprite: string,
        path: Phaser.Curves.Path
    ) {
        super(scene, 0, 0, sprite);

        const gameController = GameController.getInstance();

        this.Name = Name;
        this.Name_Color = Name_Color;
        this.maxHealth = maxHealth * gameController.enemyHealth_Multiplier;
        this.currentHealth = this.maxHealth;
        this.baseSpeed = speed;
        this.speed = speed * gameController.enemySpeed_Multiplier;
        this.attack = attack;
        this.isPoisonResist = isPoisonResist;
        this.isBurnResist = isBurnResist;
        this.isSlowResist = isSlowResist;
        this.isFreezeResist = isFreezeResist;
        this.sprite = sprite;
        this.path = path;
        this.pathPosition = 0;
        this.currentPoint = new Phaser.Math.Vector2();

        this.setOrigin(0);
        this.setScale(4);
        this.setTexture(sprite);
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
            this.onDeath();
            this.destroy(true);
        }
    }

    onArrived() {
        // Decrease Player's base hp by attack
        console.log(this.sprite, " reached the end!");

        GameController.getInstance().playerHealth -= this.attack;

        if (GameController.getInstance().playerHealth <= 0) {
            GameController.getInstance().gameOver('lose');
        }

        this.emit('onArrived');
        this.destroy(true);
    }

    onDeath() {
        this.emit('onDeath');
    }
}
