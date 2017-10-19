var libraryName = 'starterpack';

var siteUrl = "https://architect365.sharepoint.com/sites/spcrowd",
    username = "ddyachenko@architect365.co.uk",
    password = "Bandit177rus";

var path = require('path'),
    argv = require('yargs').argv,
    env = argv.env,
    plugins = [], 
    outputFile;

var webpack = require('webpack'),
    uglifyJsPlugin = webpack.optimize.UglifyJsPlugin,
    extractTextPlugin = require('extract-text-webpack-plugin'),
    autoprefixer = require('autoprefixer'),
    spSaveWebpackPlugin = require('spsave-webpack-plugin');

plugins.push(new extractTextPlugin({
    filename: '../css/screen.css',
    allChunks: true
}));

plugins.push(new webpack.LoaderOptionsPlugin({
    minimize: true, 
    options: {
        context: __dirname,
        postcss: [
            require('autoprefixer')({
                browsers: ['last 3 versions']
            })
        ]
    }
}));

if (env === 'build') {
    plugins.push(new webpack.DefinePlugin({
        "process.env": { 
            NODE_ENV: JSON.stringify("production") 
        }
    }));

    plugins.push(new uglifyJsPlugin({
        minimize: true
    }));

    outputFile = libraryName + '.min.js';
} 
else {
    outputFile = libraryName + '.js';
}

if(env === 'buildup' || env === 'devup') {
    plugins.push(new spSaveWebpackPlugin({
        "coreOptions": {
            "checkin": true,
            "checkinType": 1,
            "notification": true,
            "siteUrl": siteUrl
        },
        "credentialOptions": {
            username: username,
            password: password
        },
        "fileOptions": {
            "folder": "Style Library/" + libraryName + "/js"
        }
    }));
}

var config = {
    entry: __dirname + '/assets/js/src/index.jsx',
    devtool: 'source-map',
    output: {
        path: __dirname + '/public/js',
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    stats: {
        children: false  
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /(\.jsx|\.js)$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /(\.css|\.scss)$/,
                use: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true,
                                modules: true,
                                importLoaders: true,
                                url: false,
                                localIdentName: "[name]_[local]"
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: "postcss-loader"
                        }
                    ]
                })
            }
        ]
    },
    resolve: {
        modules: [
            'node_modules',
            'assets'
        ],
        extensions: ['.js', '.jsx']
    },
    plugins: plugins
};

module.exports = config;