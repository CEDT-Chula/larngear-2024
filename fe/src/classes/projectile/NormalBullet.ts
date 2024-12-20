import { BaseEnemy } from "../enemies/BaseEnemy"
import { BaseProjectTile } from "./BaseProjectile"

export class NormalBullet extends BaseProjectTile {
    onHit(target: BaseEnemy) {
      this.scene.sound.play("hit_3", { volume: 0.3 })
      target.emit("takeDamage", this.damage)
      this.destroy()
    }
  }
  