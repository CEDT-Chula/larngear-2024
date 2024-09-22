export class ParticleEmitter {
    scene: Phaser.Scene;
    emitter: any;

    constructor(scene: Phaser.Scene, particleImage: string) {

        this.scene = scene

        this.emitter = scene.add.particles(0, 0, particleImage, {
            lifespan: 500,
            speed: { min: 150, max: 250 },
            scale: { start: 1, end: 0 },
            gravityY: 10,
            emitting: false
        }).setDepth(200);
    }

    play(amount: number, x: number, y: number) {

        this.emitter.x = x;
        this.emitter.y = y

        this.emitter.explode(amount);
    }
}