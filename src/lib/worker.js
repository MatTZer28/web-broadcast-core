let interval;

self.addEventListener('message', (e) => {
    if (e.data === 'start') {
        interval = setInterval(() => self.postMessage('tick'), 5);
    } else if (e.data === 'stop') {
        clearInterval(interval);
    }
});