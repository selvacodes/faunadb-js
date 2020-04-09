// https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier/@typescript-eslint',
  ],
  rules: {
    // No console in production.
    'no-console': 'error',
    // Fauna uses it internally.
    '@typescript-eslint/camelcase': 'off',
  },
};
