const { Video } = require('../source/video');

const PIXI = require('pixi.js');

export class FocusBox extends PIXI.Container {
    constructor(WBS) {
        super();

        this._WBS = WBS;

        this._resizeing = null;

        this._mouseOvering = null;

        this._focusBox = {
            border: new PIXI.Graphics(),
            topLeft: new PIXI.Graphics(),
            topMiddle: new PIXI.Graphics(),
            topRight: new PIXI.Graphics(),
            middleLeft: new PIXI.Graphics(),
            middleRight: new PIXI.Graphics(),
            bottomLeft: new PIXI.Graphics(),
            bottomMiddle: new PIXI.Graphics(),
            bottomRight: new PIXI.Graphics(),
        };

        for (const [key, value] of Object.entries(this._focusBox)) { this.addChild(value); }

        this._setMouseEventListener();
    }

    _setMouseEventListener() {
        this._setOnMouseDownEventListener();
        this._setOnMouseMoveEventListener();
        this._setOnMouseUpEventListener();
        this._setOnMouseOverEventListener();
        this._setOnMouseOutEventListener();
    }

    _setOnMouseDownEventListener() {
        const mouseDownMap = {
            topLeft: this._topLeftOnMouseDown.bind(this),
            topMiddle: this._topMiddleOnMouseDown.bind(this),
            topRight: this._topRightOnMouseDown.bind(this),
            middleLeft: this._middleLeftOnMouseDown.bind(this),
            middleRight: this._middleRightOnMouseDown.bind(this),
            bottomLeft: this._bottomLeftOnMouseDown.bind(this),
            bottomMiddle: this._bottomMiddleOnMouseDown.bind(this),
            bottomRight: this._bottomRightOnMouseDown.bind(this),
        };

        self.addEventListener("onmousedown", (e) => {
            const posX = e.detail.position.x;
            const posY = e.detail.position.y;

            for (const key in this._focusBox) {
                if (key === 'border') continue;

                const xLeft = this._focusBox[key].getBounds().x;
                const xRight = this._focusBox[key].getBounds().x + this._focusBox[key].getBounds().width;
                const yTop = this._focusBox[key].getBounds().y;
                const yBottom = this._focusBox[key].getBounds().y + this._focusBox[key].getBounds().height;

                const isInX = xLeft <= posX && xRight >= posX;
                const isInY = yTop <= posY && yBottom >= posY;
                const isInside = isInX && isInY;

                if (isInside) mouseDownMap[key](posX, posY);
            }
        });
    }

    _setOnMouseMoveEventListener() {
        const mouseMoveMap = {
            topLeft: this._topLeftOnMouseMove.bind(this),
            topMiddle: this._topMiddleOnMouseMove.bind(this),
            topRight: this._topRightOnMouseMove.bind(this),
            middleLeft: this._middleLeftOnMouseMove.bind(this),
            middleRight: this._middleRightOnMouseMove.bind(this),
            bottomLeft: this._bottomLeftOnMouseMove.bind(this),
            bottomMiddle: this._bottomMiddleOnMouseMove.bind(this),
            bottomRight: this._bottomRightOnMouseMove.bind(this),
        };

        self.addEventListener("onmousemove", (e) => {
            const posX = e.detail.position.x;
            const posY = e.detail.position.y;

            if (this._resizeing !== null) mouseMoveMap[this._resizeing](posX, posY);
        });
    }

    _setOnMouseUpEventListener() {
        self.addEventListener("onmouseup", (e) => {
            this._resizeing = null;
        });
    }

    _setOnMouseOverEventListener() {
        const mouseOverMap = {
            topLeft: this._topLeftOnMouseOver.bind(this),
            topMiddle: this._topMiddleOnMouseOver.bind(this),
            topRight: this._topRightOnMouseOver.bind(this),
            middleLeft: this._middleLeftOnMouseOver.bind(this),
            middleRight: this._middleRightOnMouseOver.bind(this),
            bottomLeft: this._bottomLeftOnMouseOver.bind(this),
            bottomMiddle: this._bottomMiddleOnMouseOver.bind(this),
            bottomRight: this._bottomRightOnMouseOver.bind(this),
        };

        self.addEventListener("onmousemove", (e) => {
            const posX = e.detail.position.x;
            const posY = e.detail.position.y;

            for (const key in this._focusBox) {
                if (key === 'border') continue;

                const xLeft = this._focusBox[key].getBounds().x;
                const xRight = this._focusBox[key].getBounds().x + this._focusBox[key].getBounds().width;
                const yTop = this._focusBox[key].getBounds().y;
                const yBottom = this._focusBox[key].getBounds().y + this._focusBox[key].getBounds().height;

                const isInX = xLeft <= posX && xRight >= posX;
                const isInY = yTop <= posY && yBottom >= posY;
                const isInside = isInX && isInY;

                if (isInside) mouseOverMap[key]();
            }
        });
    }

