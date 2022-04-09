import * as PIXI from 'pixi.js'

export default class FocusBox {
    constructor(WBS, focused_target) {
        this._WBS = WBS;
        this._focused_target = focused_target;
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

        this._setTopLeftScaleInteraction();
        this._setTopMiddleScaleInteraction();
        this._setTopRightScaleInteraction();
        this._setMiddleLeftScaleInteraction();
        this._setMiddleRightScaleInteraction();
        this._setBottomLeftScaleInteraction();
        this._setBottomMiddleScaleInteraction();
        this._setBottomRightScaleInteraction();
        this._setGlobalInteraction();
    }

    _setTopLeftScaleInteraction() {
        this._focusBox['topLeft'].interactive = true;
        this._focusBox['topLeft'].on("mousedown", this._topLeftOnMouseDown, this);
        this._focusBox['topLeft'].on("mousemove", this._topLeftOnMouseMove, this);
        this._focusBox['topLeft'].on("mouseup", this._topLeftOnMouseUp, this);
        this._focusBox['topLeft'].on("mouseover", this._topLeftOnMouseOver, this);
        this._focusBox['topLeft'].on("mouseout", this._topLeftOnMouseOut, this);
    }

    _topLeftOnMouseDown(event) {
        this._focusedTarget.setDragging(false);
        this._resizeing = 'topLeft';
        this._focusBox["border"].prevInteractX = event.data.global.x;
        this._focusBox["border"].prevInteractY = event.data.global.y;
        this._focusBox["border"].originWidth = this._focusBox["border"].width;
        this._focusBox["border"].originHeight = this._focusBox["border"].height;
    }

    _topLeftOnMouseMove(event) {
        if (event.data.global.x > this._focusBox["border"].prevInteractX + this._focusBox["border"].originWidth) return;
        if (event.data.global.y > this._focusBox["border"].prevInteractY + this._focusBox["border"].originHeight) return;
        if (this._resizeing === 'topLeft') {
            const deltaX = this._focusBox["border"].prevInteractX - event.data.global.x;
            const deltaY = this._focusBox["border"].prevInteractY - event.data.global.y;

            const width = this._focusBox["border"].originWidth;
            const height = this._focusBox["border"].originHeight;

            this.drawFocusBox(event.data.global.x, event.data.global.y, width + deltaX, height + deltaY);

            const resizeX = event.data.global.x + this._focusBox["border"].width / 2;
            const resizeY = event.data.global.y + this._focusBox["border"].height / 2;

            this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
        }
    }

    _topLeftOnMouseUp(event) {
        this._resizeing = null;
    }

    _topLeftOnMouseOver(event) {
        this._WBS.setCursor("nwse-resize");
    }

    _topLeftOnMouseOut(event) {
        this._WBS.setCursor("auto");
    }

    _setTopMiddleScaleInteraction() {
        this._focusBox['topMiddle'].interactive = true;
        this._focusBox['topMiddle'].on("mousedown", this._topMiddleOnMouseDown, this);
        this._focusBox['topMiddle'].on("mousemove", this._topMiddleOnMouseMove, this);
        this._focusBox['topMiddle'].on("mouseup", this._topMiddleOnMouseUp, this);
        this._focusBox['topMiddle'].on("mouseover", this._topMiddleOnMouseOver, this);
        this._focusBox['topMiddle'].on("mouseout", this._topMiddleOnMouseOut, this);
    }

    _topMiddleOnMouseDown(event) {
        this._focusedTarget.setDragging(false);
        this._resizeing = 'topMiddle';
        this._focusBox["border"].prevInteractY = event.data.global.y;
        this._focusBox["border"].originX = event.data.global.x - this._focusBox["border"].width / 2;
        this._focusBox["border"].originWidth = this._focusBox["border"].width;
        this._focusBox["border"].originHeight = this._focusBox["border"].height;
    }

    _topMiddleOnMouseMove(event) {
        if (event.data.global.y > this._focusBox["border"].prevInteractY + this._focusBox["border"].originHeight) return;
        if (this._resizeing === 'topMiddle') {
            const deltaY = this._focusBox["border"].prevInteractY - event.data.global.y;

            const width = this._focusBox["border"].originWidth;
            const height = this._focusBox["border"].originHeight;
            
            this.drawFocusBox(this._focusBox["border"].originX , event.data.global.y, width, height + deltaY);

            const resizeX = this._focusBox["border"].originX + this._focusBox["border"].width / 2;
            const resizeY = event.data.global.y + this._focusBox["border"].height / 2;

            this._focusedTarget.resize(resizeX, resizeY, width, this._focusBox["border"].height);
        }
    }

