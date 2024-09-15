class Tower {
    constructor(range, attack, reloadTime, TargetCount, limitLvl) {
        this.range = range;
        this.attack = attack;
        this.reloadTime = reloadTime;
        this.TargetCount = TargetCount;
        this.currentLvl = 1;
        this.limitLvl = limitLvl;
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
    GetLimitlvl() {
        return this.limitLvl();
    }
}