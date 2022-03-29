import * as PIXI from 'pixi.js'

export default class Image extends PIXI.Container {
    constructor(WBS, texture) {
        super();
        this._WBS = WBS;
        this._sprite = PIXI.Sprite.from(texture);
        this._box = new PIXI.Graphics();

        this._initSprite();
        this._setSpriteInteraction();
        this._setBackgroundInteraction();

        this.addChild(this._sprite);
        this.addChild(this._box);
    }

    _initSprite() {
        this._sprite.anchor.set(0.5);
        this._sprite.x = this._WBS.appWidth / 2;
        this._sprite.y = this._WBS.appHeight / 2;
        this._sprite.focused = false;
    }

    _setSpriteInteraction() {
        this._sprite.interactive = true;
        this._sprite.on("mousedown", this._onMouseDown, this);
        this._sprite.on("mousemove", this._onMouseMove, this);
        this._sprite.on("mouseup", this._onMouseUp, this);
        this._sprite.on("mouseover", this._onMouseOver, this);
        this._sprite.on("mouseout", this._onMouseOut, this);
    }

    _onMouseDown(event) {
        this._showRedBox();

        this._WBS.setCursor("move");

        this._sprite.focused = true;
        this._sprite.dragging = true;

        this._sprite.prevInteractX = event.data.global.x;
        this._sprite.prevInteractY = event.data.global.y;
    }

    _showRedBox() {
        if (!this._sprite.focused) {
            this._drawRedBox(4, 0xEB4034);
        }
    }

    _drawRedBox() {
        this._box.lineStyle(4, 0xEB4034);
        this._box.drawShape(this._sprite.getBounds());
    }

    _onMouseMove(event) {
        if (this._sprite.dragging) {
            let deltaX = event.data.global.x - this._sprite.prevInteractX;
            let deltaY = event.data.global.y - this._sprite.prevInteractY;

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
        this._box.x = this._box.x + deltaX;
        this._box.y = this._box.y + deltaY;
    }

    _onMouseUp(event) {
        this._sprite.dragging = false;

        this._WBS.setCursor("auto");
    }

    _onMouseOver(event) {
        if (!this._sprite.focused) {
            this._drawBlueBox();
        }
    }

    _drawBlueBox() {
        this._box.lineStyle(4, 0x00AEB9);
        this._box.drawShape(this._sprite.getBounds());
    }

    _onMouseOut(event) {
        if (!this._sprite.focused) {
            this._box.clear();
        }
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
        let isBiggerThanLeft = (x >= this._sprite.x - (this._sprite.width / 2));
        let isSmallerThanRight = (x <= this._sprite.x + (this._sprite.width / 2));
        let isInsideSpriteX = (isBiggerThanLeft && isSmallerThanRight);

        let isBiggerThanTop = (y >= this._sprite.y - (this._sprite.height / 2));
        let isSmallerThanBottom = (y <= this._sprite.y + (this._sprite.height / 2));
        let isInsideSpriteY = (isBiggerThanTop && isSmallerThanBottom);

        return (isInsideSpriteX && isInsideSpriteY);
    }

    _resetBox() {
        this._box.clear();
        this._box.x = 0;
        this._box.y = 0;
    }
}