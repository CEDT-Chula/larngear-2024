class NormalSingleTarget extends BaseTower {
    constructor() {
        // Pass initial values and maximum level
        super(15, 10, 1.5, 1, 5);  // Initialize with level 1 
    }

    // Define level data
    initializeLevelData() {
        return [
            { range: 15, attack: 10, reloadTime: 1.5, targetCount: 1 },
            { range: 20, attack: 15, reloadTime: 1.3, targetCount: 1 },
            { range: 25, attack: 20, reloadTime: 1.1, targetCount: 1 },
            { range: 30, attack: 25, reloadTime: 0.9, targetCount: 1 },
            { range: 35, attack: 30, reloadTime: 0.7, targetCount: 1 }
        ];
    }
}