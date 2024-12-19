import { GameController } from "../util/GameController";
import { BaseEnemy } from "./BaseEnemy";

export class CupCakeEnemy extends BaseEnemy {
    summonInterval: number; // Time interval between summons in milliseconds
    summonTimer: Phaser.Time.TimerEvent | null = null;

    constructor(
        scene: Phaser.Scene,
        Name: string = "CupCake",
        Name_Color: string = "#FDFBD4",
        maxHealth: number = 50 + (55 * GameController.getInstance().currentWave * GameController.getInstance().enemyHealth_Multiplier),
        speed: number = 250 * GameController.getInstance().enemySpeed_Multiplier,
        attack: number = 1,
        sprite: string = "cupcake",
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
            // path
        );

        this.summonInterval = 1000;
    }

    startSummoning() {
        this.summonTimer = this.scene.time.addEvent({
            delay: this.summonInterval,
            loop: true,
            callback: () => {
                if (this.isAlive) {
                    this.summon();
                } else {
                    this.stopSummoning(); // Stop the timer if CupCakeEnemy is dead
                }
            },
            callbackScope: this,
        });
    }

    summon() {
        const randomEnemyIndex = Math.floor(Math.random() * GameController.getInstance().enemyPool.length);
        const EnemyClass = GameController.getInstance().enemyPool[randomEnemyIndex];

        if (EnemyClass && GameController.getInstance().activeEnemiesList.length < 50) {
            const summonedEnemy = new EnemyClass(this.scene);

            this.scene.physics.world.enable([summonedEnemy])

            GameController.getInstance().enemySummon += 1;

            // Add the summoned enemy to the game
            GameController.getInstance().mapGen.createEnemy(summonedEnemy);
            GameController.getInstance().mapGen.moveEnemy(summonedEnemy);
            GameController.getInstance().waveController.activeEnemies.push(summonedEnemy)
            summonedEnemy.on('destroyed', () => GameController.getInstance().waveController.checkWaveCleared());
        }
    }

    stopSummoning() {
        if (this.summonTimer) {
            this.summonTimer.remove();
            this.summonTimer = null;
        }
    }

    onDeath() {
        this.stopSummoning(); // Ensure summoning stops if destroyed
        super.onDeath();
    }
}
