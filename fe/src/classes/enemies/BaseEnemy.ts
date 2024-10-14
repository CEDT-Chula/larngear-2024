import { GameController } from "../util/GameController";
import { GameUI } from "../util/GameUI";

export class BaseEnemy extends Phaser.GameObjects.Sprite {
    currentHealth: number;
    maxHealth: number;
    speed: number;
    baseSpeed: number;
    attack: number;
    sprite: string;
    // ? What's this for? But if you still decide to use it, think about how to pass argument in child class top
    // path: Phaser.Curves.Path;
    pathPosition: number;
    currentPoint: Phaser.Math.Vector2;
    healthBar: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, maxHealth: number, speed: number, attack: number, sprite: string) {
        super(scene, 0, 0, sprite);

        const gameController = GameController.getInstance();

        this.maxHealth = maxHealth * gameController.enemyHealth_Multiplier;
        this.currentHealth = this.maxHealth;
        this.baseSpeed = speed;
        this.speed = speed * gameController.enemySpeed_Multiplier;
        this.attack = attack;
        this.sprite = sprite;
        // this.path = path;
        this.pathPosition = 0;
        this.currentPoint = new Phaser.Math.Vector2();

        this.setOrigin(0);
        this.setScale(4);

        this.healthBar = new Phaser.GameObjects.Graphics(scene);
        this.updateHealthBar();
        this.on("destroy", () => {
            this.healthBar.destroy();
        });

        this.on("takeDamage", this.takeDamage, this);
    }

    applySpeed(gameSpeed: number) {
        this.speed = this.baseSpeed * gameSpeed;
    }

    preUpdate(time: number, delta: number) {
        this.healthBar.x = 0.2 * GameController.getInstance().tileSize;
        this.healthBar.y = this.displayHeight + 0.2 * GameController.getInstance().tileSize;

        this.updateHealthBar();
    }

    updateHealthBar() {
        const barWidth = 0.6 * GameController.getInstance().tileSize;
        const barHeight = 0.1 * GameController.getInstance().tileSize;

        this.healthBar.clear();

        this.healthBar.fillStyle(0x000000);
        this.healthBar.fillRect(this.x, this.y, barWidth, barHeight);

        const healthPercent = this.currentHealth / this.maxHealth;
        const currentBarWidth = barWidth * healthPercent;

        this.healthBar.fillStyle(0x00ff00);
        this.healthBar.fillRect(this.x, this.y, currentBarWidth, barHeight);
    }

    takeDamage(dmg: number) {
        this.currentHealth -= dmg;

        if (this.currentHealth <= 0) {
            this.onDeath();
            this.destroy(true);
        }
        this.updateHealthBar();
    }

    onArrived() {
        // TODO: decrease Player's base hp by attack

        console.log(this.sprite, " reached the end!");

        GameController.getInstance().playerHealth -= this.attack;

        if (GameController.getInstance().playerHealth <= 0) {
            GameController.getInstance().gameOver('lose')
        }

        this.emit("onArrived");
        this.destroy(true);
    }

    onDeath() {
        this.emit("onDeath");
        GameUI.increaseCoin(GameController.getInstance().coinPerKill);        
    }
}
