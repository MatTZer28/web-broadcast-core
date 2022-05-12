export function init(canvas, width, height) {
    const offscreen = canvas.transferControlToOffscreen();
        
    const worker = new Worker(new URL('./worker.js', import.meta.url));

    worker.postMessage({width: width, height: height, canvas: offscreen}, [offscreen]);
}