    _topMiddleOnMouseUp(event) {
        this._resizeing = null;
    }

    _topMiddleOnMouseOver(event) {
        this._WBS.setCursor("ns-resize");
    }

    _topMiddleOnMouseOut(event) {
        this._WBS.setCursor("auto");
    }

    _setTopRightScaleInteraction() {
        this._focusBox['topRight'].interactive = true;
        this._focusBox['topRight'].on("mousedown", this._topRightOnMouseDown, this);
        this._focusBox['topRight'].on("mousemove", this._topRightOnMouseMove, this);
        this._focusBox['topRight'].on("mouseup", this._topRightOnMouseUp, this);
        this._focusBox['topRight'].on("mouseover", this._topRightOnMouseOver, this);
        this._focusBox['topRight'].on("mouseout", this._topRightOnMouseOut, this);
    }

    _topRightOnMouseDown(event) {
        this._focusedTarget.setDragging(false);
        this._resizeing = 'topRight';
        this._focusBox["border"].prevInteractX = event.data.global.x;
        this._focusBox["border"].prevInteractY = event.data.global.y;
        this._focusBox["border"].originX = event.data.global.x - this._focusBox["border"].width;
        this._focusBox["border"].originWidth = this._focusBox["border"].width;
        this._focusBox["border"].originHeight = this._focusBox["border"].height;
    }

    _topRightOnMouseMove(event) {
        if (event.data.global.x < this._focusBox["border"].originX) return;
        if (event.data.global.y > this._focusBox["border"].prevInteractY + this._focusBox["border"].originHeight) return;
        if (this._resizeing === 'topRight') {
            const deltaX = event.data.global.x - this._focusBox["border"].prevInteractX;
            const deltaY = this._focusBox["border"].prevInteractY - event.data.global.y;

            const width = this._focusBox["border"].originWidth;
            const height = this._focusBox["border"].originHeight;

            this.drawFocusBox(this._focusBox["border"].originX, event.data.global.y, width + deltaX, height + deltaY);

            const resizeX = event.data.global.x - this._focusBox["border"].width / 2;
            const resizeY = event.data.global.y + this._focusBox["border"].height / 2;

            this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
        }
    }

    _topRightOnMouseUp(event) {
        this._resizeing = null;
    }

    _topRightOnMouseOver(event) {
        this._WBS.setCursor("ne-resize");
    }

    _topRightOnMouseOut(event) {
        this._WBS.setCursor("auto");
    }

    _setMiddleLeftScaleInteraction() {
        this._focusBox['middleLeft'].interactive = true;
        this._focusBox['middleLeft'].on("mousedown", this._middleLeftOnMouseDown, this);
        this._focusBox['middleLeft'].on("mousemove", this._middleLeftOnMouseMove, this);
        this._focusBox['middleLeft'].on("mouseup", this._middleLeftOnMouseUp, this);
        this._focusBox['middleLeft'].on("mouseover", this._middleLeftOnMouseOver, this);
        this._focusBox['middleLeft'].on("mouseout", this._middleLeftOnMouseOut, this);
    }

    _middleLeftOnMouseDown(event) {
        this._focusedTarget.setDragging(false);
        this._resizeing = 'middleLeft';
        this._focusBox["border"].prevInteractX = event.data.global.x;
        this._focusBox["border"].originY = event.data.global.y - this._focusBox["border"].height / 2;
        this._focusBox["border"].originWidth = this._focusBox["border"].width;
        this._focusBox["border"].originHeight = this._focusBox["border"].height;
    }

    _middleLeftOnMouseMove(event) {
        if (event.data.global.x > this._focusBox["border"].prevInteractX + this._focusBox["border"].originWidth) return;
        if (this._resizeing === 'middleLeft') {
            const deltaX = this._focusBox["border"].prevInteractX - event.data.global.x;

            const width = this._focusBox["border"].originWidth;
            const height = this._focusBox["border"].originHeight;

            this.drawFocusBox(event.data.global.x, this._focusBox["border"].originY, width + deltaX, height);

            const resizeX = event.data.global.x + this._focusBox["border"].width / 2;
            const resizeY = this._focusBox["border"].originY + this._focusBox["border"].height / 2;

            this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
        }
    }

    _middleLeftOnMouseUp(event) {
        this._resizeing = null;
    }

    _middleLeftOnMouseOver(event) {
        this._WBS.setCursor("w-resize");
    }

    _middleLeftOnMouseOut(event) {
        this._WBS.setCursor("auto");
    }

