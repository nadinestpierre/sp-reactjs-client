import path from 'path';
import autoprefixer from 'autoprefixer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

const libraryName = 'starterpack';

const defaultEnv = {
    dev: true,
    production: false,
};

export default (env = defaultEnv) => ({
    entry: [
        path.join(__dirname, 'assets/js/src/index.jsx')
    ],
    output: {
        path: path.join(__dirname, 'public/js'),
        filename: libraryName + '.js'
    },
    devtool: 'source-map',
    plugins: [
        new ExtractTextPlugin('../css/screen.css', {
            allChunks: true
        }),
        ...env.dev ? 
            [] : new UglifyJsPlugin({
                    sourceMap: true,
                    compress: {
                        warnings: false
                    }
                }) 
    ],
    module: {
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
                                ['es2015', { modules: false }],
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
    resolve: {
        modules: [
            'node_modules',
            'assets'
        ],
        extensions: ['.js', '.jsx']
    }
});