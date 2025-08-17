module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
	],
	env: {
		node: true,
		browser: true,
		es6: true,
		jest: true,
	},
	rules: {
		'@typescript-eslint/no-explicit-any': 'warn',
		'no-console': ['warn', { allow: ['warn', 'error'] }],
	},
	ignorePatterns: ['dist', 'build', 'node_modules'],
};