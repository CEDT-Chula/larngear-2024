/**
 * Debug tools
 * 
 * these two maps are used to store the graphics and text objects for each sprite
 * so we can show the bounds of the sprite and the origin marker
 */
const debugGraphics = new WeakMap();
const debugTexts = new WeakMap();

/**
 * Show the bounds of a sprite
 * 
 * @param {Phaser.Scene} scene 
 * @param {Phaser.GameObjects.Sprite} sprite 
 * @returns 
 */
export function ShowSpriteBounds(scene, sprite) {
    scene.events.on('update', () => {
        let graphics = debugGraphics.get(sprite);
        let text = debugTexts.get(sprite);

        if (!graphics) {
            graphics = scene.add.graphics();
            debugGraphics.set(sprite, graphics);
        }

        if (!text) {
            text = scene.add.text(0, 0, '', { fontSize: '16px', fill: '#ff0000', backgroundColor: '#000000', padding: { x: 5, y: 5 } });
            debugTexts.set(sprite, text);
        }

        graphics.clear();

        // Draw bounding box
        graphics.lineStyle(2, 0xff0000);
        const bounds = sprite.getBounds();
        graphics.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);

        // Draw origin marker
        graphics.fillStyle(0x00ff00, 2);
        const originX = sprite.x;
        const originY = sprite.y;
        graphics.fillRect(originX - 5, originY - 5, 10, 10);

        // Update text with coordinates
        text.setText(`x: ${Math.round(sprite.x)}, y: ${Math.round(sprite.y)}`);
        text.setPosition(originX - text.width / 2, originY - 40);
    });
}

/**
 * Make a sprite draggable
 * 
 * @param {*} scene
 * @param {*} sprite 
 * @param {*} ondragstart 
 * @param {*} ondragend 
 */
export function MakeDraggable(scene, sprite, ondragstart, ondragend) {
    sprite.setInteractive();
    scene.input.setDraggable(sprite);
    let lastX = sprite.x;


    sprite.on('dragstart', function (pointer) {
        // this.setTint(0xff0000);  // Optional: change color when dragging starts
        ondragstart && ondragstart();
    });

    sprite.on('drag', function (pointer, dragX, dragY) {
        // Determine direction of drag
        if (dragX < lastX) {
            // Dragging left, flip sprite
            this.setFlipX(true);
        } else if (dragX > lastX) {
            // Dragging right, un-flip sprite
            this.setFlipX(false);
        }

        // Update position
        this.x = dragX;
        this.y = dragY;

        // Update lastX for next drag event
        lastX = dragX;
    });

    sprite.on('dragend', function (pointer) {
        // this.clearTint();  // Optional: clear color change when dragging ends
        ondragend && ondragend();
    });
}