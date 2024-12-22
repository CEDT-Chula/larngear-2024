import { GameController } from "./GameController";

export class GameUI {
	private static instance: GameUI;

	// Ref
	gameController: GameController = GameController.getInstance();
	coinIcon!: Phaser.GameObjects.Image;
	coinText!: Phaser.GameObjects.Text;
	heartIcon!: Phaser.GameObjects.Image;
	healthText!: Phaser.GameObjects.Text;
	waveText!: Phaser.GameObjects.Text;
	speedButton!: Phaser.GameObjects.Text;
	selfDestructButton!: Phaser.GameObjects.Text;

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
		GameController.getInstance().accumCoin += amount;
		this.updateCoinText();
	}

	public alignCamera(camera: Phaser.Cameras.Scene2D.Camera) {
		const screenWidth = camera.width; // Viewport width
		const screenHeight = camera.height; // Viewport height

		// Top-left corner: Heart and Health
		this.heartIcon.setPosition(screenWidth * 0.05, screenHeight * 0.05);
		this.healthText.setPosition(screenWidth * 0.08, screenHeight * 0.038);

		// Top-left corner: Coin and Coin Text
		this.coinIcon.setPosition(screenWidth * 0.17, screenHeight * 0.05);
		this.coinText.setPosition(screenWidth * 0.2, screenHeight * 0.038);

		// Top-right corner: Wave Text
		this.waveText.setPosition(screenWidth * 0.75, screenHeight * 0.04);

		// Bottom-right corner: Speed Button
		this.speedButton.setPosition(screenWidth * 0.85, screenHeight * 0.95);

		this.selfDestructButton.setPosition(screenWidth / 2, screenHeight * 0.05)
	}

	private static updateCoinText() {
		this.getInstance().coinText.setText(`${GameController.getInstance().coin}`);
	}
}
