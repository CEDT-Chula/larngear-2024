import { useEffect } from "react";
import Phaser from "phaser";
import { Stage1Scene } from "../classes/scenes/Stage1Scene";

const Stage1 = () => {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 1280, // Fixed width
      height: 960, // Fixed height
      pixelArt: true,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
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
