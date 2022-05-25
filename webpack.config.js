/* eslint-disable */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    entry: {
        index: ['./src/index.tsx', './src/styles/index.scss'],
        login: ['./src/screens/Login', './src/styles/login.scss'],
        register: ['./src/screens/Register', './src/styles/register.scss'],
        authLoader: ['./src/screens/AuthLoader', './src/styles/authLoader.scss'],
    },
    output: { path: path.join(__dirname, 'build'), filename: '[name].bundle.js' },
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
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public', 'index.html'),
            filename: 'index.html',
            chunks: ['index'],
            inject: true,
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public', 'index.html'),
            filename: 'login.html',
            chunks: ['login'],
            inject: true,
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public', 'index.html'),
            filename: 'register.html',
            chunks: ['register'],
            inject: true,
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public', 'index.html'),
            filename: 'authLoader.html',
            chunks: ['authLoader'],
            inject: true,
        }),
        new MiniCssExtractPlugin({
            filename: '[name].min.css',
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
    },
};
