const webpack = require('webpack'),
    path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    extractCSS = new ExtractTextPlugin('build/style/[name].[contenthash:20].css'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    WebpackAssetsManifest = require('webpack-assets-manifest'),
    htmlWebpackPlugin = require('html-webpack-plugin'),
    CopyPlugin = require('copy-webpack-plugin'),
    PATH = {
        public: path.resolve(__dirname, 'public'),
        build: path.resolve(__dirname, 'public/build'),
        views: path.resolve(__dirname, 'views')
    },
    isBuild = (process.env.npm_lifecycle_event === 'build');

const appEnv = process.env.NODE_ENV || 'local';

const rules = [{
    test: /\.js$/,
    exclude: [/node_modules/],
    loader: 'babel-loader'
},
{
    test: /\.css$/,
    loader: extractCSS.extract({
        fallbackLoader: 'style-loader',
        loader: 'css-loader?sourceMap',
        publicPath: '/'
    })
}, {
    test: /\.(jpe?g|png|gif|cur|webp|mp3|ogg|woff|woff2|ttf|svg|eot)$/,
    exclude: [/node_modules/],
    loader: 'file-loader?name=[path][name].[ext]?[hash:8]'
},
{ //can't use [path] for images inside node_modules, so copy them to build
    test: /\.(jpe?g|png|gif|cur|webp)$/,
    include: [/node_modules/],
    loader: 'file-loader?name=build/img/[name].[ext]?[hash:8]'
},
{
    //can't use [path] for fonts inside node_modules, so copy them to build
    test: /\.(woff|woff2|ttf|svg|eot)$/,
    include: [/node_modules/],
    loader: 'file-loader?name=build/font/[name].[ext]?[hash:8]'
}
]

const plugins = [
    extractCSS,
    // To prevent longterm cache of vendor chunks
    // extract a 'manifest' chunk, then include it to the app
    new webpack.optimize.CommonsChunkPlugin({
        names: ['lib', 'manifest']
    }),
    //automatically load the modules
    //when the key is identified in a file
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
    }),
    // create manifest json to refer assets in php file
    new WebpackAssetsManifest({
        output: 'build/webpack-manifest.json',
        publicPath: '/',
        writeToDisk: true //php needs this to read file from disk
    }),
    new CopyPlugin([
        { 
            from: 'service-worker.js', 
            to: 'build/service-worker.js' 
        }
    ])
]

const buildPlugins = [
    new CleanWebpackPlugin(PATH.build),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            drop_console: true
        }
    })
]

const templatePlugins = [
    new htmlWebpackPlugin({
        title: 'mainfest',
        template: PATH.views+'/'
    })
]

//add buildPlugins only in build cycle
isBuild && plugins.push.apply(plugins, buildPlugins);

module.exports = {
    devtool: isBuild ? false : 'source-map',
    entry: {        
        'index': 'main',
        'lib': ['jquery', 'es6-promise', 'webfontloader']
    },
    context: PATH.public,
    output: {
        path: PATH.public,
        publicPath: '/',
        filename: 'build/js/[name].[chunkhash].js',
        chunkFilename: 'build/js/[chunkhash].js'
    },
    devServer: {
        host: '0.0.0.0',
        port: 20346,
        inline: true,
        compress: true,
        disableHostCheck: true,
        proxy: {
            '*': {
                target: 'http://localhost:3000'
            }
        },
        contentBase: './public',
        watchContentBase: true
    },
    plugins: plugins,
    module: {
        rules: rules
    },
    resolve: {
        modules: ['node_modules', path.resolve(__dirname, 'public')],
        extensions: ['.js', '.css'],
        descriptionFiles: ['package.json'],
    },
    watchOptions: {
        ignored: /(node_modules)/,
        poll: 1000
    }
}