import { BaseProjectTile } from "../projectile/BaseProjectile";
import { BaseEnemy } from "../enemies/BaseEnemy";
import { GameController } from "../util/GameController";
import { RicochetBullet } from "../projectile/RicochetBullet";
import { ExplosionBullet } from "../projectile/ExplosionBullet";
import { BurnBullet } from "../projectile/BurnBullet";
import { NormalBullet } from "../projectile/NormalBullet";
import { PoisonBullet } from "../projectile/PoisonBullet";
import { SlowBullet } from "../projectile/SlowBullet";
import { CriticalBullet } from "../projectile/CriticalBullet";

type BulletType = "normal" | "ricochet" | "explosion" | "burn" | "poison" | "slow" | "crit"

export interface LevelData {
	range: number;
	attack: number;
	reloadTime: number; // how fast it can shoot
	maxTarget: number; // how many target it can shoot at once
	sprite: string;

	explosionRange?: number;
	poisonDamage?: number;
	poisonDuration?: number;
	burnDamage?: number;
	burnDuration?: number;
	slowAmount?: number;
	slowDuration?: number;
	ricochetCount?: number;
	critChance?: number;
	critMultiplier?: number;
}

export class BaseTower extends Phaser.GameObjects.Sprite {
	scene!: Phaser.Scene;
	range!: number;
	rangeCircle: Phaser.GameObjects.Arc | undefined;
	rangeCheckEvent: Phaser.Time.TimerEvent | undefined;
	attack!: number;
	currentLevel: number;
	maxLevel: number;
	levelData: LevelData[];
	reloadTime!: number;
	readyToFire: boolean = true;
	maxTarget!: number;
	bulletSpeed: number = 1500;
	bulletSprite: string;

	// custom
	explosionRange?: number;
	poisonDamage?: number;
	poisonDuration?: number;
	burnDamage?: number;
	burnDuration?: number;
	slowAmount?: number;
	slowDuration?: number;
	ricochetCount?: number;
	critChance?: number;
	critMultiplier?: number;

	pos: Phaser.Math.Vector2;

	popupElements: any[] = [];
	popupTimeout: NodeJS.Timeout | null = null;

	bulletType: BulletType

	selectedTower: BaseTower | null = null; // The selected tower for upgrading
	highlight: Phaser.GameObjects.Rectangle | null = null;

	constructor(
		scene: Phaser.Scene,
		pos: Phaser.Math.Vector2 | undefined,
		maxLvl: number,
		bulletSprite: string,
		bulletType: BulletType = "normal"
	) {
		super(scene, 0, 0, "");
		this.scene = scene;
		this.pos = pos ?? new Phaser.Math.Vector2(0, 0);
		this.currentLevel = 1;
		this.maxLevel = maxLvl;
		this.levelData = this.initializeLevelData();
		this.applyLevelData()
		this.setTexture(this.levelData[0].sprite);
		this.bulletSprite = bulletSprite;
		this.bulletType = bulletType
		this.setInteractive();

		this.on("pointerup", () => {
			if (!GameController.getInstance().isDragging)
				this.showPopup();
		});
		this.on("pointerover", () => {
			this.showRangeCircle();
		});
		this.on("pointerout", () => {
			this.hideRangeCircle();
			this.schedulePopupHide();
		});

		// this.on("destroy", () => {
		// 	this.clearPopup();
		// 	this.rangeCircle?.destroy();
		// 	this.rangeCheckEvent?.destroy();
		// });
	}

	placeRangeCircle() {
		this.rangeCircle = this.scene.add.circle(this.x, this.y, this.range, 0x00fffb, 0.2);
		this.hideRangeCircle();
		this.scene.physics.world.enable(this.rangeCircle);
		const rangeBody = this.rangeCircle.body as Phaser.Physics.Arcade.Body;
		rangeBody.setCircle(this.range);

		this.rangeCheckEvent = this.scene.time.addEvent({
			delay: 100,
			callback: this.checkForEnemiesInRange,
			callbackScope: this,
			loop: true
		});
	}


	checkForEnemiesInRange = () => {
		// Ensure the tower is still active in the scene
		if (!this.scene || !this.active) return;

		if (!this.readyToFire) return;

		const activeEnemies = GameController.getInstance().activeEnemiesList;
		if (!activeEnemies || activeEnemies.length === 0) return;

		const targets: BaseEnemy[] = activeEnemies.filter(
			(enemy) =>
				enemy instanceof BaseEnemy &&
				Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y) <= this.range &&
				enemy.isAlive
		).slice(0, this.maxTarget); // Limit to maxTarget enemies

