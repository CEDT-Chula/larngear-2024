import { useEffect } from 'react';
import Phaser from 'phaser';

const DemoPhaserGame = () => {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      pixelArt: true,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 }, // No gravity, so the sprite doesn't fall
          debug: false, // Set to true if you want to see the hitbox and debug lines
        },
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };

    const game = new Phaser.Game(config);

    let player;
    let cursors;

    function preload() {
      this.load.image('logo', 'src/assets/react.svg');
    }

    function create() {
      player = this.physics.add.sprite(400, 300, 'logo');
      player.setCollideWorldBounds(true); // Prevent the sprite from going out of bounds

      // Display text on the screen
      this.add.text(400, 100, 'Use arrow keys to move around!', {
        fill: '#ffffff',
      }).setOrigin(0.5);

      // Enable arrow key input
      cursors = this.input.keyboard.createCursorKeys();
    }

    function update() {
      if (cursors.left.isDown) {
        player.setVelocityX(-160);
      } else if (cursors.right.isDown) {
        player.setVelocityX(160);
      } else {
        player.setVelocityX(0);
      }

      if (cursors.up.isDown) {
        player.setVelocityY(-160);
      } else if (cursors.down.isDown) {
        player.setVelocityY(160);
      } else {
        player.setVelocityY(0);
      }
    }

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="phaser-game" />;
};

export default DemoPhaserGame;
