// Base class for all towers
class BaseTower {
    constructor(range, attack, reloadTime, targetCount, maxLvl) {
        this.range = range;
        this.attack = attack;
        this.reloadTime = reloadTime;
        this.targetCount = targetCount;
        this.currentLvl = 1;
        this.maxLvl = maxLvl;
        this.skill = null;
        this.passive = null;
        this.levelData = this.initializeLevelData();  // Set level data
    }

    // Abstract method to be overridden in derived classes
    initializeLevelData() {
        throw new Error("initializeLevelData must be implemented in derived classes.");
    }

    applyLevelData() {
        if (this.currentLvl <= this.maxLvl) {
            const data = this.levelData[this.currentLvl - 1];
            this.range = data.range;
            this.attack = data.attack;
            this.reloadTime = data.reloadTime;
            this.targetCount = data.targetCount;
        }
    }

    upgrade() {
        if (this.currentLvl < this.maxLvl) {
            this.currentLvl++;
            this.applyLevelData();  // Update properties based on level
            console.log(`Tower upgraded to level ${this.currentLvl}.`);
        } else {
            console.log("Tower is already at maximum level.");
        }
    }

    // Upgrade with another tower
    upgradeTower(anotherTower) {
        if (anotherTower instanceof this.constructor && this.currentLvl < this.maxLvl) {
            this.upgrade();
            console.log(`Your tower is successfully upgraded to level ${getCurrentLvl}`);
            anotherTower.remove();
        } else {
            console.log("Cannot upgrade. You reached the max level");
        }
    }

    getRange() { return this.range; }
    getAttack() { return this.attack; }
    getReloadTime() { return this.reloadTime; }
    getTargetCount() { return this.targetCount; }
    getCurrentLvl() { return this.currentLvl; }
    getMaxLvl() { return this.maxLvl; }

    remove() {
        //edit later
    }
}