self.addEventListener('message', function(e) {
    switch (e.data.type) {
        case 'start':
            setTimeout(() => {
                self.postMessage('');
            }, 1000/e.data.fps)
            break;
    }
});