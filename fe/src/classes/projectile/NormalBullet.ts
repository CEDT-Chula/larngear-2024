import { BaseEnemy } from "../enemies/BaseEnemy"
import { BaseProjectTile } from "./BaseProjectile"

export class NormalBullet extends BaseProjectTile {
    onHit(target: BaseEnemy) {
      target.emit("takeDamage", this.damage)
      this.destroy()
    }
  }
  