    _setMiddleRightScaleInteraction() {
        this._focusBox['middleRight'].interactive = true;
        this._focusBox['middleRight'].on("mousedown", this._middleRightOnMouseDown, this);
        this._focusBox['middleRight'].on("mousemove", this._middleRightOnMouseMove, this);
        this._focusBox['middleRight'].on("mouseup", this._middleRightOnMouseUp, this);
        this._focusBox['middleRight'].on("mouseover", this._middleRightOnMouseOver, this);
        this._focusBox['middleRight'].on("mouseout", this._middleRightOnMouseOut, this);
    }

    _middleRightOnMouseDown(event) {
        this._focusedTarget.setDragging(false);
        this._resizeing = 'middleRight';
        this._focusBox["border"].prevInteractX = event.data.global.x;
        this._focusBox["border"].originX = event.data.global.x - this._focusBox["border"].width;
        this._focusBox["border"].originY = event.data.global.y - this._focusBox["border"].height / 2;
        this._focusBox["border"].originWidth = this._focusBox["border"].width;
        this._focusBox["border"].originHeight = this._focusBox["border"].height;
    }

    _middleRightOnMouseMove(event) {
        if (event.data.global.x < this._focusBox["border"].originX) return;
        if (this._resizeing === 'middleRight') {
            const deltaX = event.data.global.x - this._focusBox["border"].prevInteractX;

            const width = this._focusBox["border"].originWidth;
            const height = this._focusBox["border"].originHeight;

            this.drawFocusBox(this._focusBox["border"].originX, this._focusBox["border"].originY, width + deltaX, height);

            const resizeX = event.data.global.x - this._focusBox["border"].width / 2;
            const resizeY = this._focusBox["border"].originY + this._focusBox["border"].height / 2;

            this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
        }
    }

    _middleRightOnMouseUp(event) {
        this._resizeing = null;
    }

    _middleRightOnMouseOver(event) {
        this._WBS.setCursor("e-resize");
    }

    _middleRightOnMouseOut(event) {
        this._WBS.setCursor("auto");
    }

    _setBottomLeftScaleInteraction() {
        this._focusBox['bottomLeft'].interactive = true;
        this._focusBox['bottomLeft'].on("mousedown", this._bottomLeftOnMouseDown, this);
        this._focusBox['bottomLeft'].on("mousemove", this._bottomLeftOnMouseMove, this);
        this._focusBox['bottomLeft'].on("mouseup", this._bottomLeftOnMouseUp, this);
        this._focusBox['bottomLeft'].on("mouseover", this._bottomLeftOnMouseOver, this);
        this._focusBox['bottomLeft'].on("mouseout", this._bottomLeftOnMouseOut, this);
    }

    _bottomLeftOnMouseDown(event) {
        this._focusedTarget.setDragging(false);
        this._resizeing = 'bottomLeft';
        this._focusBox["border"].prevInteractX = event.data.global.x;
        this._focusBox["border"].prevInteractY = event.data.global.y;
        this._focusBox["border"].originWidth = this._focusBox["border"].width;
        this._focusBox["border"].originHeight = this._focusBox["border"].height;
    }

    _bottomLeftOnMouseMove(event) {
        if (event.data.global.x > this._focusBox["border"].prevInteractX + this._focusBox["border"].originWidth) return;
        if (event.data.global.y < this._focusBox["border"].prevInteractY - this._focusBox["border"].originHeight) return;
        if (this._resizeing === 'bottomLeft') {
            const deltaX = this._focusBox["border"].prevInteractX - event.data.global.x;
            const deltaY = event.data.global.y - this._focusBox["border"].prevInteractY;

            const width = this._focusBox["border"].originWidth;
            const height = this._focusBox["border"].originHeight;

            this.drawFocusBox(event.data.global.x, event.data.global.y - this._focusBox["border"].height, width + deltaX, height + deltaY);

            const resizeX = event.data.global.x + this._focusBox["border"].width / 2;
            const resizeY = event.data.global.y - this._focusBox["border"].height / 2;

            this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
        }
    }

    _bottomLeftOnMouseUp(event) {
        this._resizeing = null;
    }

    _bottomLeftOnMouseOver(event) {
        this._WBS.setCursor("ne-resize");
    }

    _bottomLeftOnMouseOut(event) {
        this._WBS.setCursor("auto");
    }

