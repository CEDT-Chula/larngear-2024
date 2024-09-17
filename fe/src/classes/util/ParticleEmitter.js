export class ParticleEmitter {

    constructor(scene, particleImage) {

        this.scene = scene

        this.emitter = scene.add.particles(0,0, particleImage, {
            lifespan: 500,
            speed: { min: 150, max: 250 },
            scale: { start: 1, end: 0 },
            gravityY: 10,
            emitting: false
        });
    }

    play(amount, x, y) {
        
        this.emitter.x = x;
        this.emitter.y = y
        
        this.emitter.explode(amount);
    }
}