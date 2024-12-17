import { BaseEnemy } from "../enemies/BaseEnemy"
import { ParticleEmitter } from "../util/ParticleEmitter"
import { BaseProjectTile } from "./BaseProjectile"

export class BurnBullet extends BaseProjectTile {
    burnDamage: number
    burnDuration: number
  
    constructor(scene: Phaser.Scene, speed: number, damage: number, sprite: string, target: BaseEnemy, burnDamage: number = 5, burnDuration: number = 3000) {
      super(scene, speed, damage, sprite, target)
      this.burnDamage = burnDamage
      this.burnDuration = burnDuration
    }
  
    onHit(target: BaseEnemy) {
      target.emit("takeDamage", this.damage)
  
      const emitter = new ParticleEmitter(this.scene, "poison")
  
      target.setTint(0xfe0000) // Red color tint
  
      const poisonEffect = this.scene.time.addEvent({
        delay: 1000,
        repeat: Math.floor(this.burnDuration / 1000) - 1,
        callback: () => {
          if (target.isAlive) {
            target.emit("takeDamage", this.burnDamage)
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
      this.scene.time.delayedCall(this.burnDuration, cleanup)
  
      this.destroy()
    }
  }
  