    _setOnMouseOutEventListener() {
        const mouseOutMap = {
            topLeft: this._topLeftOnMouseOut.bind(this),
            topMiddle: this._topMiddleOnMouseOut.bind(this),
            topRight: this._topRightOnMouseOut.bind(this),
            middleLeft: this._middleLeftOnMouseOut.bind(this),
            middleRight: this._middleRightOnMouseOut.bind(this),
            bottomLeft: this._bottomLeftOnMouseOut.bind(this),
            bottomMiddle: this._bottomMiddleOnMouseOut.bind(this),
            bottomRight: this._bottomRightOnMouseOut.bind(this),
        };

        self.addEventListener("onmousemove", (e) => {
            const posX = e.detail.position.x;
            const posY = e.detail.position.y;

            if (this._mouseOvering !== null) {
                const xLeft = this._focusBox[this._mouseOvering].getBounds().x;
                const xRight = this._focusBox[this._mouseOvering].getBounds().x + this._focusBox[this._mouseOvering].getBounds().width;
                const yTop = this._focusBox[this._mouseOvering].getBounds().y;
                const yBottom = this._focusBox[this._mouseOvering].getBounds().y + this._focusBox[this._mouseOvering].getBounds().height;

                const isOutX = xLeft > posX || xRight < posX;
                const isOutY = yTop > posY || yBottom < posY;
                const isOutside = isOutX || isOutY;

                if (isOutside) mouseOutMap[this._mouseOvering]();
            }
        });
    }

    _topLeftOnMouseDown(posX, posY) {
        this._focusedTarget.setDragging(false);
        this._resizeing = 'topLeft';
        this._focusBox["border"].prevInteractX = posX;
        this._focusBox["border"].prevInteractY = posY;
        this._focusBox["border"].originWidth = this._focusBox["border"].width;
        this._focusBox["border"].originHeight = this._focusBox["border"].height;
    }

    _topLeftOnMouseMove(posX, posY) {
        if (posX < 0 || posX > this._WBS.appWidth) return;
        if (posY > this._WBS.appHeight || posY < 0) return;
        if (this._resizeing === 'topLeft') {
            const rightX = this._focusBox["border"].prevInteractX + this._focusBox["border"].originWidth;
            const bottomY = this._focusBox["border"].prevInteractY + this._focusBox["border"].originHeight;

            const isCurrXTooOver = posX > rightX;
            const isCurrYTooOver = posY > bottomY;

            const deltaX = this._focusBox["border"].prevInteractX - posX;
            const deltaY = this._focusBox["border"].prevInteractY - posY;

            const width = this._focusBox["border"].originWidth;
            const height = this._focusBox["border"].originHeight;

            if (isCurrXTooOver && isCurrYTooOver) {
                this.drawFocusBox(rightX, bottomY, 1, 1);

                const resizeX = rightX;
                const resizeY = bottomY;

                this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
                return;
            }

            if (isCurrXTooOver) {
                this.drawFocusBox(rightX, posY, 1, height + deltaY);

                const resizeX = rightX;
                const resizeY = posY + this._focusBox["border"].height / 2;

                this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
            } else if (isCurrYTooOver) {
                this.drawFocusBox(posX, bottomY, width + deltaX, 1);

                const resizeX = posX + this._focusBox["border"].width / 2;
                const resizeY = bottomY;

                this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
            } else {
                this.drawFocusBox(posX, posY, width + deltaX, height + deltaY);

                const resizeX = posX + this._focusBox["border"].width / 2;
                const resizeY = posY + this._focusBox["border"].height / 2;

                this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
            }
        }
    }

    _topLeftOnMouseOver() {
        this._mouseOvering = 'topLeft';
        this._WBS.setCursor("nwse-resize");
    }

    _topLeftOnMouseOut() {
        this._mouseOvering = null;
        this._WBS.setCursor("auto");
    }

