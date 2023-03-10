require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'arrow-parens': 'error',
    semi: 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 导入依赖检查
    'import/no-extraneous-dependencies': 'off',
    // _使用检查
    'no-underscore-dangle': 'off',
    // 箭头函数返回值
    'consistent-return': 'off',
    // promise没有执行器返回
    'no-promise-executor-return': 'off',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false,
        useTabs: false,
        printWidth: 80,
        tabWidth: 2,
        quoteProps: 'as-needed',
        trailingComma: 'all',
        arrowParens: 'always',
      },
    ],
  },
}
