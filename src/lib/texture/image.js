import * as PIXI from 'pixi.js'

export default class Image extends PIXI.Container {
    constructor(WBS, texture) {
        super();

        this._WBS = WBS;

        this._sprite = PIXI.Sprite.from(texture);

        this._box = {
            border: new PIXI.Graphics(),
            topLeft: new PIXI.Graphics(),
            topMiddle: new PIXI.Graphics(),
            topRight: new PIXI.Graphics(),
            middleLeft: new PIXI.Graphics(),
            middleRight: new PIXI.Graphics(),
            bottomLeft: new PIXI.Graphics(),
            bottomMiddle: new PIXI.Graphics(),
            bottomRight: new PIXI.Graphics(),
        }

        this._initSprite();
        this._setSpriteInteraction();
        this._setScaleInteraction();
        this._setBackgroundInteraction();
        this._addToContainer();
    }

    _initSprite() {
        this._sprite.anchor.set(0.5);
        this._sprite.x = this._WBS.appWidth / 2;
        this._sprite.y = this._WBS.appHeight / 2;
        this._sprite.focused = false;
    }

    _setSpriteInteraction() {
        this._sprite.interactive = true;
        this._sprite.on("mousedown", this._spriteOnMouseDown, this);
        this._sprite.on("mousemove", this._spriteOnMouseMove, this);
        this._sprite.on("mouseup", this._spriteOnMouseUp, this);
        this._sprite.on("mouseover", this._spriteOnMouseOver, this);
        this._sprite.on("mouseout", this._spriteOnMouseOut, this);
    }

    _spriteOnMouseDown(event) {
        this._showRedBox();

        this._WBS.setCursor("move");

        this._sprite.focused = true;
        this._sprite.dragging = true;

        this._sprite.prevInteractX = event.data.global.x;
        this._sprite.prevInteractY = event.data.global.y;
    }

    _showRedBox() {
        if (!this._sprite.focused) {
            this._drawRedBox();
        }
    }

    _drawRedBox() {
        this._box.border.lineStyle(4, 0xEB4034);
        this._box.border.drawShape(this._sprite.getBounds());

        const boxWidth = 20;
        const boxHeight = 20;

        const first = ["top", "middle", "bottom"];
        const last = ["Left", "Middle", "Right"];
        let firstPos = 0;
        let lastPos = 0;

        const leftMiddleRightX = [
            this._sprite.getBounds().x - (boxWidth / 2),
            this._sprite.getBounds().x + (this._sprite.width / 2) - (boxWidth / 2),
            this._sprite.getBounds().x + this._sprite.width - (boxWidth / 2),
        ];
        const topMiddleBottomY = [
            this._sprite.getBounds().y - (boxHeight / 2),
            this._sprite.getBounds().y + (this._sprite.height / 2) - (boxHeight / 2),
            this._sprite.getBounds().y + this._sprite.height - (boxHeight / 2),
        ];

        topMiddleBottomY.forEach(y => {
            lastPos = 0;
            leftMiddleRightX.forEach(x => {
                if (!(firstPos === 1 && lastPos === 1)) {
                    this._box[first[firstPos] + last[lastPos]].beginFill(0xEB4034);
                    this._box[first[firstPos] + last[lastPos]].drawRect(x, y, boxWidth, boxHeight);
                    this._box[first[firstPos] + last[lastPos]].endFill();
                }
                lastPos = lastPos + 1;
            })
            firstPos = firstPos + 1;
        })
    }

    _spriteOnMouseMove(event) {
        if (this._sprite.dragging) {
            event.target.alpha = 0.5;

            const deltaX = event.data.global.x - this._sprite.prevInteractX;
            const deltaY = event.data.global.y - this._sprite.prevInteractY;

            this._moveSprite(deltaX, deltaY);
            this._moveBox(deltaX, deltaY);

            this._sprite.prevInteractX = event.data.global.x;
            this._sprite.prevInteractY = event.data.global.y;
        }
    }

    _moveSprite(deltaX, deltaY) {
        this._sprite.x = this._sprite.x + deltaX;
        this._sprite.y = this._sprite.y + deltaY;
    }

    _moveBox(deltaX, deltaY) {
        for (const [key, value] of Object.entries(this._box)) {
            this._box[key].x = this._box[key].x + deltaX;
            this._box[key].y = this._box[key].y + deltaY;
        }
    }

    _spriteOnMouseUp(event) {
        this._sprite.dragging = false;

        event.target.alpha = 1  ;

        this._WBS.setCursor("auto");
    }

    _spriteOnMouseOver(event) {
        if (!this._sprite.focused) {
            this._drawBlueBox();
        }
    }

    _drawBlueBox() {
        this._box.border.lineStyle(4, 0x00AEB9);
        this._box.border.drawShape(this._sprite.getBounds());
    }

    _spriteOnMouseOut(event) {
        if (!this._sprite.focused) {
            for (const [key, value] of Object.entries(this._box)) {
                this._box[key].clear();
            }
        }
    }

    _setScaleInteraction() {
        // this._box['topLeft'].on("mousedown", this._boxTopLeftOnMouseDown, this);
        // this._box['topLeft'].on("mousemove", this._boxTopLeftOnMouseMove, this);
        // this._box['topLeft'].on("mouseup", this._boxTopLeftOnMouseUp, this);
        // this._box['topLeft'].on("mouseover", this._boxTopLeftOnMouseOver, this);
        // this._box['topLeft'].on("mouseout", this._boxTopLeftOnMouseOut, this);
    }

    _setBackgroundInteraction() {
        this._WBS.getBackground().on('click', (event) => {
            if (!this._isClickInsideSprite(event.data.global.x, event.data.global.y)) {
                this._sprite.focused = false;

                this._resetBox();
            }
        }, this);
    }

    _isClickInsideSprite(x, y) {
        const isBiggerThanLeft = (x >= this._sprite.x - (this._sprite.width / 2));
        const isSmallerThanRight = (x <= this._sprite.x + (this._sprite.width / 2));
        const isInsideSpriteX = (isBiggerThanLeft && isSmallerThanRight);

        const isBiggerThanTop = (y >= this._sprite.y - (this._sprite.height / 2));
        const isSmallerThanBottom = (y <= this._sprite.y + (this._sprite.height / 2));
        const isInsideSpriteY = (isBiggerThanTop && isSmallerThanBottom);

        return (isInsideSpriteX && isInsideSpriteY);
    }

    _resetBox() {
        for (const [key, value] of Object.entries(this._box)) {
            this._box[key].clear();
            this._box[key].x = 0;
            this._box[key].y = 0;
        }
    }

    _addToContainer() {
        this.addChild(this._sprite);

        for (const [key, value] of Object.entries(this._box)) {
            this.addChild(value);
        }
    }
}