    _topMiddleOnMouseDown(posX, posY) {
        this._focusedTarget.setDragging(false);
        this._resizeing = 'topMiddle';
        this._focusBox["border"].prevInteractY = posY;
        this._focusBox["border"].originX = posX - this._focusBox["border"].width / 2;
        this._focusBox["border"].originWidth = this._focusBox["border"].width;
        this._focusBox["border"].originHeight = this._focusBox["border"].height;
    }

    _topMiddleOnMouseMove(posX, posY) {
        if (posY > this._WBS.appHeight || posY < 0) return;
        if (this._resizeing === 'topMiddle') {
            const bottomY = this._focusBox["border"].prevInteractY + this._focusBox["border"].originHeight;

            const isCurrYTooOver = posY > bottomY;

            const deltaY = this._focusBox["border"].prevInteractY - posY;

            const width = this._focusBox["border"].originWidth;
            const height = this._focusBox["border"].originHeight;

            if (isCurrYTooOver) {
                this.drawFocusBox(this._focusBox["border"].originX, bottomY, width, 1);

                const resizeX = this._focusBox["border"].originX + this._focusBox["border"].width / 2;
                const resizeY = bottomY;

                this._focusedTarget.resize(resizeX, resizeY, width, this._focusBox["border"].height);
                return;
            }

            this.drawFocusBox(this._focusBox["border"].originX, posY, width, height + deltaY);

            const resizeX = this._focusBox["border"].originX + this._focusBox["border"].width / 2;
            const resizeY = posY + this._focusBox["border"].height / 2;

            this._focusedTarget.resize(resizeX, resizeY, width, this._focusBox["border"].height);
        }
    }

    _topMiddleOnMouseOver() {
        this._mouseOvering = 'topMiddle';
        this._WBS.setCursor("ns-resize");
    }

    _topMiddleOnMouseOut() {
        this._mouseOvering = null;
        this._WBS.setCursor("auto");
    }

    _topRightOnMouseDown(posX, posY) {
        this._focusedTarget.setDragging(false);
        this._resizeing = 'topRight';
        this._focusBox["border"].prevInteractX = posX;
        this._focusBox["border"].prevInteractY = posY;
        this._focusBox["border"].originX = posX - this._focusBox["border"].width;
        this._focusBox["border"].originWidth = this._focusBox["border"].width;
        this._focusBox["border"].originHeight = this._focusBox["border"].height;
    }

    _topRightOnMouseMove(posX, posY) {
        if (posX < 0 || posX > this._WBS.appWidth) return;
        if (posY > this._WBS.appHeight || posY < 0) return;
        if (this._resizeing === 'topRight') {
            const leftX = this._focusBox["border"].originX;
            const bottomY = this._focusBox["border"].prevInteractY + this._focusBox["border"].originHeight;

            const isCurrXTooOver = posX < leftX;
            const isCurrYTooOver = posY > bottomY;

            const deltaX = posX - this._focusBox["border"].prevInteractX;
            const deltaY = this._focusBox["border"].prevInteractY - posY;

            const width = this._focusBox["border"].originWidth;
            const height = this._focusBox["border"].originHeight;

            if (isCurrXTooOver && isCurrYTooOver) {
                this.drawFocusBox(leftX, bottomY, 1, 1);

                const resizeX = leftX;
                const resizeY = bottomY;

                this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
                return;
            }

            if (isCurrXTooOver) {
                this.drawFocusBox(leftX, posY, 1, height + deltaY);

                const resizeX = leftX;
                const resizeY = posY + this._focusBox["border"].height / 2;

                this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
            } else if (isCurrYTooOver) {
                this.drawFocusBox(this._focusBox["border"].originX, bottomY, width + deltaX, 1);

                const resizeX = posX - this._focusBox["border"].width / 2;
                const resizeY = bottomY;

                this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
            } else {
                this.drawFocusBox(this._focusBox["border"].originX, posY, width + deltaX, height + deltaY);

                const resizeX = posX - this._focusBox["border"].width / 2;
                const resizeY = posY + this._focusBox["border"].height / 2;

                this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
            }
        }
    }

    _topRightOnMouseOver() {
        this._mouseOvering = 'topRight';
        this._WBS.setCursor("ne-resize");
    }

    _topRightOnMouseOut() {
        this._mouseOvering = null;
        this._WBS.setCursor("auto");
    }

