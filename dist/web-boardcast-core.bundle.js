/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["webBroadcastCore"] = factory();
	else
		root["webBroadcastCore"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"addSource\": () => (/* binding */ addSource),\n/* harmony export */   \"createImageSource\": () => (/* binding */ createImageSource),\n/* harmony export */   \"createScene\": () => (/* binding */ createScene),\n/* harmony export */   \"createTextSource\": () => (/* binding */ createTextSource),\n/* harmony export */   \"createVideoSource\": () => (/* binding */ createVideoSource),\n/* harmony export */   \"createVirtualModel\": () => (/* binding */ createVirtualModel),\n/* harmony export */   \"init\": () => (/* binding */ init),\n/* harmony export */   \"removeScene\": () => (/* binding */ removeScene),\n/* harmony export */   \"removeSource\": () => (/* binding */ removeSource),\n/* harmony export */   \"selectScene\": () => (/* binding */ selectScene)\n/* harmony export */ });\n/* harmony import */ var _lib_display_media_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/display-media.js */ \"./src/lib/display-media.js\");\n/* harmony import */ var _lib_stream_manager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/stream-manager.js */ \"./src/lib/stream-manager.js\");\n\r\n\r\n\r\nlet worker;\r\n\r\nconst isVideoRemoved = {};\r\n\r\nfunction init(div, canvas, width, height, fps) {\r\n    const offscreen = canvas.transferControlToOffscreen();\r\n\r\n    worker = new Worker(new URL(/* worker import */ __webpack_require__.p + __webpack_require__.u(\"src_worker_js\"), __webpack_require__.b));\r\n\r\n    worker.postMessage(\r\n        {\r\n            type: 'init',\r\n            width: width,\r\n            height: height,\r\n            fps: fps,\r\n            canvas: offscreen\r\n        },\r\n        [offscreen]\r\n    );\r\n\r\n    worker.addEventListener('message', (e) => {\r\n        switch (e.data.type) {\r\n            case 'setCursor':\r\n                div.style.cursor = e.data.mode;\r\n                break;\r\n            case 'removeVideo':\r\n                isVideoRemoved[e.data.id] = true;\r\n                break;\r\n            default:\r\n                break;\r\n        }\r\n    })\r\n\r\n    let isInsideDiv = false;\r\n\r\n    div.addEventListener('mousemove', (e) => {\r\n        if (!isInsideDiv) return;\r\n\r\n        worker.postMessage({ type: 'mouseMove', posX: _getPosX(width, e), posY: _getPosY(height, e) });\r\n    });\r\n\r\n    div.addEventListener('mouseenter', (e) => {\r\n        isInsideDiv = true;\r\n    })\r\n\r\n    div.addEventListener('mouseleave', (e) => {\r\n        isInsideDiv = false;\r\n    })\r\n\r\n    div.addEventListener('mousedown', (e) => {\r\n        worker.postMessage({ type: 'mouseDown', posX: _getPosX(width, e), posY: _getPosY(height, e) });\r\n    });\r\n\r\n    div.addEventListener('mouseup', (e) => {\r\n        worker.postMessage({ type: 'mouseUp', posX: _getPosX(width, e), posY: _getPosY(height, e) });\r\n    });\r\n\r\n    // const streamManager = new StreamManager(canvas, 60, 1000000, 1000000);\r\n    \r\n    // streamManager.startRecording();\r\n\r\n    // setTimeout(() => {\r\n    //     streamManager.getRecorder().addEventListener('dataavailable', (e) => {\r\n    //         const video = document.createElement('video');\r\n    //         video.src = URL.createObjectURL(e.data);\r\n    //         video.style.width = '100%';\r\n    //         video.style.height = '100%';\r\n    //         document.body.appendChild(video);\r\n    //     });\r\n    //     streamManager.stopRecording();\r\n    // }, 30000);\r\n}\r\n\r\nfunction _getPosX(width, e) {\r\n    let ratioWidth = width / div.offsetWidth;\r\n    let posX = (e.clientX - e.target.offsetLeft) * ratioWidth;\r\n    return posX\r\n}\r\n\r\nfunction _getPosY(height, e) {\r\n    let ratioHeight = height / div.offsetHeight;\r\n    let posY = (e.clientY - e.target.offsetTop) * ratioHeight;\r\n    return posY\r\n}\r\n\r\nfunction createScene() {\r\n    worker.postMessage({ type: 'createScene' });\r\n}\r\n\r\nfunction removeScene(index) {\r\n    worker.postMessage({ type: 'removeScene', sceneIndex: index });\r\n}\r\n\r\nfunction selectScene(index) {\r\n    worker.postMessage({ type: 'selectScene', sceneIndex: index });\r\n}\r\n\r\nfunction createVirtualModel(id, url) {\r\n    worker.postMessage({ type: 'createVirtualModel', id: id, url: url });\r\n}\r\n\r\nfunction createImageSource(id, url) {\r\n    const image = new Image();\r\n    image.src = url;\r\n\r\n    image.onload = () => {\r\n        createImageBitmap(image).then((bitmap) => {\r\n            worker.postMessage({ type: 'createImageSource', id: id, bitmap: bitmap }, [bitmap]);\r\n        });\r\n    }\r\n}\r\n\r\nasync function createVideoSource(id) {\r\n    const displayMedia = new _lib_display_media_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\r\n\r\n    const mediaStream = await displayMedia.createMediaStream();\r\n\r\n    const imageCapture = new ImageCapture(mediaStream.getVideoTracks()[0]);\r\n\r\n    worker.postMessage({ type: 'createVideoSource', id: id });\r\n\r\n    isVideoRemoved[id] = false;\r\n\r\n    imageCapture.grabFrame().then((bitmap) => {\r\n        worker.postMessage({ type: 'updateVideoSource', id: id, bitmap: bitmap }, [bitmap]);\r\n        _updateVideoSource(imageCapture, id);\r\n    })\r\n}\r\n\r\nfunction _updateVideoSource(imageCapture, id) {\r\n    imageCapture.grabFrame().then((bitmap) => {\r\n        if (isVideoRemoved[id]) return;\r\n\r\n        worker.postMessage({ type: 'updateVideoSource', id: id, bitmap: bitmap }, [bitmap]);\r\n        \r\n        _updateVideoSource(imageCapture, id);\r\n    })\r\n}\r\n\r\nfunction createTextSource(id, text, style) {\r\n    worker.postMessage({ type: 'createTextSource', id: id, text: text, style: style });\r\n}\r\n\r\nfunction addSource() {\r\n    worker.postMessage({ type: 'addSource' });\r\n}\r\n\r\nfunction removeSource(id) {\r\n    worker.postMessage({ type: 'removeSource', id: id });\r\n}\n\n//# sourceURL=webpack://webBroadcastCore/./src/index.js?");

