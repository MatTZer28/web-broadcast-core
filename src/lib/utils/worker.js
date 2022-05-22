self.addEventListener('message', function(e) {
    switch (e.data) {
        case 'start':
            setTimeout(() => {
                self.postMessage('');
            }, 5);
    }
});