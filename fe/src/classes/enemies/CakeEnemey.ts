import { GameController } from "../util/GameController";
import { BaseEnemy } from "./BaseEnemy";

export class CakeEnemy extends BaseEnemy {
    hasDuplicated: boolean;

    constructor(
        scene: Phaser.Scene,
        Name: string = "Cake",
        Name_Color: string = "#FFB6C1",  
        maxHealth: number = 80,
        speed: number = 50,
        attack: number = 12,
        isPoisonResist: boolean = false, 
        isBurnResist: boolean = false,
        isSlowResist: boolean = false,
        isFreezeResist: boolean = false,
        sprite: string = "fe/src/enemies/cake.png",
        path: Phaser.Curves.Path
    ) {
        super(
            scene,
            Name,
            Name_Color,
            maxHealth,
            speed,
            attack,
            isPoisonResist,
            isBurnResist,
            isSlowResist,
            isFreezeResist,
            sprite,
            path
        );

        this.hasDuplicated = false;
    }


    onDeath() {
        if (!this.hasDuplicated) {
            this.duplicate();
            this.hasDuplicated = true; 
        } else {
            super.onDeath();
        }
    }

    duplicate() {
        console.log(this.Name, " is duplicating!");

        const newCake1 = new CakeEnemy(
            this.scene,
            this.Name,
            this.Name_Color,
            this.maxHealth / 2,  
            this.baseSpeed,
            this.attack,
            this.isPoisonResist,
            this.isBurnResist,
            this.isSlowResist,
            this.isFreezeResist,
            this.sprite,
            this.path
        );

        const newCake2 = new CakeEnemy(
            this.scene,
            this.Name,
            this.Name_Color,
            this.maxHealth / 2,
            this.baseSpeed,
            this.attack,
            this.isPoisonResist,
            this.isBurnResist,
            this.isSlowResist,
            this.isFreezeResist,
            this.sprite,
            this.path
        );

        newCake1.setPosition(this.x-1, this.y);
        newCake2.setPosition(this.x, this.y);

        this.destroy(true);
    }
}
