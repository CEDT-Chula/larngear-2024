export class GameController {
    private static instance: GameController;

    // Game Stats
    currentWave: number;
    enemyPerWave: number;
    coin: number;
    coinPerKill: number;
    
    // Multiplier
    enemyHealth_Multiplier: number;
    enemySpeed_Multiplier: number;
    moneyDrop_Multiplier: number;

    // Pool
    towerPool_All: string[];
    towerPool_Current: string[];

    private constructor() {
        this.currentWave = 1;
        this.enemyPerWave = 20;
        this.coin = 500;
        this.coinPerKill = 20;

        this.enemyHealth_Multiplier = 1;
        this.enemySpeed_Multiplier = 1;
        this.moneyDrop_Multiplier = 1;

        this.towerPool_All = [
            "browser",
        ];
        this.towerPool_Current = this.towerPool_All;
    }

    public static getInstance(): GameController {
        if (!GameController.instance) {
            GameController.instance = new GameController();
        }
        return GameController.instance;
    }
}