import { GameController } from "../util/GameController";
import { BaseEnemy } from "./BaseEnemy";

export class CakeEnemy extends BaseEnemy {
    hasDuplicated: boolean;

    constructor(
        scene: Phaser.Scene,
        Name: string = "Cake",
        Name_Color: string = "#FFB6C1",  
        maxHealth: number = 20 * GameController.getInstance().currentWave * GameController.getInstance().enemyHealth_Multiplier,
        speed: number = 400,
        attack: number = 1,
        sprite: string = "cake",
        // path: Phaser.Curves.Path
    ) {
        super(
            scene,
            Name,
            Name_Color,
            maxHealth,
            speed,
            attack,
            sprite,
        );

        this.hasDuplicated = false;
    }


    onDeath() {
        if (!this.hasDuplicated) {
            this.duplicate();
            this.hasDuplicated = true; 
        }
        super.onDeath();
    }

    duplicate() {
        console.log(this.Name, " is duplicating!")
      
        const newCake1 = new CakeEnemy(
          this.scene,
          this.Name,
          this.Name_Color,
          this.maxHealth / 2,  
          this.baseSpeed,
          this.attack,
          this.sprite,
        )
      
        const newCake2 = new CakeEnemy(
          this.scene,
          this.Name,
          this.Name_Color,
          this.maxHealth / 2,
          this.baseSpeed,
          this.attack,
          this.sprite,
        )

        this.scene.physics.world.enable([newCake1, newCake2])
        
        newCake1.hasDuplicated = true
        newCake2.hasDuplicated = true
      
        GameController.getInstance().mapGen.createEnemy(newCake1)
        GameController.getInstance().mapGen.moveEnemy(newCake1)
        GameController.getInstance().waveController.activeEnemies.push(newCake1)
        newCake1.on('destroyed', () => GameController.getInstance().waveController.checkWaveCleared());
        newCake1.setFlipX(true)
        
        GameController.getInstance().mapGen.createEnemy(newCake2)
        GameController.getInstance().mapGen.moveEnemy(newCake2)
        GameController.getInstance().waveController.activeEnemies.push(newCake2)
        newCake2.on('destroyed', () => GameController.getInstance().waveController.checkWaveCleared());
        newCake2.setFlipX(true)

        GameController.getInstance().addParticle("", 12, 150, 230)
      }
      
}
