class SniperTower extends BaseTower {
    constructor () {
        super (20,15,2,1,5);
        this.setPassive(SniperPassive);
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