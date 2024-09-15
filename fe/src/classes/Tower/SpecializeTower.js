class SpecializeTower extends BaseTower {
    constructor () {
        super (20,15,2,1,5);
        this.setPassive(SniperPassive);
    }
    usePassive() {
// if enemy is ... will deal more damage
    }
}