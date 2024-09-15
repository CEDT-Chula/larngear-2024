class MissileTower extends BaseTower {
    constructor() {
        super(10, 5, 1.2, 5, 5);  
        const missileSkill = new TowerSkill(15); 
        this.setSkill(missileSkill); }

    useSkill() {
        const currentTime = Date.now();
        const skill = this.skills[0]; 

        if (iSSkillReady) {
            this.attack += 5;
            this.targetCount = 9; 
            console.log(`Missile Tower's attack increased to ${this.attack}.`);
            skill.lastUsed = currentTime;
        } else {
            const remainingTime = ((this.cooldown * 1000 - (currentTime - this.lastUsed)) / 1000).toFixed(1);
            console.log(`Skill on cooldown. Please wait ${remainingTime} seconds.`);
        }
    }
}
