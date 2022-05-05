const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'web-boardcast-core.bundle.js',
        library: {
            name: 'webBroadcastCore',
            type: 'umd',
        },
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"),
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                use: ['source-map-loader'],
            }
        ],
    }
}