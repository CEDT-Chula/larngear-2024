class SniperTower extends BaseTower {
    constructor () {
        super (20,15,2,1,5);
        this.setPassive(SniperPassive);
    }
    initializeLevelData() {
        return [
            { range: 20, attack: 15, reloadTime: 2, targetCount: 1 },
            { range: 25, attack: 20, reloadTime: 1.8, targetCount: 1 },
            { range: 30, attack: 25, reloadTime: 1.6, targetCount: 1 },
            { range: 35, attack: 30, reloadTime: 1.4, targetCount: 1 },
            { range: 40, attack: 35, reloadTime: 1.2, targetCount: 1 }
        ];
    }
    
    usePassive() {
        //permanent passive with condition?
        if (this.passive) {
            super.usePasive();
            this.attack += 5;
            this.reloadTime -=0.5;
        }
    }
}