/***/ }),

/***/ "./src/lib/display-media.js":
/*!**********************************!*\
  !*** ./src/lib/display-media.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ DisplayMedia)\n/* harmony export */ });\nclass DisplayMedia {\r\n    constructor() {\r\n        this._displayMediaOptions = {\r\n            video: {\r\n              cursor: \"always\",\r\n              frameRate: { ideal: 60, max: 60 }\r\n            },\r\n            audio: true\r\n        };\r\n    }\r\n\r\n    async createMediaStream() { \r\n      const mediaDevices = navigator.mediaDevices;\r\n\r\n      const mediaStream = await mediaDevices.getDisplayMedia(this._displayMediaOptions);\r\n      \r\n      return mediaStream;\r\n    }\r\n\r\n    closeMediaStream() {\r\n      const tracks = this._mediaStream.getTracks();\r\n      \r\n      tracks.forEach(track => track.stop());\r\n    }\r\n}\n\n//# sourceURL=webpack://webBroadcastCore/./src/lib/display-media.js?");

/***/ }),

/***/ "./src/lib/stream-manager.js":
/*!***********************************!*\
  !*** ./src/lib/stream-manager.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ StreamManager)\n/* harmony export */ });\nclass StreamManager {\r\n    constructor(canvas, fps, vbps, abps) {\r\n        this._canvas = canvas;\r\n\r\n        this._fps = fps;\r\n\r\n        this._vbps = vbps;\r\n\r\n        this._abps = abps;\r\n\r\n        this._recorder = new MediaRecorder(\r\n            this._canvas.captureStream(this._fps),\r\n            {\r\n                mimeType: 'video/webm;codecs=h264',\r\n                videoBitsPerSecond: this._vbps,\r\n                audioBitsPerSecond: this._abps\r\n            }\r\n        );\r\n    }\r\n\r\n    startRecording() {\r\n        this._recorder.start();\r\n    }\r\n\r\n    stopRecording() {\r\n        this._recorder.stop();\r\n    }\r\n\r\n    getRecorder() {\r\n        return this._recorder;\r\n    }\r\n}\n\n//# sourceURL=webpack://webBroadcastCore/./src/lib/stream-manager.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames not based on template
/******/ 			if (chunkId === "src_worker_js") return "e0e06f4fbb4c08c73a75.bundle.js";
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});