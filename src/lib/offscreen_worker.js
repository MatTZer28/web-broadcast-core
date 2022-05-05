let interval;

let switcher = false;

self.addEventListener('message', (e) => {
    switch(e.data) {
        case 'start':
            switcher = true;
            requestAnimationFrame(frame);
            break;
        case 'stop':
            switcher = false;
            break;
    }
});

function frame() {
    if (!switcher) return;

    self.postMessage('tick');
    requestAnimationFrame(frame);
}