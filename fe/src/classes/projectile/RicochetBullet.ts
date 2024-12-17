import { BaseEnemy } from "../enemies/BaseEnemy"
import { GameController } from "../util/GameController"
import { BaseProjectTile } from "./BaseProjectile"

export class RicochetBullet extends BaseProjectTile {
    ricochetCount: number
  
    constructor(scene: Phaser.Scene, speed: number, damage: number, sprite: string, target: BaseEnemy, ricochetCount: number = 3) {
      super(scene, speed, damage, sprite, target)
      this.ricochetCount = ricochetCount
    }
  
    onHit(target: BaseEnemy) {
      target.emit("takeDamage", this.damage)
      this.ricochetCount--
  
      if (this.ricochetCount > 0) {
        const nextTarget = this.findNextTarget(target)
        if (nextTarget) {
          this.target = nextTarget
          return
        }
      }
      this.destroy()
    }
  
    findNextTarget(previousTarget: BaseEnemy): BaseEnemy | null {
      const activeEnemies = GameController.getInstance().activeEnemiesList.filter(enemy => 
        enemy.isAlive && enemy !== previousTarget
      )
      return activeEnemies.length > 0 ? activeEnemies[0] : null
    }
  }
  