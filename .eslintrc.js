module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'simple-import-sort'],
	env: {
		browser: true,
		amd: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
	],
	parserOptions: {
		ecmaVersion: 2018,
	},
	rules: {
		'camelcase': 'off',
		'react/react-in-jsx-scope': 'off',
		'react/prop-types': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'simple-import-sort/sort': 'error',
		'react/no-unescaped-entities': 'off',
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
};
