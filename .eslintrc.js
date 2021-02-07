module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['@typescript-eslint', 'import', 'simple-import-sort'],
  parser: '@typescript-eslint/parser',
  rules: {
    quotes: ['error', 'single'],
    '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true }],
    'import/first': 'error',
    'import/order': 'off',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'no-console': 'error',
    'no-debugger': 'error',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'sort-imports': 'off',
  },
};
