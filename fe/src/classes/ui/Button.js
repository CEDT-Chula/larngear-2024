export class Button extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, style, callback) {
        super(scene, x, y, text, style);

        this.setInteractive({ useHandCursor: false })
            .on('pointerover', () => {
                this.enterButtonHoverState();
                if (callback && callback.pointerover && typeof callback.pointerover === 'function') {
                    callback.pointerover();
                }
            })
            .on('pointerout', () => {
                this.enterButtonRestState();
                if (callback && callback.pointerout && typeof callback.pointerout === 'function') {
                    callback.pointerout();
                }
            })
            .on('pointerdown', () => {
                this.enterButtonActiveState();
                if (callback && callback.pointerdown && typeof callback.pointerdown === 'function') {
                    callback.pointerdown();
                }
            })
            .on('pointerup', () => {
                this.enterButtonHoverState();
                if (callback && callback.pointerup && typeof callback.pointerup === 'function') {
                    callback.pointerup();
                }
            });
        this.setStyle({
            fill: '#0f0',
            fontSize: '24px',
            fontStyle: 'bold',
            backgroundColor: '#000000'
        });

    }

    enterButtonHoverState() {
        this.setFill('#ff0');
    }

    enterButtonRestState() {
        this.setFill('#0f0');
    }

    enterButtonActiveState() {
        this.setFill('#0ff');
    }
}