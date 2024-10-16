export class BaseProjectTile extends Phaser.GameObjects.Sprite {
    speed: number;
    damage: number;
    sprite: string;
    target: Phaser.GameObjects.Sprite;
    body: Phaser.Physics.Arcade.Body | null;

    constructor(scene: Phaser.Scene, speed: number, damage: number, sprite: string, target: Phaser.GameObjects.Sprite) {
        super(scene, 0, 0, "");
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

        this.body?.setCollideWorldBounds(true); // Collide with world bounds
        this.body?.setBounce(1); // Set bounce (1 means full energy bounce, adjust for less)

        this.scene.events.on("update", this.trackTarget, this);
        this.scene.physics.add.overlap(
            this,
            this.target,
            (src: any, obj: any) => {
                this.onHit(obj);
            },
            undefined,
            this
        );
    }

    onHit(target: Phaser.GameObjects.Sprite) {
        this.emit("onHit");
        target.emit("takeDamage", this.damage);
        this.destroy(true);
    }

    trackTarget() {
        if (!this.target || !this.body) return;

        const targetX = this.target.x;
        const targetY = this.target.y;

        // Calculate the direction vector from the projectile to the target
        const directionX = targetX - this.x;
        const directionY = targetY - this.y;

        // Normalize the direction (find the unit vector)
        const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
        const normalizedX = directionX / magnitude;
        const normalizedY = directionY / magnitude;

        // Set the velocity to move towards the target smoothly
        this.body.setVelocity(normalizedX * this.speed, normalizedY * this.speed);
    }
}
