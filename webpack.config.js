const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const htmlPageNames = ['music-player', 'js_canvas_clock'];
const multipleHtmlPlugins = htmlPageNames.map(name => {
    return new HtmlWebpackPlugin({
        path: path.resolve(__dirname, `build`),
        filename: `${name}/index.html`, // output HTML files
        template: `./${name}/index.html`, // relative path to the HTML files
        chunks: [`${name}`] // respective JS files
    })
});


const moduleRules = htmlPageNames.map(name => {
    return {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        include: [
            path.resolve(__dirname, name)
        ],
        options: {
            outputPath: `${name}/images`,
            name: '[name].[ext]',
        },
    }
})

module.exports = {
    entry: {
        "music-player": './music-player/script.js',
        js_canvas_clock: './js_canvas_clock/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: path.resolve(__dirname, 'build'),
        assetModuleFilename: "assets/[name][ext]",
        filename: '[name]/[name].bundle.js',
        chunkFilename: '[id].bundle_[chunkhash].js',
        sourceMapFilename: '[file].map'
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            path: path.resolve(__dirname, `build`),
            filename: `index.html`, // output HTML files
            template: './index.html'
        })
    ].concat(multipleHtmlPlugins),
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.(mp3)$/i,
                loader: 'file-loader',
                include: [
                    path.resolve(__dirname, "music-player")
                ],
                options: {
                    outputPath: 'music-player/music',
                    name: '[name].[ext]',
                },
            },
        ].concat(moduleRules)
    }
};