import * as PIXI from 'pixi.js'

export default class FocusBox {
    constructor(WBS) {
        this._WBS = WBS;
        this._resizeing = false;
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

        this._setScaleInteraction();
    }

    _setScaleInteraction() {
        this._focusBox['topLeft'].interactive = true;
        this._focusBox['topLeft'].on("mousedown", this._topLeftOnMouseDown, this);
        this._focusBox['topLeft'].on("mousemove", this._topLeftOnMouseMove, this);
        this._focusBox['topLeft'].on("mouseup", this._topLeftOnMouseUp, this);
        this._focusBox['topLeft'].on("mouseover", this._topLeftOnMouseOver, this);
        this._focusBox['topLeft'].on("mouseout", this._topLeftOnMouseOut, this);
    }

    _topLeftOnMouseDown(event) {
        this._resizeing = true;

        this._focusBox["border"].prevInteractX = event.data.global.x;
        this._focusBox["border"].prevInteractY = event.data.global.y;
    }

    _topLeftOnMouseMove(event) {
        if (this._resizeing) {
            const deltaX = event.data.global.x - this._sprite.prevInteractX;
            const deltaY = event.data.global.y - this._sprite.prevInteractY;
            
            this._focusBox["border"].x = event.data.global.x;
            this._focusBox["border"].y = event.data.global.y;
        }
    }

    _topLeftOnMouseUp(event) {
        this._resizeing = false;
    }

    _topLeftOnMouseOver(event) {
        this._WBS.setCursor("nwse-resize");
    }

    _topLeftOnMouseOut(event) {
        this._WBS.setCursor("auto");
    }

    getFocusBox() {
        return this._focusBox;
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

    moveFocusBox(deltaX, deltaY) {
        for (const [key, value] of Object.entries(this._focusBox)) {
            this._focusBox[key].x = this._focusBox[key].x + deltaX;
            this._focusBox[key].y = this._focusBox[key].y + deltaY;
        }
    }

    resetFocusBox() {
        for (const [key, value] of Object.entries(this._focusBox)) {
            this._focusBox[key].clear();
            this._focusBox[key].x = 0;
            this._focusBox[key].y = 0;
        }
    }
}