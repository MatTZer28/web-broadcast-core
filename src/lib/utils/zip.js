import { ZipLoader } from "pixi-live2d-display";
import JSZip from 'jszip';

ZipLoader.zipReader = (data, url) => JSZip.loadAsync(data);

ZipLoader.getFilePaths = (jsZip) => {
    const paths = [];

    jsZip.forEach(relativePath => paths.push(relativePath));

    return Promise.resolve(paths);
};

ZipLoader.getFiles = (jsZip, paths) => Promise.all(
    paths.map(
        async path => {
            let blob = null;

            const fileName = path.slice(path.lastIndexOf('/') + 1);

            if (jsZip.file(path) !== null) {
                 blob = await jsZip.file(path).async('blob');
            } else {
                throw new Error('File must not null:' + path);
            }

            return new File([blob], fileName);
        }
    )
);

ZipLoader.readText = (jsZip, path) => {
    const file = jsZip.file(path);

    if (!file) {
        throw new Error('Cannot find file: ' + path);
    }

    return file.async('text');
};