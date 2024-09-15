class SniperTower extends BaseTower {
    constructor () {
        super (20,15,2,1,5);
        this.setPassive(SniperPassive);
    }
    usePassive() {
        if (this.passive) {
            super.usePasive();
            this.range += 20;
        }
    }
}