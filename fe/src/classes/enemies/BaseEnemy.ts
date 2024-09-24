export class BaseEnemy extends Phaser.GameObjects.Sprite {
  currentHealth: number;
  maxHealth: number;
  speed: number;
  attack: number;
  sprite: string;
  currentTween?: Phaser.Tweens.Tween;
  currentPointIndex: number; 

  constructor(
    scene: Phaser.Scene,
    maxHealth: number,
    speed: number,
    attack: number,
    sprite: string
  ) {
    super(scene, 0, 0, "");
    this.maxHealth = maxHealth;
    this.currentHealth = this.maxHealth;
    this.speed = speed;
    this.attack = attack;
    this.sprite = sprite;
    this.setTexture(sprite);
    
    this.setOrigin(0);
    this.setScale(4);
    
    this.scene.add.existing(this);
    this.currentTween = undefined;
    this.currentPointIndex = 0; // Initialize the index
  }

  takeDamage(dmg: number) {
    this.currentHealth -= dmg;

    if (this.currentHealth <= 0) {
      this.onDeath();
      this.destroy(true);
    }
  }

  arrived() {
    console.log(this.sprite, " reached the end!");
    this.destroy(true);
  }

  onDeath() {}
}
