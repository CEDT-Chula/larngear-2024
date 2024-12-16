import React, { useEffect } from "react";
import Phaser from "phaser";
import { Stage1Scene } from "../classes/scenes/Stage1Scene";

const Stage1: React.FC = () => {
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: "stage-1",
      width: 1280, // Fixed width
      height: 1088, // Fixed height
      pixelArt: true,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scene: [Stage1Scene],
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="stage-1" />;
};

export default Stage1;
