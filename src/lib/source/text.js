import * as PIXI from 'pixi.js'

export default class Text extends PIXI.Container {
    constructor(WBS, sourceWrapper, text, style) {
        super();

        this._dragging = false;

        this._focused = false;

        this._WBS = WBS;

        this._sourceWrapper = sourceWrapper;

        this._sprite = new PIXI.Text(text, style);
        this._sprite.name = 'sprite';

        this._blueBox = new PIXI.Graphics();

        this._resizeCounter = 0;

        this._initSprite();

        this._setSpriteInteraction();

        this._setBackgroundInteraction();

        this._setGlobalInteraction();

        this._addToContainer();
    }

    _initSprite() {
        this._sprite.anchor.set(0.5);
        this._sprite.x = this._WBS.appWidth / 2;
        this._sprite.y = this._WBS.appHeight / 2;
        this._focused = false;
    }

    _setSpriteInteraction() {
        this.setInteractiveState(true);
        this._sprite.on("mousedown", this._spriteOnMouseDown, this);
        this._sprite.on("mousemove", this._spriteOnMouseMove, this);
        this._sprite.on("mouseup", this._spriteOnMouseUp, this);
        this._sprite.on("mouseover", this._spriteOnMouseOver, this);
        this._sprite.on("mouseout", this._spriteOnMouseOut, this);
    }

    _spriteOnMouseDown(event) {
        this._blueBox.clear();
        this._sourceWrapper.focusBox.setFocusedTarget(this);
        this._showFocusBox();

        this._WBS.setCursor("move");

        this._focused = true;
        this._dragging = true;

        this._sourceWrapper.unfocusedWithout(this, false);
        this._sourceWrapper.disableInteractiveWithout(this, false);

        this._sprite.prevInteractX = event.data.global.x;
        this._sprite.prevInteractY = event.data.global.y;
    }

    setDragging(state) {
        this._dragging = state;
    }

    _showFocusBox() {
        if (!this._focused) {
            let width = this._sprite.width;
            let height = this._sprite.height;
            let bounds = this._sprite.getBounds();
            this._sourceWrapper.focusBox.drawFocusBox(bounds.x, bounds.y, width, height);
        }
    }

    _spriteOnMouseMove(event) {
        if (this._dragging) {
            const deltaX = event.data.global.x - this._sprite.prevInteractX;
            const deltaY = event.data.global.y - this._sprite.prevInteractY;

            this._moveSprite(deltaX, deltaY);
            this._sourceWrapper.focusBox.moveFocusBox(deltaX, deltaY);

            this._sprite.prevInteractX = event.data.global.x;
            this._sprite.prevInteractY = event.data.global.y;
        }
    }

    _moveSprite(deltaX, deltaY) {
        this._sprite.x = this._sprite.x + deltaX;
        this._sprite.y = this._sprite.y + deltaY;
    }

    _spriteOnMouseUp(event) {
        this._dragging = false;

        this._sourceWrapper.disableInteractiveWithout(this, true);

        this._WBS.setCursor("auto");
    }

    _spriteOnMouseOver(event) {
        if (!this._focused) {
            this._drawBlueBox();
        }
    }

    _drawBlueBox() {
        this._blueBox.lineStyle(4, 0x00AEB9);
        this._blueBox.drawShape(this._sprite.getBounds());
    }

    _spriteOnMouseOut(event) {
        if (!this._focused) {
            this._blueBox.clear();
        }
    }

    _setBackgroundInteraction() {
        this._WBS.background.on('click', (event) => {
            if (!this._isClickInsideSprite(event.data.global.x, event.data.global.y)) {
                this._focused = false;
                this._sourceWrapper.focusBox.resetFocusBox();
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

    _setGlobalInteraction() {
        document.body.addEventListener('mouseup', e => {
            this._dragging = null;
        });
    }

    _addToContainer() {
        this.addChild(this._sprite);
        this.addChild(this._blueBox);
    }

    setOnFoucsState(state) {
        this._focused = state;
    }

    setInteractiveState(state) {
        this._sprite.interactive = state;
    }

    getFocusState() {
        return this._focused;
    }

    getDraggingState() {
        return this._dragging;
    }

    resize(x, y, width, height) {
        this._sprite.x = x;

        this._sprite.y = y;

        this._sprite.width = width;

        this._sprite.height = height;

        this._resizeCounter++;
        if (this._resizeCounter > 100) {
            this._sprite.style.fontSize = height;
            this._resizeCounter = 0;
        }
    }

    destroy() {
        this.destroy({
            children: true,
            texture: true,
            baseTexture: true
        });
    }
}