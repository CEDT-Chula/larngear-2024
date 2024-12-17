import { TowerSkill } from "./TowerSkill";
import { TowerPassive } from "./TowerPassive";
import { BaseProjectTile } from "../projectile/BaseProjectile";
import { BaseEnemy } from "../enemies/BaseEnemy";
import { GameController } from "../util/GameController";
import { RicochetBullet } from "../projectile/RicochetBullet";
import { ExplosionBullet } from "../projectile/ExplosionBullet";
import { BurnBullet } from "../projectile/BurnBullet";
import { NormalBullet } from "../projectile/NormalBullet";
import { PoisonBullet } from "../projectile/PoisonBullet";

type BulletType = "normal" | "ricochet" | "explosion" | "burn" | "poison" | "slow"

export interface LevelData {
	range: number;
	attack: number;
	reloadTime: number; // how fast it can shoot
	targetCount: number; // how many target it can shoot at once
	sprite: string;

	explosionRange?: number;
	poisonDamage?: number;
	poisonDuration?: number;
}

export class BaseTower extends Phaser.GameObjects.Sprite {
	scene!: Phaser.Scene;
	range: number;
	rangeCircle: Phaser.GameObjects.Arc | undefined;
	rangeCheckEvent: Phaser.Time.TimerEvent | undefined;
	attack: number;
	currentLevel: number;
	maxLevel: number;
	skill: TowerSkill;
	passive: TowerPassive;
	levelData: LevelData[];
	reloadTime: number;
	readyToFire: boolean = true;
	targetCount: number;
	bulletSpeed: number = 1500;
	bulletSprite: string;

	// custom
	explosionRange?: number;
	poisonDamage?: number;
	poisonDuration?: number;

	pos: Phaser.Math.Vector2;

	popupElements: any[] = [];
	popupTimeout: NodeJS.Timeout | null = null;

	bulletType: BulletType

	constructor(
		scene: Phaser.Scene,
		pos: Phaser.Math.Vector2 | undefined,
		range: number,
		attack: number,
		reloadTime: number,
		targetCount: number,
		maxLvl: number,
		bulletSprite: string,
		bulletType: BulletType = "normal"
	) {
		super(scene, 0, 0, "");
		this.pos = pos ?? new Phaser.Math.Vector2(0, 0);
		this.range = range;
		this.attack = attack;
		this.reloadTime = reloadTime;
		this.targetCount = targetCount;
		this.currentLevel = 1;
		this.maxLevel = maxLvl;
		this.skill = new TowerSkill(0);
		this.passive = new TowerPassive();
		this.levelData = this.initializeLevelData();
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

		this.on("destroy", () => {
			this.clearPopup();
			this.rangeCircle?.destroy();
			this.rangeCheckEvent?.destroy();
		});
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
		if (!this.readyToFire) return;

		const activeEnemies = GameController.getInstance().activeEnemiesList;
		if (!activeEnemies || activeEnemies.length === 0) return;

		for (let enemy of activeEnemies) {
			if (enemy instanceof BaseEnemy && Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y) <= this.range && enemy.isAlive) {
				this.fire(enemy);
				break;
			}
		}
	}

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

	fire(target: BaseEnemy) {
		if (!this.readyToFire) return

		let bullet: BaseProjectTile

		switch (this.bulletType) {
			case "ricochet":
				bullet = new RicochetBullet(this.scene, this.bulletSpeed, this.attack, this.bulletSprite, target, 3)
				break
			case "explosion":
				bullet = new ExplosionBullet(this.scene, this.bulletSpeed, this.attack, this.bulletSprite, target, this.explosionRange)
				break
			case "burn":
				bullet = new BurnBullet(this.scene, this.bulletSpeed, this.attack, this.bulletSprite, target, 5, 3000)
				break
			case "poison":
				bullet = new PoisonBullet(this.scene, this.bulletSpeed, this.attack, this.bulletSprite, target, this.poisonDamage, this.poisonDuration)
				break
			default:
				bullet = new NormalBullet(this.scene, this.bulletSpeed, this.attack, this.bulletSprite, target)
				break
		}

		bullet.startProjectile(this.x, this.y)
		this.readyToFire = false

		this.scene.time.delayedCall((this.reloadTime * 1000) / this.scene.time.timeScale, () => {
			this.readyToFire = true
		})
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
			this.targetCount = data.targetCount;

			this.explosionRange = data.explosionRange;
			this.poisonDamage = data.poisonDamage;
			this.poisonDuration = data.poisonDuration;

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
			this.setTexture(this.levelData[this.currentLevel - 1].sprite);
			console.log(`Tower upgraded to level ${this.currentLevel}.`);
		} else {
			console.log("Tower is already at maximum level.");
		}
	}

	upgradeTower(anotherTower: BaseTower) {
		if (anotherTower instanceof BaseTower && this.currentLevel < this.maxLevel) {
			this.levelup();
			console.log(`Your tower is successfully upgraded to level ${this.getCurrentLvl}`);
		} else {
			console.log("Cannot upgrade. You reached the max level");
		}
	}

	sellTower() {
		GameController.getInstance().towerController.sellTower(this)
	}

	setSkill(skill: TowerSkill) {
		this.skill = skill;
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
		return this.targetCount;
	}
	getCurrentLvl() {
		return this.currentLevel;
	}
	getMaxLvl() {
		return this.maxLevel;
	}

	showPopup() {
		this.clearPopup(); // Clear any existing popups

		const popupBg = this.scene.add
			.rectangle(this.x, this.y, 200, 128, 0x000000, 0.8)
			.setOrigin(0.5)
			.setDepth(9)
			.setInteractive();
		this.popupElements.push(popupBg);

		const sellButton = this.createButton(
			"Sell",
			() => {
				if (!GameController.getInstance().isDragging)
					this.confirmAction("sell");
			},
			-30
		);
		const upgradeButton = this.createButton(
			"Upgrade",
			() => {
				if (!GameController.getInstance().isDragging)
					this.confirmAction("upgrade");
			},
			30
		);

		this.popupElements.push(sellButton[0], sellButton[1], upgradeButton[0], upgradeButton[1]);

		this.startPopupAutoHide();
	}

	createButton(label: string, callback: () => void, offsetY: number) {
		const button = this.scene.add
			.rectangle(this.x, this.y + offsetY, 180, 50, 0xffffff, 0.5)
			.setOrigin(0.5, 0.5)
			.setDepth(10)
			.setInteractive();

		button.on("pointerup", callback);

		const text = this.scene.add
			.text(this.x, this.y + offsetY, label, {
				fontFamily: "PressStart2P",
				fontSize: "18px",
				color: "#FFFFFF",
			})
			.setOrigin(0.5, 0.5)
			.setDepth(11);

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
					this.levelup();
				}
				this.clearPopup(); // Clear the popup after action
			},
			-30
		);

		const backButton = this.createButton(
			"Back",
			() => {
				this.showPopup(); // Show the original popup again
			},
			30
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
		}, 2000);
	}

	startPopupAutoHide() {
		this.schedulePopupHide(); // Start the auto-hide timer
	}
}
