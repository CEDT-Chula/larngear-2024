import { BaseEnemy } from "../enemies/BaseEnemy"
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

      const emitter = new ParticleEmitter(this.scene, "poison")
  
      // Apply burn damage over time
      const poisonTimer = this.scene.time.addEvent({
        delay: 1000, // Damage every second
        repeat: Math.floor(this.poisonDuration / 1000) - 1, // Duration in seconds
        callback: () => {
          target.emit("takeDamage", this.poisonDamage)
          emitter.float(22, target.x, target.y)
        },
      })
  
      target.once("destroy", () => poisonTimer.remove())
      this.destroy()
    }
  }
  