    _middleLeftOnMouseDown(posX, posY) {
        this._focusedTarget.setDragging(false);
        this._resizeing = 'middleLeft';
        this._focusBox["border"].prevInteractX = posX;
        this._focusBox["border"].originY = posY - this._focusBox["border"].height / 2;
        this._focusBox["border"].originWidth = this._focusBox["border"].width;
        this._focusBox["border"].originHeight = this._focusBox["border"].height;
    }

    _middleLeftOnMouseMove(posX, posY) {
        if (posX < 0 || posX > this._WBS.appWidth) return;
        if (this._resizeing === 'middleLeft') {
            const rightX = this._focusBox["border"].prevInteractX + this._focusBox["border"].originWidth;

            const isCurrXTooOver = posX > rightX;

            const deltaX = this._focusBox["border"].prevInteractX - posX;

            const width = this._focusBox["border"].originWidth;
            const height = this._focusBox["border"].originHeight;

            if (isCurrXTooOver) {
                this.drawFocusBox(rightX, this._focusBox["border"].originY, 1, height);

                const resizeX = rightX;
                const resizeY = this._focusBox["border"].originY + this._focusBox["border"].height / 2;

                this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
                return;
            }

            this.drawFocusBox(posX, this._focusBox["border"].originY, width + deltaX, height);

            const resizeX = posX + this._focusBox["border"].width / 2;
            const resizeY = this._focusBox["border"].originY + this._focusBox["border"].height / 2;

            this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
        }
    }

    _middleLeftOnMouseOver() {
        this._mouseOvering = 'middleLeft';
        this._WBS.setCursor("w-resize");
    }

    _middleLeftOnMouseOut() {
        this._mouseOvering = null;
        this._WBS.setCursor("auto");
    }

    _middleRightOnMouseDown(posX, posY) {
        this._focusedTarget.setDragging(false);
        this._resizeing = 'middleRight';
        this._focusBox["border"].prevInteractX = posX;
        this._focusBox["border"].originX = posX - this._focusBox["border"].width;
        this._focusBox["border"].originY = posY - this._focusBox["border"].height / 2;
        this._focusBox["border"].originWidth = this._focusBox["border"].width;
        this._focusBox["border"].originHeight = this._focusBox["border"].height;
    }

    _middleRightOnMouseMove(posX, posY) {
        if (posX < 0 || posX > this._WBS.appWidth) return;
        if (this._resizeing === 'middleRight') {
            const leftX = this._focusBox["border"].originX;

            const isCurrXTooOver = posX < leftX;

            const deltaX = posX - this._focusBox["border"].prevInteractX;

            const width = this._focusBox["border"].originWidth;
            const height = this._focusBox["border"].originHeight;

            if (isCurrXTooOver) {
                this.drawFocusBox(leftX, this._focusBox["border"].originY, 1, height);

                const resizeX = leftX;
                const resizeY = this._focusBox["border"].originY + this._focusBox["border"].height / 2;

                this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
                return;
            }

            this.drawFocusBox(this._focusBox["border"].originX, this._focusBox["border"].originY, width + deltaX, height);

            const resizeX = posX - this._focusBox["border"].width / 2;
            const resizeY = this._focusBox["border"].originY + this._focusBox["border"].height / 2;

            this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
        }
    }

    _middleRightOnMouseOver() {
        this._mouseOvering = 'middleRight';
        this._WBS.setCursor("e-resize");
    }

    _middleRightOnMouseOut() {
        this._mouseOvering = null;
        this._WBS.setCursor("auto");
    }

    _bottomLeftOnMouseDown(posX, posY) {
        this._focusedTarget.setDragging(false);
        this._resizeing = 'bottomLeft';
        this._focusBox["border"].prevInteractX = posX;
        this._focusBox["border"].prevInteractY = posY;
        this._focusBox["border"].originWidth = this._focusBox["border"].width;
        this._focusBox["border"].originHeight = this._focusBox["border"].height;
    }

