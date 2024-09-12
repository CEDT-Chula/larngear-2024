import Actor from "../Actor";

export class DemoGoblin extends Actor {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this._initAnimations();
        this.scale = 20;
        this.setOrigin(0.5, 1);
        this.scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);

        this.anims.play("goblin-idle", true);

        this.lastX = this.x;
        this.lastY = this.y;
    }

    _initAnimations() {
        this.scene.anims.create({
            key: "goblin-idle",
            frames: this.scene.anims.generateFrameNumbers("demo_goblin_idle", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });

        this.scene.anims.create({
            key: "goblin-run",
            frames: this.scene.anims.generateFrameNumbers("demo_goblin_run", { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1,
        });

        this.scene.anims.create({
            key: "goblin-died",
            frames: this.scene.anims.generateFrameNumbers("demo_goblin_died", { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0,
        });
    }

    create() {

    }

    update() {

    }
}

export const DemoGoblinSprites = [
    { key: "demo_goblin_idle", path: "src/assets/enemies/demo_goblin/idle.png", frameWidth: 32, frameHeight: 32 },
    { key: "demo_goblin_run", path: "src/assets/enemies/demo_goblin/run.png", frameWidth: 32, frameHeight: 32 },
    { key: "demo_goblin_died", path: "src/assets/enemies/demo_goblin/died.png", frameWidth: 37, frameHeight: 37 },
];