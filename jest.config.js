module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	modulePathIgnorePatterns: ['cypress'],
	globals: {
		'ts-jest': {
			tsconfig: './tests/tsconfig.json',
		},
	},
};
