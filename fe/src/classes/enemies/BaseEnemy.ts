export class BaseEnemy extends Phaser.GameObjects.Sprite {
  currentHealth: number;
  maxHealth: number;
  speed: number;
  attack: number;
  sprite: string;
  currentTween?: Phaser.Tweens.Tween;

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
  }

  // update(time: number, delta: number) {
  //   const adjustedSpeed = this.speed * this.scene.time.timeScale;
  //   this.x += (adjustedSpeed * delta) / 1000;
  // }

  takeDamage(dmg: number) {
    this.currentHealth -= dmg;

    if (this.currentHealth <= 0) {
      this.onDeath();
      this.destroy(true);
    }
  }

  

  // call when enemy reach the end of the road
  arrived() {
    // TODO: decrease Player's base hp by attack

    console.log(this.sprite, " reached the end!");
    this.destroy(true);
  }

  onDeath() {}
}
