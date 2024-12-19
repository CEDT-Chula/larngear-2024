import { BaseEnemy } from "../enemies/BaseEnemy";
import { GameController } from "../util/GameController";

export class BaseProjectTile extends Phaser.GameObjects.Sprite {
    speed: number;
    damage: number;
    sprite: string;
    target: BaseEnemy | null;
    body: Phaser.Physics.Arcade.Body | null;

    constructor(scene: Phaser.Scene, speed: number, damage: number, sprite: string, target: BaseEnemy) {
        super(scene, 0, 0, "");
        this.scene = scene;
        this.speed = speed;
        this.damage = damage;
        this.sprite = sprite;
        this.target = target;
        this.body = null;

        this.setTexture(sprite);
        this.setOrigin(0);
        this.setScale(1);
    }

    startProjectile(x: number, y: number) {
        this.setPosition(x, y);
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        this.body?.setCollideWorldBounds(true);
        this.body?.setBounce(1);

        this.scene.events.on("update", this.trackTarget, this);

        this.scene.physics.add.overlap(
            this,
            GameController.getInstance().activeEnemiesList as unknown as Phaser.Types.Physics.Arcade.GameObjectWithBody[],
            (object1: any, object2: any) => {
                const bullet = object1 as BaseProjectTile
                const enemy = object2 as BaseEnemy

                if (enemy.isAlive) {
                    bullet.onHit(enemy)
                }
            },
            undefined,
            this
        )

    }

    onHit(target: BaseEnemy) {
        this.emit("onHit");
        target.emit("takeDamage", this.damage);
        this.destroy(true);
    }

    trackTarget() {
        if (!this.target || !this.body || !this.target.isAlive) {
            // Find a new target dynamically if the current target is invalid
            const activeEnemies = GameController.getInstance().activeEnemiesList.filter(enemy => enemy.isAlive);
            if (activeEnemies.length > 0) {
                this.target = activeEnemies[0]; // Choose the first active enemy
            } else {
                this.destroy(); // No valid targets left, destroy the bullet
                return;
            }
        }

        const targetX = this.target.x;
        const targetY = this.target.y;

        // Calculate direction
        const directionX = targetX - this.x;
        const directionY = targetY - this.y;
        const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);

        const normalizedX = directionX / magnitude;
        const normalizedY = directionY / magnitude;

        // Set velocity towards target
        this.body?.setVelocity(normalizedX * this.speed, normalizedY * this.speed);
    }
}
