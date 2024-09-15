class TowerUnit {
    constructor(name, towerList, currentLv = 1) {
        this.name = name;  
        this.towerList = towerList;  
        this.currentLv = currentLv;  
    }

    upgradeTower(otherTower) {
        if (this.currentLv === otherTower.currentLv && this.currentLv < 5) {
            this.currentLv++; 
            console.log(`${this.name} upgraded to Level ${this.currentLv}`);
        } else {
            console.log("Cannot upgrade this tower.");
        }
    }

    getStats() {
        const tower = this.towerList[this.currentLv - 1];
        return {
            range: tower.range,
            attack: tower.attack,
            reloadTime: tower.reloadTime
        };
    }
}