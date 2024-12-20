import { BaseEnemy } from "../enemies/BaseEnemy"
import { GameController } from "../util/GameController"
import { BaseProjectTile } from "./BaseProjectile"

export class RicochetBullet extends BaseProjectTile {
  ricochetCount: number

  constructor(scene: Phaser.Scene, speed: number, damage: number, sprite: string, target: BaseEnemy, ricochetCount: number = 3) {
    super(scene, speed, damage, sprite, target)
    this.ricochetCount = ricochetCount
    this.setScale(3)
  }

  onHit(target: BaseEnemy) {
    this.scene.sound.play("hit_2", { volume: 0.3 })
    target.emit("takeDamage", this.damage)
    this.ricochetCount--

    if (this.ricochetCount > 0) {
      const nextTarget = this.findNextTarget(target)
      if (nextTarget) {
        this.target = nextTarget
        this.updateTrajectory(nextTarget)
        return
      }
    }

    this.destroy()
  }

  updateTrajectory(nextTarget: BaseEnemy) {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, nextTarget.x, nextTarget.y)
    const velocityX = this.speed * Math.cos(angle)
    const velocityY = this.speed * Math.sin(angle)

    this.body?.setVelocity(velocityX, velocityY)
  }

  findNextTarget(previousTarget: BaseEnemy): BaseEnemy | null {
    const activeEnemies = GameController.getInstance().activeEnemiesList.filter(enemy =>
      enemy.isAlive && enemy !== previousTarget
    )

    if (activeEnemies.length === 0) {
      return null
    }

    let nearestEnemy: BaseEnemy | null = null
    let shortestDistance = Infinity

    activeEnemies.forEach(enemy => {
      const distance = Phaser.Math.Distance.Between(previousTarget.x, previousTarget.y, enemy.x, enemy.y)
      if (distance < shortestDistance) {
        shortestDistance = distance
        nearestEnemy = enemy
      }
    })

    return nearestEnemy
  }
}
