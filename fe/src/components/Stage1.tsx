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
        mode: Phaser.Scale.FIT,
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
      dom: { createContainer: true },
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  useEffect(() => {
    const container = document.getElementById("stage-1");
    if (container) {
      container.style.position = "absolute";
      container.style.top = "0";
      container.style.left = "0";
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.overflow = "hidden";
    }
  }, []);

  return <div id="stage-1" />;
};

export default Stage1;
