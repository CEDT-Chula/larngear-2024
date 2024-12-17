import { Scale } from "phaser";

export class ParticleEmitter {
  scene: Phaser.Scene;
  explodeEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  floatEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  critEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene, particleImage: string) {

    this.scene = scene

    this.explodeEmitter = scene.add.particles(0, 0, particleImage, {
      lifespan: 500,
      speed: { min: 150, max: 250 },
      scale: { start: 1, end: 0 },
      gravityY: 10,
      emitting: false
    }).setDepth(200);

    this.floatEmitter = scene.add.particles(0, 0, particleImage, {
      lifespan: 700,
      speedY: { min: -80, max: -150 },
      speedX: { min: -20, max: 20 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 1, end: 0 },
      gravityY: -10,
      emitting: false,
    }).setDepth(200)

    this.critEmitter = scene.add.particles(0, 0, particleImage, {
      lifespan: 1000,
      speedX: { min: 50, max: 80 },
      speedY: { min: -100, max: -120 },
      scale: { start: 2, end: 4 },
      alpha: { start: 1, end: 0 },
      emitting: false,
    }).setDepth(300)
  }

  explode(amount: number, x: number, y: number, shiftToRed: boolean = false) {
    this.explodeEmitter.setPosition(x, y)

    if (shiftToRed) {
      // Dynamically calculate tint based on amount
      const tintIntensity = Phaser.Math.Clamp(amount * 25, 0, 255)
      const redTint = Phaser.Display.Color.GetColor(tintIntensity, tintIntensity / 2, 0)
      this.explodeEmitter.setParticleTint(redTint)
    } else {
      this.explodeEmitter.setParticleTint(0xFFFFFF)
    }

    this.explodeEmitter.explode(amount)
  }

  float(amount: number, x: number, y: number) {
    this.floatEmitter.setPosition(x, y)
    this.floatEmitter.explode(amount)
  }

  crit(x: number, y: number) {
    this.critEmitter.setPosition(x, y)
    this.critEmitter.explode(1)
  }
}