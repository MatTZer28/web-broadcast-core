import * as Kalidokit from 'kalidokit';

importScripts(new URL('../live2d/live2dcubismcore.min.js', import.meta.url));
importScripts(new URL('../live2d/live2d.min.js', import.meta.url));
importScripts(new URL('../utils/face_mesh.js', import.meta.url));
importScripts(new URL('../utils/camera_utils.js', import.meta.url));

window.Live2DCubismCore = Live2DCubismCore;

self.Live2DMotion = window.Live2DMotion;
self.AMotion = window.AMotion;
self.PhysicsHair = window.PhysicsHair;

const PIXI = require('pixi.js');
 
window.PIXI = PIXI;

const { Live2DModel } = require('pixi-live2d-display');

export class Virtual extends PIXI.Container {
    constructor(WBS, sourceWrapper, id) {
        super();

        this._dragging = false;

        this._focused = false;

        this._WBS = WBS;

        this._sourceWrapper = sourceWrapper;

        this._id = id;

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

        this._setMouseEventListener();

        this._addToContainer();

        this._motionTracking();
    }

    _initModel() {
        this._model.scale.set(0.2);
        this._model.anchor.set(0.5);
        this._model.x = this._WBS.appWidth / 2;
        this._model.y = this._WBS.appHeight / 2;
        this._focused = false;
    }

    _setMouseEventListener() {
        this._setOnMouseDownEventListener();
        this._setOnMouseMoveEventListener();
        this._setOnMouseUpEventListener();
        this._setOnMouseOverEventListener();
        this._setOnMouseOutEventListener();
    }

    _setOnMouseDownEventListener() {
        self.addEventListener("onmousedown", (e) => {
            const posX = e.detail.position.x;
            const posY = e.detail.position.y;

            const xLeft = this._model.x - this._model.width / 2 + 7;
            const xRight = this._model.x + this._model.width / 2 - 7;
            const yTop = this._model.y - this._model.height / 2 + 7;
            const yBottom = this._model.y + this._model.height / 2 - 7;

            const isInX = xLeft <= posX && xRight >= posX;
            const isInY = yTop <= posY && yBottom >= posY;
            const isInside = isInX && isInY;

            if (isInside) this._modelOnMouseDown(posX, posY);
        });
    }

    _setOnMouseMoveEventListener() {
        self.addEventListener("onmousemove", (e) => {
            const posX = e.detail.position.x;
            const posY = e.detail.position.y;

            this._modelOnMouseMove(posX, posY);
        });
    }

    _setOnMouseUpEventListener() {
        self.addEventListener("onmouseup", (e) => {
            this._modelOnMouseUp();
        });
    }

    _setOnMouseOverEventListener() {
        self.addEventListener("onmousemove", (e) => {
            const posX = e.detail.position.x;
            const posY = e.detail.position.y;

            const xLeft = this._model.x - this._model.width / 2 + 7;
            const xRight = this._model.x + this._model.width / 2 - 7;
            const yTop = this._model.y - this._model.height / 2 + 7;
            const yBottom = this._model.y + this._model.height / 2 - 7;

            const isInX = xLeft <= posX && xRight >= posX;
            const isInY = yTop <= posY && yBottom >= posY;
            const isInside = isInX && isInY;

            if (isInside) this._modelOnMouseOver();
        });
    }

    _setOnMouseOutEventListener() {
        self.addEventListener("onmousemove", (e) => {
            const posX = e.detail.position.x;
            const posY = e.detail.position.y;

            const xLeft = this._model.x - this._model.width / 2 + 7;
            const xRight = this._model.x + this._model.width / 2 - 7;
            const yTop = this._model.y - this._model.height / 2 + 7;
            const yBottom = this._model.y + this._model.height / 2 - 7;

            const isOutX = xLeft > posX || xRight < posX;
            const isOutY = yTop > posY || yBottom < posY;
            const isOutside = isOutX || isOutY;

            if (isOutside) this._modelOnMouseOut();
        });
    }

    _modelOnMouseDown(posX, posY) {
        this._blueBox.clear();
        this._sourceWrapper.focusBox.setFocusedTarget(this);
        this._showFocusBox();

        this._WBS.setCursor("move");

        this._focused = true;
        this._dragging = true;

        this._sourceWrapper.unfocusedWithout(this, false);

        this._model.prevInteractX = posX;
        this._model.prevInteractY = posY;
    }

    setDragging(state) {
        this._dragging = state;
    }

    _showFocusBox() {
        if (!this._focused) {
            let width = this._model.width;
            let height = this._model.height;
            let bounds = this._model.getBounds();
            this._sourceWrapper.focusBox.drawFocusBox(bounds.x, bounds.y, width, height);
        }
    }

    _modelOnMouseMove(posX, posY) {
        if (this._dragging) {
            const deltaX = posX - this._model.prevInteractX;
            const deltaY = posY - this._model.prevInteractY;

            this._moveModel(deltaX, deltaY);
            this._sourceWrapper.focusBox.moveFocusBox(deltaX, deltaY);

            this._model.prevInteractX = posX;
            this._model.prevInteractY = posY;
        }
    }

    _moveModel(deltaX, deltaY) {
        this._model.x = this._model.x + deltaX;
        this._model.y = this._model.y + deltaY;
    }

    _modelOnMouseUp() {
        this._dragging = false;

        this._WBS.setCursor("auto");
    }

    _modelOnMouseOver() {
        if (!this._focused) {
            this._drawBlueBox();
        }
    }

    _drawBlueBox() {
        this._blueBox.lineStyle(4, 0x00AEB9);
        this._blueBox.drawShape(this._model.getBounds());
    }

    _modelOnMouseOut() {
        if (!this._focused) {
            this._blueBox.clear();
        }
    }

    isClickInsideSprite(x, y) {
        const isBiggerThanLeft = (x >= this._model.x - (this._model.width / 2) - 8);
        const isSmallerThanRight = (x <= this._model.x + (this._model.width / 2) + 8);
        const isInsideModelX = (isBiggerThanLeft && isSmallerThanRight);

        const isBiggerThanTop = (y >= this._model.y - (this._model.height / 2) - 8);
        const isSmallerThanBottom = (y <= this._model.y + (this._model.height / 2) + 8);
        const isInsideModelY = (isBiggerThanTop && isSmallerThanBottom);

        return (isInsideModelX && isInsideModelY);
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

    getFocusState() {
        return this._focused;
    }

    getDraggingState() {
        return this._dragging;
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