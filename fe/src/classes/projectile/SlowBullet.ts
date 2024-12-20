import { BaseEnemy } from "../enemies/BaseEnemy"
import { GameController } from "../util/GameController"
import { ParticleEmitter } from "../util/ParticleEmitter"
import { BaseProjectTile } from "./BaseProjectile"

export class SlowBullet extends BaseProjectTile {
  slowAmount: number
  slowDuration: number

  constructor(
    scene: Phaser.Scene,
    speed: number,
    damage: number,
    sprite: string,
    target: BaseEnemy,
    slowAmount: number = 0.5,
    slowDuration: number = 3000
  ) {
    super(scene, speed, damage, sprite, target)
    this.slowAmount = slowAmount
    this.slowDuration = slowDuration
  }

  onHit(target: BaseEnemy) {
    this.scene.sound.play("hit_1", { volume: 0.3 })
    target.emit("takeDamage", this.damage)

    target.speed *= 1 - this.slowAmount
    target.setTint(0x87ceeb) // Light blue color for slow effect

    // Cleanup: Restore original speed and tint after slowDuration ends
    const cleanup = () => {
      target.speed = target.baseSpeed * GameController.getInstance().enemySpeed_Multiplier
      target.clearTint()
    }

    this.scene.time.delayedCall(this.slowDuration, cleanup)
    target.once("destroy", cleanup)

    this.destroy()
  }
}
