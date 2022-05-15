import DisplayMedia from './lib/utils/display-media.js';
import StreamManager from './lib/utils/stream-manager.js';

let worker;

const isVideoRemoved = {};

export function init(div, canvas, width, height, fps) {
    const offscreen = canvas.transferControlToOffscreen();

    worker = new Worker(new URL('./worker.js', import.meta.url));

    worker.postMessage(
        {
            type: 'init',
            width: width,
            height: height,
            fps: fps,
            canvas: offscreen
        },
        [offscreen]
    );

    worker.addEventListener('message', (e) => {
        switch (e.data.type) {
            case 'setCursor':
                div.style.cursor = e.data.mode;
                break;
            case 'removeVideo':
                isVideoRemoved[e.data.id] = true;
                break;
            default:
                break;
        }
    })

    let isInsideDiv = false;

    div.addEventListener('mousemove', (e) => {
        if (!isInsideDiv) return;

        worker.postMessage({ type: 'mouseMove', posX: _getPosX(width, e), posY: _getPosY(height, e) });
    });

    div.addEventListener('mouseenter', (e) => {
        isInsideDiv = true;
    })

    div.addEventListener('mouseleave', (e) => {
        isInsideDiv = false;
    })

    div.addEventListener('mousedown', (e) => {
        worker.postMessage({ type: 'mouseDown', posX: _getPosX(width, e), posY: _getPosY(height, e) });
    });

    div.addEventListener('mouseup', (e) => {
        worker.postMessage({ type: 'mouseUp', posX: _getPosX(width, e), posY: _getPosY(height, e) });
    });

    // const streamManager = new StreamManager(canvas, 60, 1000000, 1000000);
    
    // streamManager.startRecording();

    // setTimeout(() => {
    //     streamManager.getRecorder().addEventListener('dataavailable', (e) => {
    //         const video = document.createElement('video');
    //         video.src = URL.createObjectURL(e.data);
    //         video.style.width = '100%';
    //         video.style.height = '100%';
    //         document.body.appendChild(video);
    //     });
    //     streamManager.stopRecording();
    // }, 30000);
}

function _getPosX(width, e) {
    let ratioWidth = width / div.offsetWidth;
    let posX = (e.clientX - e.target.offsetLeft) * ratioWidth;
    return posX
}

function _getPosY(height, e) {
    let ratioHeight = height / div.offsetHeight;
    let posY = (e.clientY - e.target.offsetTop) * ratioHeight;
    return posY
}

export function createScene() {
    worker.postMessage({ type: 'createScene' });
}

export function removeScene(index) {
    worker.postMessage({ type: 'removeScene', sceneIndex: index });
}

export function selectScene(index) {
    worker.postMessage({ type: 'selectScene', sceneIndex: index });
}

export function createVirtualModel(id, url) {
    worker.postMessage({ type: 'createVirtualModel', id: id, url: url });
}

export function createImageSource(id, url) {
    const image = new Image();
    image.src = url;

    image.onload = () => {
        createImageBitmap(image).then((bitmap) => {
            worker.postMessage({ type: 'createImageSource', id: id, bitmap: bitmap }, [bitmap]);
        });
    }
}

export async function createVideoSource(id) {
    const displayMedia = new DisplayMedia();

    const mediaStream = await displayMedia.createMediaStream();

    const imageCapture = new ImageCapture(mediaStream.getVideoTracks()[0]);

    worker.postMessage({ type: 'createVideoSource', id: id });

    isVideoRemoved[id] = false;

    imageCapture.grabFrame().then((bitmap) => {
        worker.postMessage({ type: 'updateVideoSource', id: id, bitmap: bitmap }, [bitmap]);
        _updateVideoSource(imageCapture, id);
    })
}

function _updateVideoSource(imageCapture, id) {
    imageCapture.grabFrame().then((bitmap) => {
        if (isVideoRemoved[id]) return;

        worker.postMessage({ type: 'updateVideoSource', id: id, bitmap: bitmap }, [bitmap]);

        _updateVideoSource(imageCapture, id);
    })
}

export function createTextSource(id, text, style) {
    worker.postMessage({ type: 'createTextSource', id: id, text: text, style: style });
}

export function addSource() {
    worker.postMessage({ type: 'addSource' });
}

export function removeSource(id) {
    worker.postMessage({ type: 'removeSource', id: id });
}