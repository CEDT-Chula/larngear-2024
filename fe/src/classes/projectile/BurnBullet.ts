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

      const emitter = new ParticleEmitter(this.scene, "fire")
  
      // Apply burn damage over time
      const burnTimer = this.scene.time.addEvent({
        delay: 1000, // Damage every second
        repeat: Math.floor(this.burnDuration / 1000) - 1, // Duration in seconds
        callback: () => {
          target.emit("takeDamage", this.burnDamage)
          emitter.float(22, target.x, target.y)
        },
      })
  
      target.once("destroy", () => burnTimer.remove())
      this.destroy()
    }
  }
  