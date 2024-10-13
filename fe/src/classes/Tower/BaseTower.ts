import { TowerSkill } from "./TowerSkill";
import { TowerPassive } from "./TowerPassive";
import { BaseProjectTile } from "../projectile/BaseProjectile";
import { BaseEnemy } from "../enemies/BaseEnemy";
import { GameController } from "../util/GameController";

export interface LevelData {
    range: number;
    attack: number;
    reloadTime: number; // how fast it can shoot
    targetCount: number; // how many target it can shoot at once
    sprite: string;
}

export class BaseTower extends Phaser.GameObjects.Sprite {
    scene!: Phaser.Scene;
    range: number;
    rangeCircle: Phaser.GameObjects.Arc | undefined;
    attack: number;
    currentLevel: number;
    maxLevel: number;
    skill: TowerSkill;
    passive: TowerPassive;
    levelData: LevelData[];
    reloadTime: number;
    readyToFire: boolean = true;
    targetCount: number;
    bulletSpeed: number = 900;
    bulletSprite: string;

    constructor(scene: Phaser.Scene, range: number, attack: number, reloadTime: number, targetCount: number, maxLvl: number, bulletSprite: string) {
        super(scene, 0, 0, "");
        this.range = range;
        this.attack = attack;
        this.reloadTime = reloadTime;
        this.targetCount = targetCount;
        this.currentLevel = 1;
        this.maxLevel = maxLvl;
        this.skill = new TowerSkill(0);
        this.passive = new TowerPassive();
        this.levelData = this.initializeLevelData();
        this.setTexture(this.levelData[0].sprite);
        this.bulletSprite = bulletSprite;
    }

    placeRangeCircle() {
        this.rangeCircle = this.scene.add.circle(this.x, this.y, this.range, 0x00ff00, 0.2);
        this.scene.physics.world.enable(this.rangeCircle);
        const rangeBody = this.rangeCircle.body as Phaser.Physics.Arcade.Body;
        rangeBody.setCircle(this.range); // Set the physics body to be a circle with a radius of this.range

        this.scene.physics.add.overlap(
            this.rangeCircle,
            GameController.getInstance().enemiesGroup!,
            (src: any, obj: any) => {
                if (obj instanceof Phaser.GameObjects.GameObject) {
                    this.fire(obj);
                }
            },
            undefined,
            this
        );
    }

    fire(target: Phaser.GameObjects.GameObject) {
        if (target instanceof BaseEnemy && this.readyToFire) {
            const bullet = new BaseProjectTile(this.scene, this.bulletSpeed, this.attack, this.bulletSprite, target);
            bullet.startProjectile(this.x, this.y);
            this.readyToFire = false;
            setTimeout(() => {
                this.readyToFire = true;
            }, this.reloadTime * 1000);
            target.on("destroy", () => {
                bullet.destroy();
            });
        }
    }

    initializeLevelData(): LevelData[] {
        throw new Error("initializeLevelData must be implemented in derived classes.");
    }

    applyLevelData() {
        if (this.currentLevel <= this.maxLevel) {
            const data = this.levelData[this.currentLevel - 1];
            this.range = data.range;
            this.attack = data.attack;
            this.reloadTime = data.reloadTime;
            this.targetCount = data.targetCount;
            this.setTexture(data.sprite);
        }
    }

    // TODO : Handle Sprite Change When Lv up
    levelup() {
        if (this.currentLevel < this.maxLevel) {
            this.currentLevel++;
            this.applyLevelData();
            console.log(`Tower upgraded to level ${this.currentLevel}.`);
        } else {
            console.log("Tower is already at maximum level.");
        }
    }

    upgradeTower(anotherTower: BaseTower) {
        if (anotherTower instanceof BaseTower && this.currentLevel < this.maxLevel) {
            this.levelup();
            console.log(`Your tower is successfully upgraded to level ${this.getCurrentLvl}`);
            anotherTower.remove();
        } else {
            console.log("Cannot upgrade. You reached the max level");
        }
    }

    setSkill(skill: TowerSkill) {
        this.skill = skill;
    }

    getRange() {
        return this.range;
    }
    getAttack() {
        return this.attack;
    }
    getReloadTime() {
        return this.reloadTime;
    }
    getTargetCount() {
        return this.targetCount;
    }
    getCurrentLvl() {
        return this.currentLevel;
    }
    getMaxLvl() {
        return this.maxLevel;
    }

    remove() {
        //edit later
    }
}
