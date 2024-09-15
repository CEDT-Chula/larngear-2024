class Tower {
    constructor(range, attack, reloadTime, TargetCount, maxLvl) {
        this.range = range;
        this.attack = attack;
        this.reloadTime = reloadTime;
        this.TargetCount = TargetCount;
        this.currentLvl = 1;
        this.maxLvl = maxLvl;
        this.skill = null;
        this.passive = null;
    }

    attackEnemy() {
        //Edit Later
      }
    
    UpgradeTower(anotherTower){

    }

    getRange() {
        return this.range();
    }
    getAttack() {
        return this.attack();
    }
    getReloadTime() {
        return this.reloadTime();
    }
    getTargetCount() {
        return this.TargetCount();
    }
    getCurrentLvl() {
        return this.currentLvl();
    }
    GetmaxLvl() {
        return this.maxLvl();
    }
}