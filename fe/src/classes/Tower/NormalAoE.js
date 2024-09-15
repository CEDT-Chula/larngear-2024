class NormalAoE extends BaseTower {
    constructor () {
        super (5,9,1,3,3);
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
}