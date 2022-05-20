const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: {
        index: './src/index.tsx',
        login: './src/screens/Login',
        register: './src/screens/Register'
    },
    output: { path: path.join(__dirname, 'build'), filename: '[name].bundle.js' },
    mode: process.env.NODE_ENV || 'development',
    target: 'electron-renderer',
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    devServer: {
        port: 3000
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: ['ts-loader']
            },
            {
                test: /\.(css|scss|sass)$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.svg$/i,
                use: ['@svgr/webpack', 'file-loader']
            },
            {
                test: /\.(jpg|jpeg|png|gif|mp3)$/,
                use: ['file-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public', 'index.html'),
            filename: 'index.html',
            chunks: ['index'],
            inject: true
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public', 'index.html'),
            filename: 'login.html',
            chunks: ['login'],
            inject: true
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public', 'index.html'),
            filename: 'register.html',
            chunks: ['register'],
            inject: true
        })
        //new BundleAnalyzerPlugin(),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.js(\?.*)?$/i
            })
        ],
        runtimeChunk: true
    }
};
