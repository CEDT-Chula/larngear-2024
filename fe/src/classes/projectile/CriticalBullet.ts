import { BaseEnemy } from "../enemies/BaseEnemy"
import { BaseProjectTile } from "./BaseProjectile"
import { ParticleEmitter } from "../util/ParticleEmitter"

export class CriticalBullet extends BaseProjectTile {
    critChance: number // Percentage chance to crit (e.g., 0.2 for 20%)
    critMultiplier: number

    constructor(
        scene: Phaser.Scene,
        speed: number,
        damage: number,
        sprite: string,
        target: BaseEnemy,
        critChance: number = 0.2,
        critMultiplier: number = 2
    ) {
        super(scene, speed, damage, sprite, target)
        this.critChance = critChance
        this.critMultiplier = critMultiplier
    }

    onHit(target: BaseEnemy) {
        this.scene.sound.play("hit_2", { volume: 0.3 })
        const isCritical = Math.random() < this.critChance
        const finalDamage = isCritical ? this.damage * this.critMultiplier : this.damage

        target.emit("takeDamage", finalDamage)

        if (isCritical) {
            console.log("Critical Hit!")

            const critEmitter = new ParticleEmitter(this.scene, "crit")
            critEmitter.crit(target.x, target.y)

            target.setTint(0xffff00)
            this.scene.time.delayedCall(200, () => target.clearTint())
        }

        this.destroy()
    }
}
