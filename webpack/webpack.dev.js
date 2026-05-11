const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

const devConfig = {
	mode: 'development',
	entry: path.resolve(__dirname, '../src/index.jsx'),
	devtool: 'inline-source-map',
	devServer: {
		static: path.resolve(__dirname, '../public'),
		port: 3000,
		historyApiFallback: true,
		open: true,
		hot: true,
		// Proxy for Fleet API - to avoid CORS issues during development
		proxy: [
			{
				context: ['/kibana-api'],
				target: 'https://73861ca692034d4a926421afcff24bbd.europe-west3.gcp.cloud.es.io',
				changeOrigin: true,
				pathRewrite: { '^/kibana-api': '' },
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '../public/index.html'),
		}),
	],
};

// Merge common and dev configs
module.exports = merge(commonConfig, devConfig);