    _bottomLeftOnMouseMove(posX, posY) {
        if (posX < 0 || posX > this._WBS.appWidth) return;
        if (posY > this._WBS.appHeight || posY < 0) return;
        if (this._resizeing === 'bottomLeft') {
            const rightX = this._focusBox["border"].prevInteractX + this._focusBox["border"].originWidth;
            const topY = this._focusBox["border"].prevInteractY - this._focusBox["border"].originHeight;

            const isCurrXTooOver = posX > rightX;
            const isCurrYTooOver = posY < topY;

            const deltaX = this._focusBox["border"].prevInteractX - posX;
            const deltaY = posY - this._focusBox["border"].prevInteractY;

            const width = this._focusBox["border"].originWidth;
            const height = this._focusBox["border"].originHeight;

            if (isCurrXTooOver && isCurrYTooOver) {
                this.drawFocusBox(rightX, topY, 1, 1);

                const resizeX = rightX;
                const resizeY = topY;

                this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
                return;
            }

            if (isCurrXTooOver) {
                this.drawFocusBox(rightX, posY - this._focusBox["border"].height, 1, height + deltaY);

                const resizeX = rightX;
                const resizeY = posY - this._focusBox["border"].height / 2;

                this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
            } else if (isCurrYTooOver) {
                this.drawFocusBox(posX, topY, width + deltaX, 1);

                const resizeX = posX + this._focusBox["border"].width / 2;
                const resizeY = topY;

                this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
            } else {
                this.drawFocusBox(posX, posY - this._focusBox["border"].height, width + deltaX, height + deltaY);

                const resizeX = posX + this._focusBox["border"].width / 2;
                const resizeY = posY - this._focusBox["border"].height / 2;

                this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
            }
        }
    }

    _bottomLeftOnMouseOver() {
        this._mouseOvering = 'bottomLeft';
        this._WBS.setCursor("ne-resize");
    }

    _bottomLeftOnMouseOut() {
        this._mouseOvering = null;
        this._WBS.setCursor("auto");
    }

    _bottomMiddleOnMouseDown(posX, posY) {
        this._focusedTarget.setDragging(false);
        this._resizeing = 'bottomMiddle';
        this._focusBox["border"].prevInteractY = posY;
        this._focusBox["border"].originX = posX - this._focusBox["border"].width / 2;
        this._focusBox["border"].originWidth = this._focusBox["border"].width;
        this._focusBox["border"].originHeight = this._focusBox["border"].height;
    }

    _bottomMiddleOnMouseMove(posX, posY) {
        if (posY > this._WBS.appHeight || posY < 0) return;
        if (this._resizeing === 'bottomMiddle') {
            const topY = this._focusBox["border"].prevInteractY - this._focusBox["border"].originHeight;

            const isCurrYTooOver = posY < topY;

            const deltaY = posY - this._focusBox["border"].prevInteractY;

            const width = this._focusBox["border"].originWidth;
            const height = this._focusBox["border"].originHeight;

            if (isCurrYTooOver) {
                this.drawFocusBox(this._focusBox["border"].originX, topY, width, 1);

                const resizeX = this._focusBox["border"].originX + this._focusBox["border"].width / 2;
                const resizeY = topY;

                this._focusedTarget.resize(resizeX, resizeY, width, this._focusBox["border"].height);
                return;
            }

            this.drawFocusBox(this._focusBox["border"].originX, posY - this._focusBox["border"].height, width, height + deltaY);

            const resizeX = this._focusBox["border"].originX + this._focusBox["border"].width / 2;
            const resizeY = posY - this._focusBox["border"].height / 2;

            this._focusedTarget.resize(resizeX, resizeY, width, this._focusBox["border"].height);
        }
    }

    _bottomMiddleOnMouseOver() {
        this._mouseOvering = 'bottomMiddle';
        this._WBS.setCursor("s-resize");
    }

    _bottomMiddleOnMouseOut() {
        this._mouseOvering = null;
        this._WBS.setCursor("auto");
    }

    _bottomRightOnMouseDown(posX, posY) {
        this._focusedTarget.setDragging(false);
        this._resizeing = 'bottomRight';
        this._focusBox["border"].prevInteractX = posX;
        this._focusBox["border"].prevInteractY = posY;
        this._focusBox["border"].originX = posX - this._focusBox["border"].width;
        this._focusBox["border"].originWidth = this._focusBox["border"].width;
        this._focusBox["border"].originHeight = this._focusBox["border"].height;
    }

