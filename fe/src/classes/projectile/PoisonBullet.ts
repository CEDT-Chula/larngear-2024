import { BaseEnemy } from "../enemies/BaseEnemy"
import { GameController } from "../util/GameController"
import { ParticleEmitter } from "../util/ParticleEmitter"
import { BaseProjectTile } from "./BaseProjectile"

export class PoisonBullet extends BaseProjectTile {
  poisonDamage: number
  poisonDuration: number

  constructor(scene: Phaser.Scene, speed: number, damage: number, sprite: string, target: BaseEnemy, poisonDamage: number = 5, poisonDuration: number = 3000) {
    super(scene, speed, damage, sprite, target)
    this.poisonDamage = poisonDamage
    this.poisonDuration = poisonDuration
  }

  onHit(target: BaseEnemy) {
    target.emit("takeDamage", this.damage)

    if (!GameController.getInstance().isPoisonImmune) {
      const emitter = new ParticleEmitter(this.scene, "poison")

      target.setTint(0x00ff00) // Green color tint

      const poisonEffect = this.scene.time.addEvent({
        delay: 1000,
        repeat: Math.floor(this.poisonDuration / 1000) - 1,
        callback: () => {
          if (target.isAlive) {
            target.emit("takeDamage", this.poisonDamage)
            emitter.float(5, target.x, target.y)
          }
        },
        callbackScope: this,
      })


      // Cleanup: stop particle effects and reset tint when the target is destroyed
      const cleanup = () => {
        emitter.floatEmitter.stop()
        target.clearTint()
        poisonEffect.remove()
      }

      target.once("destroy", cleanup)
      this.scene.time.delayedCall(this.poisonDuration, cleanup)
    }


    this.destroy()
  }
}
