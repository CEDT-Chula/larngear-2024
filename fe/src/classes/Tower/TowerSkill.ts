export class TowerSkill {
    cooldown: number;
    lastUsed: number;
    
    constructor(cooldown: number) {
        this.cooldown = cooldown;
        this.lastUsed = 0;
    }

    useSkill() {

    }
    
    isReady() {
        const currentTime = Date.now();
        if (currentTime - this.lastUsed >= this.cooldown * 1000) {
            this.lastUsed = currentTime;
            return true;
        } else {
            return false;
        }
    }
}