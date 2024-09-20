import Phaser from "phaser";
import { MapGenerator } from "../util/MapGenerator";
import { AssetLoader } from "../util/AssetLoader";
import { ParticleEmitter } from "../util/ParticleEmitter";
import { IceCreamEnemy } from "../enemies/IceCreamEnemy";
import { BaseEnemy } from "../enemies/BaseEnemy";

export class Stage1Scene extends Phaser.Scene {
  coinImage!: Phaser.GameObjects.Sprite;
  fontLoaded: boolean = false;
  speed: number = 1;
  speedText!: Phaser.GameObjects.Text;
  timerText!: Phaser.GameObjects.Text; 
  elapsedTime: number = 0; 
  enemies: BaseEnemy[] = []; 
  mapGen!: MapGenerator; // Declare mapGen as a class property

  constructor() {
    super({ key: "Stage1Scene" });
  }

  preload() {
    const assetLoader = new AssetLoader(this);
    assetLoader.preloadTowers();
    const stage1Tiles = [
      { key: "tile", path: "src/assets/tiles/grass.png" },
      { key: "path", path: "src/assets/tiles/dirt.png" },
    ];
    assetLoader.preloadTiles(stage1Tiles);
    assetLoader.preloadCoins();
    assetLoader.preloadEnemies();
    this.loadFont();
  }

  loadFont() {
    WebFont.load({
      custom: {
        families: ["PressStart2P"],
        urls: ["src/index.css"],
      },
      active: () => {
        this.fontLoaded = true;
      },
      inactive: () => {
        console.error("Font failed to load");
      },
    });
  }

  spawnEnemy() {
    const enemy = new IceCreamEnemy(this);
    this.enemies.push(enemy);
    this.mapGen.moveEnemy(enemy); // Ensure this line is included to move the enemy immediately
}
  

  create() {
    this.mapGen = new MapGenerator(this, 64, 4); // Store mapGen as a class property
    const grid = this.mapGen.generate(20, 15);
    const emitter = new ParticleEmitter(this, "tower4");

    // Add coin image to the left side of the screen
    this.coinImage = this.add
      .sprite(10, 14, "coin")
      .setOrigin(0, 0)
      .setScale(0.15)
      .setDepth(100);

    const points: Phaser.Math.Vector2[] = [
      new Phaser.Math.Vector2(0, 0),
      new Phaser.Math.Vector2(5 * this.mapGen.tileSize, 0),
      new Phaser.Math.Vector2(5 * this.mapGen.tileSize, 5 * this.mapGen.tileSize),
      new Phaser.Math.Vector2(0, 5 * this.mapGen.tileSize),
      new Phaser.Math.Vector2(0, 10 * this.mapGen.tileSize),
    ];

    const definePath = this.mapGen.definePath(grid, points);
    console.log("Defined Path:", definePath);
    
    this.time.addEvent({
      delay: 3000, // 3000 ms = 3 seconds
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true // Set to true to repeat the event
  }); 



    // Speed button
    const buttonX = this.cameras.main.width - 50;
    const buttonY = this.cameras.main.height - 50;
    this.speedText = this.add
      .text(buttonX, buttonY, "x1", { font: "30px PressStart2P", fill: "#fff" })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", this.toggleSpeed, this);
    
    this.input.on("pointerdown", (pointer: any) => {
      emitter.play(12, pointer.x, pointer.y);
    });

    this.scale.on("resize", this.resize, this);
  }

  toggleSpeed() {
    this.speed = this.speed === 1 ? 2 : 1;
    this.time.timeScale = this.speed; // Adjust the global time scale
    this.speedText.setText(`x${this.speed}`);
    this.updateEnemySpeeds(); // Update enemies' speeds
  }
  

  updateEnemySpeeds() {
    this.enemies.forEach((enemy) => {
      if (enemy.currentTween) {
        // Calculate how far the enemy has moved already
        const currentX = enemy.x;
        const currentY = enemy.y;
        const nextX = enemy.currentTween.data[0].x;
        const nextY = enemy.currentTween.data[0].y;
  
        // Calculate the remaining distance to the next point
        const remainingDistance = Phaser.Math.Distance.Between(currentX, currentY, nextX, nextY);
  
        // Calculate the new duration based on the remaining distance and the new speed
        const newDuration = (remainingDistance / (enemy.speed * this.speed)) * 1000; // Adjust by speed
  
        // Stop the current tween at the enemy's current position
        enemy.currentTween.stop();
  
        // Create a new tween to continue moving the enemy to the next point with the updated speed
        enemy.currentTween = this.tweens.add({
          targets: enemy,
          x: nextX,
          y: nextY,
          duration: newDuration, // Adjusted duration based on speed
          ease: 'Linear',
          onComplete: () => {
            // Move to the next point after completing this tween
            this.mapGen.moveEnemy(enemy); // Use this.mapGen to call moveEnemy
          },
        });
      }
    });
  }
  

  updateTimer() {
    this.elapsedTime += 1;
    this.timerText.setText(`Time: ${this.elapsedTime}`);
  }

  resize(gameSize: Phaser.Structs.Size) {
    const buttonX = this.cameras.main.width - 50;
    const buttonY = this.cameras.main.height - 50;
    this.speedText.setPosition(buttonX, buttonY);

    this.timerText = this.add
      .text(this.cameras.main.width / 2, this.cameras.main.height / 2, "Time: 0", {
        font: "30px PressStart2P",
        fill: "#fff",
      })
      .setOrigin(0.5);

    this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });
  }
}

