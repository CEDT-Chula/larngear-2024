import { TowerSkill } from "./TowerSkill";
import { TowerPassive } from "./TowerPassive";

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
    attack: number;
    currentLevel: number;
    maxLevel: number;
    skill: TowerSkill;
    passive: TowerPassive;
    levelData: LevelData[];
    reloadTime: number;
    targetCount: number;

    constructor(scene: Phaser.Scene, range: number, attack: number, reloadTime: number, targetCount: number, maxLvl: number) {
        super(scene, 0, 0, "")
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

    setSkill(skill: TowerSkill) { this.skill = skill }

    getRange() { return this.range; }
    getAttack() { return this.attack; }
    getReloadTime() { return this.reloadTime; }
    getTargetCount() { return this.targetCount; }
    getCurrentLvl() { return this.currentLevel; }
    getMaxLvl() { return this.maxLevel; }

    remove() {
        //edit later
    }
}