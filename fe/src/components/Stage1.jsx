import { useEffect } from "react";
import Phaser from "phaser";
import { Stage1Scene } from "../classes/scenes/Stage1Scene";
import { AnimationDemoScene } from "../classes/scenes/AnimationDemoScene";

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
      scene: [
        Stage1Scene,
        AnimationDemoScene
      ],
    };

    window.game = new Phaser.Game(config);

    return () => {
      window.game.destroy(true);
    };
  }, []);


  return(
    <div id="stage-1">
      <button
          type="button"
          className="px-10 py-2 nes-btn"
          onClick={() => {
            if (window.game.scene.isActive("Stage1Scene")) {
              window.game.scene.stop("Stage1Scene");
              window.game.scene.run("AnimationDemoScene");
            } else {
              window.game.scene.stop("AnimationDemoScene");
              window.game.scene.run("Stage1Scene");
            }
          }}
        >
          Change scene
        </button>
    </div>
  );
};

export default Stage1;
