module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  rules: {
    quotes: ['error', 'single', { avoidEscape: true }],
    'no-console': 'error',
    'no-debugger': 'error',
  },
};
