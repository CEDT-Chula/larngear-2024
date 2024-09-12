import { DemoGoblin, DemoGoblinSprites } from "../enemies/demo_goblin/demo_goblin";
import { AssetLoader } from "../util/AssetLoader";
import { Button } from "../ui/Button";
import { MakeDraggable, ShowSpriteBounds } from "../util/DebugTools";

export class AnimationDemoScene extends Phaser.Scene {
    constructor() {
        super({ key: 'AnimationDemoScene' });

    }

    preload() {
        const assetLoader = new AssetLoader(this);

        assetLoader.preloadActor(DemoGoblinSprites);
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');

        this.goblin = new DemoGoblin(this, 500, 700, "demo_goblin_idle", 0);

        // Create buttons
        this.add.existing(new Button(this, 100, 100, 'Change to run', null, {
            pointerdown: () => {
                this.goblin.play('goblin-run', true);
            }
        }));
        this.add.existing(new Button(this, 100, 150, 'Change to idle', null, {
            pointerdown: () => {
                this.goblin.play('goblin-idle', true);
            }
        }));
        this.add.existing(new Button(this, 100, 200, 'Change to died', null, {
            pointerdown: () => {
                this.goblin.play('goblin-died', true);
            }
        }));

        this.graphics = this.add.graphics();
        MakeDraggable(this, this.goblin,
            () => {
                this.goblin.play('goblin-run', true);
            },
            () => {
                this.goblin.play('goblin-idle', true);
            }
        );
        ShowSpriteBounds(this, this.goblin);

        this.cursors = this.input.keyboard.createCursorKeys();
    }
}