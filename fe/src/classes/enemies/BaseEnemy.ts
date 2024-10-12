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

        // Listen for speed changes from the scene
        this.scene.events.on("speedChanged", this.applySpeed, this);
    }

    applySpeed(gameSpeed: number) {
        // Adjust the speed based on the multiplier
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
}
