class TowerSkill {
    constructor(cooldown) {
        this.cooldown = cooldown;
        this.lastUsed = 0;
    }

    useSkill() {

    }
    isSkillready() {
        const currentTime = Date.now();
        if (currentTime - this.lastUsed >= this.cooldown * 1000) {
            this.lastUsed = currentTime;
            return true;
        } else {
            return false;
        }
    }
}