/* eslint-disable */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
    entry: {
        index: ['./src/window/index.tsx', './src/styles/index.scss'],
        login: ['./src/window/login.tsx', './src/styles/login.scss'],
        register: ['./src/window/register.tsx', './src/styles/register.scss'],
        'file-viewer': ['./src/window/file-viewer.tsx', './src/styles/file-viewer.scss'],
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].bundle.js',
        clean: true,
    },
    mode: process.env.NODE_ENV || 'development',
    target: 'electron-renderer',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    devServer: {
        port: 3000,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: ['ts-loader'],
            },
            {
                test: /\.(css|scss|sass)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.svg$/i,
                use: ['@svgr/webpack', 'file-loader'],
            },
            {
                test: /\.(jpg|jpeg|png|gif|mp3)$/,
                use: ['file-loader'],
            },
        ],
    },
    plugins: [
        ...['index', 'login', 'register', 'file-viewer'].map(
            (winName) =>
                new HtmlWebpackPlugin({
                    template: path.join(__dirname, 'public', 'index.html'),
                    filename: `${winName}.html`,
                    chunks: [winName],
                    inject: true,
                })
        ),
        new MiniCssExtractPlugin({
            filename: '[name].min.css',
        }),
        new CircularDependencyPlugin({
            exclude: /a\.js|node_modules/,
            failOnError: true,
            allowAsyncCycles: false,
            cwd: process.cwd(),
        }),
        //new BundleAnalyzerPlugin(),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.js(\?.*)?$/i,
            }),
            new CssMinimizerPlugin(),
        ],
        removeAvailableModules: true,
        removeEmptyChunks: true,
        mergeDuplicateChunks: true,
        emitOnErrors: false,
        concatenateModules: true,
    },
};
