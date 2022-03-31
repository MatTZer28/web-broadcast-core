import Source from "../lib/source";

import * as PIXI from 'pixi.js'

export default class SourcesWrapper {
    constructor(WBS, parentScene) {
        this._WBS = WBS;
        this._parentScene = parentScene;
        this._sources = [];
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

        for (const [key, value] of Object.entries(this._focusBox)) {
            this._parentScene.addChild(value);
            value.zIndex = 2;
        }
    }

    drawFocusBox(x, y, width, height) {
        this.resetBox();

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

    resetBox() {
        for (const [key, value] of Object.entries(this._focusBox)) {
            this._focusBox[key].clear();
            this._focusBox[key].x = 0;
            this._focusBox[key].y = 0;
        }
    }

    addSource(sourceType, sourcePath) {
        const source = new Source(this._WBS, sourceType, sourcePath, this);
        source.zIndex = 1;
        this._sources.push(source);
        this._parentScene.addSourceChild(source.getSource());
    }

    getSource(sourceIndex) {
        return this._sources[sourceIndex];
    }

    removeSource(sourceIndex) {
        this._sources[sourceIndex].destroy();
        this._sources.splice(sourceIndex, 1);
    }

    setSourceOnFocusedStateWithout(texture, state) {
        this._sources.forEach(source => {
            if (source.getSource() !== texture) {
                source.getSource().setOnFoucsState(state);
            }
        });
    }

    setSourceOnInteractiveStateWithout(texture, state) {
        this._sources.forEach(source => {
            if (source.getSource() !== texture) {
                source.getSource().setInteractiveState(state);
            }
        });
    }
}