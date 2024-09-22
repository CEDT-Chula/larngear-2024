import Phaser from 'phaser';

interface AnimationConfig {
    key: string;
    frameKey: string; // The texture key of the sprite sheet
    start: number;    // Start frame number
    end: number;      // End frame number
    frameRate: number;
    repeat?: number;
}

export class AnimationController {
    private scene: Phaser.Scene;
    private sprite: Phaser.GameObjects.Sprite;
    private currentAnimation: string | null;

    constructor(scene: Phaser.Scene, sprite: Phaser.GameObjects.Sprite) {
        this.scene = scene;
        this.sprite = sprite;
        this.currentAnimation = null;
    }

    // Add a new animation to the sprite
    addAnimation(config: AnimationConfig) {
        this.scene.anims.create({
            key: config.key,
            frames: this.scene.anims.generateFrameNumbers(config.frameKey, {
                start: config.start,
                end: config.end,
            }),
            frameRate: config.frameRate,
            repeat: config.repeat || 0
        });
    }

    // Play a specific animation
    playAnimation(key: string, ignoreIfPlaying: boolean = true) {
        if (this.currentAnimation === key) return; // Avoid playing the same animation repeatedly
        this.currentAnimation = key;
        this.sprite.anims.play(key, ignoreIfPlaying);
    }

    // Stop the current animation
    stopAnimation() {
        this.sprite.anims.stop();
        this.currentAnimation = null;
    }

    // Check if an animation is playing
    isPlaying(key: string): boolean {
        return this.sprite.anims.isPlaying && this.currentAnimation === key;
    }

    // Set an idle animation when no action is performed
    setIdleAnimation(idleKey: string) {
        if (!this.sprite.anims.isPlaying) {
            this.playAnimation(idleKey);
        }
    }

    // Destroy animation controller (cleanup)
    destroy() {
        this.stopAnimation();
        this.sprite.destroy();
    }
}

// ** Example Usage **
//     constructor() {
//         this.animationController = new AnimationController(scene, this);

//         // Add animations
//         this.animationController.addAnimation({
//             key: 'shoot',
//             frameKey: 'tower',
//             start: 0,
//             end: 5,
//             frameRate: 10,
//             repeat: -1
//         });

//         this.animationController.addAnimation({
//             key: 'idle',
//             frameKey: 'tower',
//             start: 6,
//             end: 6,
//             frameRate: 10
//         });

//         // Play idle animation initially
//         this.animationController.playAnimation('idle');
//     }

//     // Example of switching animations when shooting
//     shoot() {
//         this.animationController.playAnimation('shoot');
//     }

//     idle() {
//         this.animationController.playAnimation('idle');
//     }
// }

