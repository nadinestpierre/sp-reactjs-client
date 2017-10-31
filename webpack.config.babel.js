import webpack from 'webpack';
import path from 'path';
import autoprefixer from 'autoprefixer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import SpSaveWebpackPlugin from 'spsave-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const libraryName = 'spreactjsclient';

const siteUrl = 'https://architect365.sharepoint.com/sites/chatbot';
const username = 'ddyachenko@architect365.co.uk';
const password = 'Chancery2017.';

// const siteUrl = 'https://unileverdev.sharepoint.com/teams/Dev_DIG Events Plan';
// const username = 'dmitry.dyachenko@unileverpp.com';
// const password = 'Chancery2017.';

const deployPath = 'deployment';
const deployAssetsPath = deployPath + '/Assets';

const defaultEnv = {
    dev: true,
    production: false,
};

const paths = GetPaths(['templates', 'fonts', 'img'], 'public', deployAssetsPath)
    .concat(GetPaths(['masterpage', 'pagelayouts'], 'public', deployPath));

export default (env = defaultEnv) => ({
    entry: env.upload ? __dirname + '/assets/js/src/index.jsx' : {
        'public': path.join(__dirname, 'assets/js/src/index.jsx'),
        [deployAssetsPath]: path.join(__dirname, 'assets/js/src/index.jsx')
    },
    output: env.upload ?
    {
        path: __dirname + '/public/js',
        filename: libraryName + '.js'
    }
    :
    {
        path: __dirname,
        filename: path.join('[name]/js/', libraryName + '.js')
    },
    devtool: 'eval-source-map',
    plugins: [
        ...env.upload ?
            [new ExtractTextPlugin('../css/screen.css', {
                allChunks: true
            })]
            :
            [new ExtractTextPlugin('[name]/css/screen.css', {
                allChunks: true
            })],
        ...env.production ?
            [new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                }
            })] : [],
        ...env.production ?
            [new UglifyJsPlugin({
                sourceMap: true,
                compress: {
                    warnings: false
                }
            })] : [],
        ...env.upload ?
            [new SpSaveWebpackPlugin({
                coreOptions: {
                    checkin: true,
                    checkinType: 1,
                    notification: true,
                    siteUrl
                },
                credentialOptions: {
                    username,
                    password
                },
                fileOptions: {
                    folder: 'Style Library/' + libraryName + '/js'
                }
            })] : [],
        ...env.sync ?
            [new CopyWebpackPlugin(paths, {
                copyUnmodified: true
            })] : []
    ],
    module: {
        noParse: [/jszip.js$/],
        rules: [
            {
                enforce: 'pre',
                test: /(\.jsx|\.js)$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
            },
            {
                test: /(\.jsx|\.js)$/,
                exclude: /node_modules/,
                include: path.join(__dirname, 'assets/js/src'),
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            presets: [
                                [
                                    'es2015',
                                    {
                                        'modules': false
                                    }
                                ],
                                'react',
                                'stage-0'
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.(css|scss|sass)$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                url: false,
                                modules: true,
                                importLoaders: 1,
                                localIdentName: '[name]_[local]'
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    require('autoprefixer')({ browsers: ['last 3 versions'] })
                                ]
                            }
                        },
                        {
                            loader: 'sass-loader'
                        },
                        {
                            loader: 'sass-resources-loader',
                            options: {
                                resources: [
                                    path.join(__dirname, 'assets/css/utils/_variables.scss'),
                                    path.join(__dirname, 'assets/css/utils/mixins/_breakpoints.scss'),
                                    path.join(__dirname, 'assets/css/utils/mixins/_center.scss')
                                ]
                            },
                        }
                    ]
                })
            }
        ]
    },
    node: {
        console: true,
        fs: 'empty',
        tls: 'empty',
        net: 'empty'
    },
    resolve: {
        modules: [
            'node_modules',
            'assets'
        ],
        extensions: ['.js', '.jsx']
    }
});

function GetPaths(folderNames, from, to) {
    const paths = [];

    for (let i = 0; i < folderNames.length; i++) {
        paths.push({
            from: path.join(from, '/', folderNames[i]),
            to: path.join(to, '/', folderNames[i])
        });
    }

    return paths;
}