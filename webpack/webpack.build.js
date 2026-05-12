const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');
const webpack = require('webpack');

const commonConfig = require('./webpack.common');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const buildConfig = {
	mode: 'production',
	entry: path.resolve(__dirname, '../src/index.jsx'),
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: 'bundle.[contenthash].js',
		clean: true,
		publicPath: '/',
	},
	resolve: {
		extensions: ['.js', '.jsx'],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '../public/index.html'),
			minify: true,
		}),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: 'public/media', to: 'media' },
				{ from: 'public/locales', to: 'locales' },
			],
		}),
		new webpack.DefinePlugin({
			'process.env.KIBANA_API_KEY': JSON.stringify(process.env.KIBANA_API_KEY),
		}),
	],
	optimization: {
		minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
	},
};

module.exports = merge(commonConfig, buildConfig);
