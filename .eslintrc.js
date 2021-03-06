module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  plugins: [
    'vue',
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'linebreak-style': 'off',
    'max-len': ['error', { code: 300 }], // 此处为具体添加代码
    'import/extensions': 'off',
  },
};
