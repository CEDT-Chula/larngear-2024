import { GameController } from "./GameController";

export class GameUI {
	private static instance: GameUI;

	// Ref
	gameController: GameController = GameController.getInstance();
	coinIcon!: Phaser.GameObjects.Image;
	coinText!: Phaser.GameObjects.Text;

	private constructor() {
		
	}

	public static getInstance(): GameUI {
		if (!GameUI.instance) {
			GameUI.instance = new GameUI();
		}
		return GameUI.instance;
	}

	public static reduceCoin(amount: number) {
		GameController.getInstance().coin -= amount;
		this.updateCoinText();
	}

	public static increaseCoin(amount: number) {
		GameController.getInstance().coin += amount;
		this.updateCoinText();
	}

	private static updateCoinText() {
		this.getInstance().coinText.setText(`${GameController.getInstance().coin}`);
	}
}
