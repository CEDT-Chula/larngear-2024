import { GameController } from "./GameController";

export class GameUI {
	private static instance: GameUI;

	// Ref
	gameController: GameController = GameController.getInstance();
	coinIcon: Phaser.GameObjects.Image;
	coinText: Phaser.GameObjects.Text;

	private constructor() {
		this.coinIcon = this.gameController.currentScene.add
			.image(10, 14, "coin")
			.setOrigin(0, 0)
			.setScale(0.15)
			.setDepth(1);

		this.coinText = this.gameController.currentScene.add
			.text(68, 20, `${GameController.getInstance().coin}`, {
				fontFamily: "PressStart2P",
				fontSize: "30px",
				color: "#ffd700", // Gold color
			})
			.setDepth(1);
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
