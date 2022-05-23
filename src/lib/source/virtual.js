import * as PIXI from 'pixi.js';
import * as Kalidokit from 'kalidokit';

window.PIXI = PIXI;

const { Live2DModel } = require('pixi-live2d-display');

export default class Virtual extends PIXI.Container {
    constructor(WBS, sourceWrapper, id, metadata) {
        super();

        this._dragging = false;

        this._focused = false;

        this._WBS = WBS;

        this._sourceWrapper = sourceWrapper;

        this.id = id;

        this._metadata = metadata;

        this._blueBox = new PIXI.Graphics();
    }

    async loadModel(sourcePath) {
        this._model = await Live2DModel.from(sourcePath, { autoInteract: false });
        this._model.name = 'sprite';
        this._model.internalModel.breath = null;

        this._videoElement = document.createElement('video');

        this._facemesh = new FaceMesh({locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        }});

        this._initModel();

        this._setModelInteraction();

        this._setBackgroundInteraction();

        this._setGlobalInteraction();

        this._addToContainer();

        this._motionTracking();
    }

    _initModel() {
        this._model.scale.set(0.2);
        this._model.anchor.set(0.5);
        this._focused = false;

        if (this._metadata) {
            this._model.x = this._metadata.x;
            this._model.y = this._metadata.y;
            this._model.width = this._metadata.width;
            this._model.height = this._metadata.height;
            this._model.visible = this._metadata.visible;
        } else {
            this._model.x = this._WBS.appWidth / 2;
            this._model.y = this._WBS.appHeight / 2;
        }
    }

    _setModelInteraction() {
        this.setInteractiveState(true);
        this._model.on("mousedown", this._modelOnMouseDown, this);
        this._model.on("mousemove", this._modelOnMouseMove, this);
        this._model.on("mouseup", this._modelOnMouseUp, this);
        this._model.on("mouseover", this._modelOnMouseOver, this);
        this._model.on("mouseout", this._modelOnMouseOut, this);
    }

    _modelOnMouseDown(event) {
        this._blueBox.clear();
        this._sourceWrapper.focusBox.setFocusedTarget(this);
        this._showFocusBox();

        this._WBS.setCursor("move");

        this._focused = true;
        this._dragging = true;

        this._sourceWrapper.unfocusedWithout(this, false);
        this._sourceWrapper.disableInteractiveWithout(this, false);

        this._model.prevInteractX = event.data.global.x;
        this._model.prevInteractY = event.data.global.y;
    }

    setDragging(state) {
        this._dragging = state;
    }

    _showFocusBox() {
        const bounds = this._model.getBounds();
        this._sourceWrapper.focusBox.drawFocusBox(bounds.x, bounds.y, bounds.width, bounds.height);
    }

    _modelOnMouseMove(event) {
        if (this._dragging) {
            const deltaX = event.data.global.x - this._model.prevInteractX;
            const deltaY = event.data.global.y - this._model.prevInteractY;

            this._moveModel(deltaX, deltaY);
            this._sourceWrapper.focusBox.moveFocusBox(deltaX, deltaY);

            this._model.prevInteractX = event.data.global.x;
            this._model.prevInteractY = event.data.global.y;
        }
    }

    _moveModel(deltaX, deltaY) {
        this._model.x = this._model.x + deltaX;
        this._model.y = this._model.y + deltaY;
    }

    _modelOnMouseUp(event) {
        this._dragging = false;

        this._sourceWrapper.disableInteractiveWithout(this, true);

        this._WBS.setCursor("auto");
    }

    _modelOnMouseOver(event) {
        if (!this._focused) {
            this._drawBlueBox();
        }
    }

    _drawBlueBox() {
        this._blueBox.lineStyle(4, 0x00AEB9);
        this._blueBox.drawShape(this._model.getBounds());
    }

    _modelOnMouseOut(event) {
        if (!this._focused) {
            this._blueBox.clear();
        }
    }

    _setBackgroundInteraction() {
        this._WBS.background.on('click', (event) => {
            if (!this._isClickInsideModel(event.data.global.x, event.data.global.y)) {
                this._focused = false;
                this._sourceWrapper.focusBox.resetFocusBox();
            }
        }, this);
    }

    _isClickInsideModel(x, y) {
        const isBiggerThanLeft = (x >= this._model.x - (this._model.width / 2));
        const isSmallerThanRight = (x <= this._model.x + (this._model.width / 2));
        const isInsideModelX = (isBiggerThanLeft && isSmallerThanRight);

        const isBiggerThanTop = (y >= this._model.y - (this._model.height / 2));
        const isSmallerThanBottom = (y <= this._model.y + (this._model.height / 2));
        const isInsideModelY = (isBiggerThanTop && isSmallerThanBottom);

        return (isInsideModelX && isInsideModelY);
    }

    _setGlobalInteraction() {
        document.addEventListener('mouseup', e => {
            this._dragging = null;
        });
    }

    _addToContainer() {
        this.addChild(this._model);
        this.addChild(this._blueBox);
    }

    _motionTracking() {
        this._facemesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        this._facemesh.onResults((results) => {
            this._animateLive2DModel(results.multiFaceLandmarks[0]);
        });

        this._startCamera();
    }

    _animateLive2DModel(points) {
        if (!this._model || !points) return;

        let riggedFace;

        if (points) {
            riggedFace = Kalidokit.Face.solve(points, {
                runtime: "mediapipe",
                video: this._videoElement,
                smoothBlink: true,
            });
            this._rigFace(riggedFace, 0.5);
        }
    }

    _rigFace(result, lerpAmount = 0.7) {
        if (!this._model || !result) return;

        const coreModel = this._model.internalModel.coreModel;

        this._model.internalModel.motionManager.update = (...args) => {
            this._model.internalModel.eyeBlink = undefined;

            const EyeBallX = Kalidokit.Vector.lerp(result.pupil.x, coreModel.getParameterValueById("ParamEyeBallX"), lerpAmount);

            coreModel.setParameterValueById("ParamEyeBallX", EyeBallX);
            coreModel.setParameterValueById("PARAM_EYE_BALL_X", EyeBallX);

            const EyeBallY = Kalidokit.Vector.lerp(result.pupil.y, coreModel.getParameterValueById("ParamEyeBallY"), lerpAmount);

            coreModel.setParameterValueById("ParamEyeBallY", EyeBallY);
            coreModel.setParameterValueById("PARAM_EYE_BALL_y", EyeBallY);

            const angleX = Kalidokit.Vector.lerp(result.head.degrees.y, coreModel.getParameterValueById("ParamAngleX"), lerpAmount);

            coreModel.setParameterValueById("ParamAngleX", angleX);
            coreModel.setParameterValueById("PARAM_ANGLE_X", angleX);

            const angleY = Kalidokit.Vector.lerp(result.head.degrees.x, coreModel.getParameterValueById("ParamAngleY"), lerpAmount);

            coreModel.setParameterValueById("ParamAngleY", angleY);
            coreModel.setParameterValueById("PARAM_ANGLE_Y", angleY);

            const angleZ = Kalidokit.Vector.lerp(result.head.degrees.z, coreModel.getParameterValueById("ParamAngleZ"), lerpAmount);

            coreModel.setParameterValueById("ParamAngleZ", angleZ);
            coreModel.setParameterValueById("PARAM_ANGLE_Z", angleZ);

            const dampener = 0.3;
            const bodyAngleX = Kalidokit.Vector.lerp(result.head.degrees.y * dampener, coreModel.getParameterValueById("ParamBodyAngleX"), lerpAmount);

            coreModel.setParameterValueById("ParamBodyAngleX", bodyAngleX);
            coreModel.setParameterValueById("PARAM_BODY_ANGLE_X", bodyAngleX);

            const bodyAngleY = Kalidokit.Vector.lerp(result.head.degrees.x * dampener, coreModel.getParameterValueById("ParamBodyAngleY"), lerpAmount);


            coreModel.setParameterValueById("ParamBodyAngleY", bodyAngleY);
            coreModel.setParameterValueById("PARAM_BODY_ANGLE_Y", bodyAngleY);

            const bodyAngleZ = Kalidokit.Vector.lerp(result.head.degrees.z * dampener, coreModel.getParameterValueById("ParamBodyAngleZ"), lerpAmount);

            coreModel.setParameterValueById("ParamBodyAngleZ", bodyAngleZ);
            coreModel.setParameterValueById("PARAM_BODY_ANGLE_Z", bodyAngleZ);

            const eyeLOpen = Kalidokit.Vector.lerp(result.eye.l, coreModel.getParameterValueById("ParamEyeLOpen"), 0.5);

            coreModel.setParameterValueById("ParamEyeLOpen", eyeLOpen);
            coreModel.setParameterValueById("PARAM_EYE_L_OPEN", eyeLOpen);

            const eyeROpen = Kalidokit.Vector.lerp(result.eye.r, coreModel.getParameterValueById("ParamEyeROpen"), 0.5);


            coreModel.setParameterValueById("ParamEyeROpen", eyeROpen);
            coreModel.setParameterValueById("PARAM_EYE_R_OPEN", eyeROpen);

            const mouthOpenY = Kalidokit.Vector.lerp(result.mouth.y, coreModel.getParameterValueById("ParamMouthOpenY"), 0.3);

            coreModel.setParameterValueById("ParamMouthOpenY", mouthOpenY);
            coreModel.setParameterValueById("PARAM_MOUTH_OPEN_Y", mouthOpenY);

            const mouthForm = 0.3 + Kalidokit.Vector.lerp(result.mouth.x, coreModel.getParameterValueById("ParamMouthForm"), 0.3);

            coreModel.setParameterValueById("ParamMouthForm", mouthForm);
            coreModel.setParameterValueById("PARAM_MOUTH_FORM", mouthForm);
        };
    }

    _startCamera() {
        const camera = new Camera(this._videoElement, {
            onFrame: async () => {
                await this._facemesh.send({ image: this._videoElement });
            }
        });

        camera.start();
    }

    setOnFoucsState(state) {
        this._focused = state;
    }

    setInteractiveState(state) {
        this._model.interactive = state;
    }

    setVisiableState(state) {
        this._model.visible = state;
    }

    getBounds() {
        return this._sprite.getBounds();
    }

    getFocusState() {
        return this._focused;
    }

    getDraggingState() {
        return this._dragging;
    }

    getVisibleState() {
        return this._sprite.visible;
    }

    resize(x, y, width, height) {
        this._model.x = x;
        this._model.y = y;
        this._model.width = width;
        this._model.height = height;
    }

    destroy() {
        this.destroy({
            children: true,
            texture: true,
            baseTexture: true
        });
    }
}