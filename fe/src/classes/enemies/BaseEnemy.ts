import { GameController } from "../util/GameController";
import { GameUI } from "../util/GameUI";

export class BaseEnemy extends Phaser.GameObjects.Sprite {
    Name: string;
    Name_Color: string;
    currentHealth: number;
    maxHealth: number;
    speed: number;
    baseSpeed: number;
    attack: number;
    sprite: string;
    pathPosition: number;
    currentPoint: Phaser.Math.Vector2;
    healthBar: Phaser.GameObjects.Graphics;
    isAlive: boolean;

    constructor(
        scene: Phaser.Scene,
        Name: string,
        Name_Color: string,
        maxHealth: number,
        speed: number,
        attack: number,
        sprite: string,
        // path: Phaser.Curves.Path
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
        this.sprite = sprite;
        // this.path = path;
        this.pathPosition = 0;
        this.currentPoint = new Phaser.Math.Vector2();

        this.isAlive = true;

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
        }
        this.updateHealthBar();
    }

    onArrived() {
        console.log(this.sprite, " reached the end!");
        this.isAlive = false;
        this.removeFromActive();

        GameController.getInstance().playerHealth -= this.attack;

        if (GameController.getInstance().playerHealth <= 0) {
            GameController.getInstance().gameOver('lose');
        } else {
            this.emit("destroyed")
        }

        this.destroy(true);
    }

    onDeath() {
        this.isAlive = false;
        this.removeFromActive();
        this.emit("destroyed");

        // Display floating text
        const message = `+${GameController.getInstance().coinPerKill}`;
        const floatingText = this.scene.add.text(this.x, this.y, message, {
            fontSize: '24px',
            color: '#ffd700',
            fontFamily: 'PressStart2P',
        })
            .setOrigin(0.5)
            .setStroke('#000000', 12);;

        // Animate the text to float up and fade out
        this.scene.tweens.add({
            targets: floatingText,
            y: this.y - 50, // Float upwards
            alpha: 0, // Fade out
            duration: 800,
            ease: "Power1",
            onComplete: () => {
                floatingText.destroy(); // Remove the text after animation
            },
        });

        GameUI.increaseCoin(GameController.getInstance().coinPerKill);
        this.destroy(true);
    }


    removeFromActive() {
        const activeEnemies = GameController.getInstance().activeEnemiesList;
        const index = activeEnemies.indexOf(this);
        if (index > -1) {
            activeEnemies.splice(index, 1);
        }
    }

}
