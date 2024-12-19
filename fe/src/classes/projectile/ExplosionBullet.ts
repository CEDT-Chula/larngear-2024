import { BaseEnemy } from "../enemies/BaseEnemy"
import { GameController } from "../util/GameController"
import { ParticleEmitter } from "../util/ParticleEmitter"
import { BaseProjectTile } from "./BaseProjectile"

export class ExplosionBullet extends BaseProjectTile {
    explosionRadius: number
  
    constructor(scene: Phaser.Scene, speed: number, damage: number, sprite: string, target: BaseEnemy, explosionRadius: number = 100) {
      super(scene, speed, damage, sprite, target)
      this.explosionRadius = explosionRadius

      this.setScale(2);
    }
  
    onHit(target: BaseEnemy) {
      target.emit("takeDamage", this.damage)
  
      // Damage all enemies within explosion radius
      GameController.getInstance().activeEnemiesList.forEach(enemy => {
        if (Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y) <= this.explosionRadius) {
          enemy.emit("takeDamage", this.damage / 2) // Half damage to nearby enemies
        }
      })

      const emitter = new ParticleEmitter(this.scene, "smoke")

      emitter.explode(10, target.x, target.y, true)
  
      this.destroy()
    }
  }
  