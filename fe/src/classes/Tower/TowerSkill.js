class TowerSkill {
    constructor(cooldown) {
        this.cooldown = cooldown;  // เวลา cooldown ก่อนที่จะใช้ skill ได้อีก
    }

    useSkill() {
        console.log("Using skill with cooldown of", this.cooldown, "seconds.");
    }
}