    _setBottomMiddleScaleInteraction() {
        this._focusBox['bottomMiddle'].interactive = true;
        this._focusBox['bottomMiddle'].on("mousedown", this._bottomMiddleOnMouseDown, this);
        this._focusBox['bottomMiddle'].on("mousemove", this._bottomMiddleOnMouseMove, this);
        this._focusBox['bottomMiddle'].on("mouseup", this._bottomMiddleOnMouseUp, this);
        this._focusBox['bottomMiddle'].on("mouseover", this._bottomMiddleOnMouseOver, this);
        this._focusBox['bottomMiddle'].on("mouseout", this._bottomMiddleOnMouseOut, this);
    }

    _bottomMiddleOnMouseDown(event) {
        this._focusedTarget.setDragging(false);
        this._resizeing = 'bottomMiddle';
        this._focusBox["border"].prevInteractY = event.data.global.y;
        this._focusBox["border"].originX = event.data.global.x - this._focusBox["border"].width / 2;
        this._focusBox["border"].originWidth = this._focusBox["border"].width;
        this._focusBox["border"].originHeight = this._focusBox["border"].height;
    }

    _bottomMiddleOnMouseMove(event) {
        if (event.data.global.y < this._focusBox["border"].prevInteractY - this._focusBox["border"].originHeight) return;
        if (this._resizeing === 'bottomMiddle') {
            const deltaY = event.data.global.y - this._focusBox["border"].prevInteractY;

            const width = this._focusBox["border"].originWidth;
            const height = this._focusBox["border"].originHeight;
            
            this.drawFocusBox(this._focusBox["border"].originX, event.data.global.y - this._focusBox["border"].height, width, height + deltaY);

            const resizeX = this._focusBox["border"].originX + this._focusBox["border"].width / 2;
            const resizeY = event.data.global.y - this._focusBox["border"].height / 2;

            this._focusedTarget.resize(resizeX, resizeY, width, this._focusBox["border"].height);
        }
    }

    _bottomMiddleOnMouseUp(event) {
        this._resizeing = null;
    }

    _bottomMiddleOnMouseOver(event) {
        this._WBS.setCursor("s-resize");
    }

    _bottomMiddleOnMouseOut(event) {
        this._WBS.setCursor("auto");
    }

    _setBottomRightScaleInteraction() {
        this._focusBox['bottomRight'].interactive = true;
        this._focusBox['bottomRight'].on("mousedown", this._bottomRightOnMouseDown, this);
        this._focusBox['bottomRight'].on("mousemove", this._bottomRightOnMouseMove, this);
        this._focusBox['bottomRight'].on("mouseup", this._bottomRightOnMouseUp, this);
        this._focusBox['bottomRight'].on("mouseover", this._bottomRightOnMouseOver, this);
        this._focusBox['bottomRight'].on("mouseout", this._bottomRightOnMouseOut, this);
    }

    _bottomRightOnMouseDown(event) {
        this._focusedTarget.setDragging(false);
        this._resizeing = 'bottomRight';
        this._focusBox["border"].prevInteractX = event.data.global.x;
        this._focusBox["border"].prevInteractY = event.data.global.y;
        this._focusBox["border"].originX = event.data.global.x - this._focusBox["border"].width;
        this._focusBox["border"].originWidth = this._focusBox["border"].width;
        this._focusBox["border"].originHeight = this._focusBox["border"].height;
    }

    _bottomRightOnMouseMove(event) {
        if (event.data.global.x < this._focusBox["border"].originX) return;
        if (event.data.global.y < this._focusBox["border"].prevInteractY - this._focusBox["border"].originHeight) return;
        if (this._resizeing === 'bottomRight') {
            const deltaX = event.data.global.x - this._focusBox["border"].prevInteractX;
            const deltaY = event.data.global.y - this._focusBox["border"].prevInteractY;

            const width = this._focusBox["border"].originWidth;
            const height = this._focusBox["border"].originHeight;

            this.drawFocusBox(this._focusBox["border"].originX, event.data.global.y - this._focusBox["border"].height, width + deltaX, height + deltaY);

            const resizeX = event.data.global.x - this._focusBox["border"].width / 2;
            const resizeY = event.data.global.y - this._focusBox["border"].height / 2;

            this._focusedTarget.resize(resizeX, resizeY, this._focusBox["border"].width, this._focusBox["border"].height);
        }
    }

    _bottomRightOnMouseUp(event) {
        this._resizeing = null;
    }

    _bottomRightOnMouseOver(event) {
        this._WBS.setCursor("se-resize");
    }

    _bottomRightOnMouseOut(event) {
        this._WBS.setCursor("auto");
    }

    _setGlobalInteraction() {
        document.body.addEventListener('mouseup', e => {
            this._resizeing = null;
        });
    }

    getFocusBox() {
        return this._focusBox;
    }

    setFocusedTarget(focused_target) {
        this._focusedTarget = focused_target;
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