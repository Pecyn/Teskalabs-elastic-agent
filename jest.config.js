/** @type {import('jest').Config} */
module.exports = {
	testEnvironment: 'jsdom',
	transform: {
		'^.+\\.jsx?$': 'babel-jest',
	},
	transformIgnorePatterns: ['/node_modules/'],
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	moduleNameMapper: {
		'asab_webui_components': '<rootDir>/src/__mocks__/asab_webui_components.js',
		'\\.(css|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
	},
};