    _bottomRightOnMouseMove(posX, posY) {
        if (posX < 0 || posX > this._WBS.appWidth) return;
        if (posY > this._WBS.appHeight || posY < 0) return;
        if (this._resizeing === 'bottomRight') {
            const leftX = this._focusBox["border"].originX;
            const topY = this._focusBox["border"].prevInteractY - this._focusBox["border"].originHeight;

            const isCurrXTooOver = posX < leftX;
            const isCurrYTooOver = posY < topY;

            const deltaX = posX - this._focusBox["border"].prevInteractX;
            const deltaY = posY - this._focusBox["border"].prevInteractY;

            const width = this._focusBox["border"].originWidth;
            const height = this._focusBox["border"].originHeight;

            if (isCurrXTooOver && isCurrYTooOver) {
                this.drawFocusBox(leftX, topY, 1, 1);

                const resizeX = leftX;
                const resizeY = topY;

                this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
                return;
            }

            if (isCurrXTooOver) {
                this.drawFocusBox(leftX, posY - this._focusBox["border"].height, 1, height + deltaY);

                const resizeX = leftX;
                const resizeY = posY - this._focusBox["border"].height / 2;

                this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
            } else if (isCurrYTooOver) {
                this.drawFocusBox(this._focusBox["border"].originX, topY, width + deltaX, 1);

                const resizeX = posX - this._focusBox["border"].width / 2;
                const resizeY = topY;

                this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
            } else {
                this.drawFocusBox(this._focusBox["border"].originX, posY - this._focusBox["border"].height, width + deltaX, height + deltaY);

                const resizeX = posX - this._focusBox["border"].width / 2;
                const resizeY = posY - this._focusBox["border"].height / 2;

                this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
            }
        }
    }

    _bottomRightOnMouseOver() {
        this._mouseOvering = 'bottomRight';
        this._WBS.setCursor("se-resize");
    }

    _bottomRightOnMouseOut() {
        this._mouseOvering = null;
        this._WBS.setCursor("auto");
    }

    getFocusBox() {
        return this._focusBox;
    }

    setFocusedTarget(focusedTarget) {
        this._focusedTarget = focusedTarget;
        if (this._focusedTarget instanceof Video) this._onFocusTargetUpdate();
    }

    _onFocusTargetUpdate() {
        let preWidth = this._focusedTarget.getChildByName('sprite').width;
        let preHeight = this._focusedTarget.getChildByName('sprite').height;

        this._focusedTarget.getChildByName('sprite').texture.on("update", () => {
            if (this._resizeing !== null || !this._focusedTarget.getFocusState() || this._focusedTarget.getDraggingState()) return;

            const width = this._focusedTarget.getChildByName('sprite').width;
            const height = this._focusedTarget.getChildByName('sprite').height;
            const x = this._focusedTarget.getChildByName('sprite').x - width / 2;
            const y = this._focusedTarget.getChildByName('sprite').y - height / 2;

            if (width !== preWidth || height !== preHeight) this.drawFocusBox(x, y, width, height);

            preWidth = this._focusedTarget.getChildByName('sprite').width;
            preHeight = this._focusedTarget.getChildByName('sprite').height;
        }, this);
    }

    drawFocusBox(x, y, width, height) {
        this.resetFocusBox();

        this._focusBox.border.lineStyle(4, 0xEB4034);
        this._focusBox.border.drawRect(x, y, width, height);

        const dotWidth = 15;
        const dotHeight = 15;

        const first = ["top", "middle", "bottom"];
        const last = ["Left", "Middle", "Right"];
        let firstPos = 0;
        let lastPos = 0;

        const leftMiddleRightPosX = [
            x - (dotWidth / 2),
            x + (width / 2) - (dotWidth / 2),
            x + width - (dotWidth / 2),
        ];
        const topMiddleBottomPosY = [
            y - (dotHeight / 2),
            y + (height / 2) - (dotHeight / 2),
            y + height - (dotHeight / 2),
        ];

        topMiddleBottomPosY.forEach(posY => {
            lastPos = 0;
            leftMiddleRightPosX.forEach(posX => {
                if (!(firstPos === 1 && lastPos === 1)) {
                    this._focusBox[first[firstPos] + last[lastPos]].beginFill(0xEB4034);
                    this._focusBox[first[firstPos] + last[lastPos]].drawRect(posX, posY, dotWidth, dotHeight);
                    this._focusBox[first[firstPos] + last[lastPos]].endFill();
                }
                lastPos = lastPos + 1;
            })
            firstPos = firstPos + 1;
        })
    }

    resetFocusBox() {
        for (const [key, value] of Object.entries(this._focusBox)) {
            this._focusBox[key].clear();
            this._focusBox[key].x = 0;
            this._focusBox[key].y = 0;
        }
    }

    moveFocusBox(deltaX, deltaY) {
        for (const [key, value] of Object.entries(this._focusBox)) {
            this._focusBox[key].x = this._focusBox[key].x + deltaX;
            this._focusBox[key].y = this._focusBox[key].y + deltaY;
        }
    }
}