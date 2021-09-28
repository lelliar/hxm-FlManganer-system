module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    'plugin:prettier/recommended',
    'eslint:recommended',
    '@vue/prettier'
  ],

  parserOptions: {
    parser: 'babel-eslint'
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'generator-star-spacing': 'off',
    'switch-case': 0,
    'no-var': 0,
    'padded-blocks': 'off',
    'space-before-function-paren': 0,
    eqeqeq: 0,
    'no-trailing-spaces': 1,
    'space-before-function-paren': 0,
    'no-const-assign': 1,
    'no-irregular-whitespace': 1,
    'no-extra-semi': 1,
    'no-multi-str': 1,
    'no-undef': 1,
    camelcase: 1,
    indent: [1, 2],
    'no-spaced-func': 1,
    'prefer-const': 0,
    'space-in-parens': [0, 'never'],
    'space-unary-ops': [
      0,
      {
        words: false,
        nonwords: false
      }
    ]
  }
}