		if (targets.length > 0) {
			this.fire(targets);
		}
	};



	hideRangeCircle() {
		if (this.rangeCircle) {
			this.rangeCircle.alpha = 0;
		}
	}

	showRangeCircle() {
		if (this.rangeCircle) {
			this.rangeCircle.alpha = 1;
		}
	}

	fire(targets: BaseEnemy[]) {
		if (!this.readyToFire) return;

		targets.forEach((target) => {
			let bullet: BaseProjectTile;

			switch (this.bulletType) {
				case "ricochet":
					bullet = new RicochetBullet(this.scene, this.bulletSpeed, this.attack, this.bulletSprite, target, this.ricochetCount);
					break;
				case "explosion":
					bullet = new ExplosionBullet(this.scene, this.bulletSpeed, this.attack, this.bulletSprite, target, this.explosionRange);
					break;
				case "burn":
					bullet = new BurnBullet(this.scene, this.bulletSpeed, this.attack, this.bulletSprite, target, this.burnDamage, this.burnDuration);
					break;
				case "poison":
					bullet = new PoisonBullet(this.scene, this.bulletSpeed, this.attack, this.bulletSprite, target, this.poisonDamage, this.poisonDuration);
					break;
				case "slow":
					bullet = new SlowBullet(this.scene, this.bulletSpeed, this.attack, this.bulletSprite, target, this.slowAmount, this.slowDuration);
					break;
				case "crit":
					bullet = new CriticalBullet(this.scene, this.bulletSpeed, this.attack, this.bulletSprite, target, this.critChance, this.critMultiplier);
					break;
				default:
					bullet = new NormalBullet(this.scene, this.bulletSpeed, this.attack, this.bulletSprite, target);
					break;
			}

			bullet.startProjectile(this.x, this.y);
		});

		this.readyToFire = false;

		this.scene.time.delayedCall((this.reloadTime * 1000) / this.scene.time.timeScale, () => {
			this.readyToFire = true;
		});
	}


	initializeLevelData(): LevelData[] {
		throw new Error("initializeLevelData must be implemented in derived classes.");
	}

	applyLevelData() {
		if (this.currentLevel <= this.maxLevel) {
			const data = this.levelData[this.currentLevel - 1];
			this.range = data.range;
			this.attack = data.attack;
			this.reloadTime = data.reloadTime;
			this.maxTarget = data.maxTarget;

			this.explosionRange = data.explosionRange;
			this.poisonDamage = data.poisonDamage;
			this.poisonDuration = data.poisonDuration;
			this.burnDamage = data.burnDamage;
			this.burnDuration = data.burnDuration;
			this.slowAmount = data.slowAmount;
			this.slowDuration = data.slowDuration;
			this.ricochetCount = data.ricochetCount;
			this.critChance = data.critChance;
			this.critMultiplier = data.critMultiplier;

			this.setTexture(data.sprite);

			this.updateRangeCircle();
		}
	}

	updateRangeCircle() {
		// Destroy existing range circle and timer event
		this.rangeCircle?.destroy();
		this.rangeCheckEvent?.remove();

		// Re-create the range circle
		this.placeRangeCircle();
	}


	levelup() {
		if (this.currentLevel < this.maxLevel) {
			this.currentLevel++;
			this.applyLevelData();
			this.scene.sound.play("upgrade", { volume: 0.3 })
			this.setTexture(this.levelData[this.currentLevel - 1].sprite);
			console.log(`Tower upgraded to level ${this.currentLevel}.`);
		} else {
			console.log("Tower is already at maximum level.");
		}
	}

	upgradeTower() {
		if (!this.selectedTower) return

		// Remove the selected tower
		const towerIndex = GameController.getInstance().towerList.findIndex(
			(tower) => tower === this.selectedTower
		)

		if (towerIndex !== -1) {
			this.selectedTower.safeDestroy()
			GameController.getInstance().towerList.splice(towerIndex, 1)
			GameController.getInstance().gridMap[this.selectedTower.pos.y][this.selectedTower.pos.x].occupied = false
		}

		this.levelup() // Upgrade this tower
		this.selectedTower = null // Clear the reference
		this.clearHighlight() // Remove highlight if present

		console.log(`Tower upgraded to level ${this.currentLevel}`)
	}



	clearHighlight() {
		if (this.highlight) {
			console.log("Clearing highlight.");
			this.highlight.destroy();
			this.highlight = null;
		}
		this.selectedTower = null;
	}


	sellTower() {
		GameController.getInstance().towerController.sellTower(this)
	}

	getRange() {
		return this.range;
	}
	getAttack() {
		return this.attack;
	}
	getReloadTime() {
		return this.reloadTime;
	}
	getTargetCount() {
		return this.maxTarget;
	}
	getCurrentLvl() {
		return this.currentLevel;
	}
	getMaxLvl() {
		return this.maxLevel;
	}

	findAndHighlightMatchingTower() {
		const matchingTower = GameController.getInstance().towerList.find(
			(tower) =>
				tower !== this && // Exclude this tower
				tower instanceof this.constructor && // Match the same class
				tower.currentLevel === this.currentLevel // Match the same level
		)

		if (matchingTower) {
			this.selectedTower = matchingTower

			// Highlight the matching tower
			this.highlight = this.scene.add
				.rectangle(matchingTower.x, matchingTower.y, 50, 50, 0xffff00, 0.5) // Yellow highlight
				.setOrigin(0.5)
		} else {
			console.log("No matching tower found for upgrade.")
			this.selectedTower = null
		}
	}


	showPopup() {
		this.clearPopup(); // Clear any existing popups

		const popupBg = this.scene.add
			.rectangle(this.x, this.y, 200, 128, 0x000000, 0.8)
			.setOrigin(0.5)
			.setDepth(5)
			.setInteractive();
		this.popupElements.push(popupBg);

		// Create the upgrade button (now at the top)
		const upgradeAvailable = this.currentLevel < this.maxLevel; // Check if upgrade is available
		this.findAndHighlightMatchingTower();
		const upgradeButtonColor = this.selectedTower && upgradeAvailable ? 0x00ff00 : 0xff0000; // Green if available, red if not
		const upgradeButton = this.createButton(
			"Upgrade",
			() => {
				if (upgradeAvailable && !GameController.getInstance().isDragging) {
					this.confirmAction("upgrade");
				}
			},
			-30, // Top button
			upgradeButtonColor
		);

		// Create the sell button (now at the bottom)
		const sellButton = this.createButton(
			"Sell",
			() => {
				if (!GameController.getInstance().isDragging) this.confirmAction("sell");
			},
			30, // Bottom button
			0xffffff // White color for the sell button
		);

		this.popupElements.push(upgradeButton[0], upgradeButton[1], sellButton[0], sellButton[1]);

		// Hide the popup when clicking outside
		const pointerDownHandler = (pointer: Phaser.Input.Pointer) => {
			if (
				!popupBg.getBounds().contains(pointer.worldX, pointer.worldY) &&
				!this.popupElements.some((element) =>
					element.getBounds ? element.getBounds().contains(pointer.worldX, pointer.worldY) : false
				)
			) {
				this.clearPopup(); // Clear popup when clicked outside
				this.clearHighlight();
				this.scene.input.off("pointerdown", pointerDownHandler); // Remove this listener
			}
		};

		this.scene.input.on("pointerdown", pointerDownHandler);

		this.startPopupAutoHide();
	}

	// Update the createButton method to accept a color parameter
	createButton(label: string, callback: () => void, offsetY: number, color: number) {
		const button = this.scene.add
			.rectangle(this.x, this.y + offsetY, 180, 50, color, 0.5) // Use the passed color
			.setOrigin(0.5, 0.5)
			.setDepth(6)
			.setInteractive();

		// Only enable the button if it's not red (indicating an unavailable upgrade)
		if (color !== 0xff0000) {
			button.on("pointerdown", callback);
		}

		const text = this.scene.add
			.text(this.x, this.y + offsetY, label, {
				fontFamily: "PressStart2P",
				fontSize: "18px",
				color: "#FFFFFF",
			})
			.setOrigin(0.5, 0.5)
			.setDepth(7);

		return [button, text];
	}

	confirmAction(action: string) {
		this.clearPopup(); // Clear the popup for confirmation
		const confirmText = action === "sell" ? "Are you sure you want to sell?" : "Are you sure you want to upgrade?";

		const confirmButton = this.createButton(
			"Confirm",
			() => {
				if (action === "sell") {
					this.sellTower();
				} else if (action === "upgrade") {
					this.upgradeTower()
					// this.levelup()
				}
				this.clearPopup(); // Clear the popup after action
			},
			-30,
			0x282828
		);

		const backButton = this.createButton(
			"Back",
			() => {
				this.showPopup(); // Show the original popup again
			},
			30,
			0x282828
		);

		this.popupElements.push(
			this.scene.add
				.text(0, -20, confirmText, {
					fontFamily: "PressStart2P",
					fontSize: "16px",
					color: "#FFDD00",
				})
				.setOrigin(0.5)
				.setDepth(11),
			confirmButton[0],
			confirmButton[1],
			backButton[0],
			backButton[1]
		);

		this.startPopupAutoHide();
	}

	clearPopup() {
		this.popupElements.forEach(element => element.destroy());
		this.popupElements = [];
		if (this.popupTimeout) {
			clearTimeout(this.popupTimeout);
			this.popupTimeout = null; // Reset the timeout
		}
	}

	schedulePopupHide() {
		if (this.popupTimeout) {
			clearTimeout(this.popupTimeout); // Clear existing timeout
		}
		this.popupTimeout = setTimeout(() => {
			this.clearPopup(); // Hide popup after 1 second
			this.clearHighlight()
		}, 2000);
	}

	startPopupAutoHide() {
		this.schedulePopupHide(); // Start the auto-hide timer
	}

	safeDestroy() {
		if (this.rangeCheckEvent) {
			this.rangeCheckEvent.remove();
			this.rangeCheckEvent = undefined;
		}
		if (this.rangeCircle) {
			this.rangeCircle.destroy();
			this.rangeCircle = undefined;
		}
		this.clearPopup()
		this.destroy(); // Finally destroy the tower
	}
}
