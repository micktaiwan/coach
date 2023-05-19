module.exports = {
  parser: '@babel/eslint-parser',
  env: {
    meteor: true,
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: ['meteor', 'no-only-tests', 'no-relative-import-paths'],
  extends: ['airbnb-base', 'plugin:meteor/recommended'],
  parserOptions: {
    requireConfigFile: false,
    sourceType: 'module',
  },
  rules: {
    'import/no-absolute-path': 'off',
    'no-promise-executor-return': 'off',
    'function-call-argument-newline': 'off',
    'function-paren-newline': 'off',
    'default-param-last': 'off',
    'no-multiple-empty-lines': 'off',
    'meteor/no-session': 'off',
    'import/no-unresolved': 0,
    'object-curly-newline': 0,
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'object-shorthand': ['error', 'always'],
    'newline-per-chained-call': 0,
    // 'no-lonely-if': 0,
    'prefer-destructuring': ['error', { object: true, array: false }],
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-console': 0,
    'max-len': 0,
    'func-names': 0,
    // "key-spacing": 0,
    'no-param-reassign': 0,
    // "no-prototype-builtins": 0,
    // "prefer-arrow-callback": 0,
    'new-cap': [2, {
      newIsCap: true,
      capIsNewExceptions: ['Match.OneOf', 'Match.Optional', 'Match.ObjectIncluding', 'Match.Where', 'Match.Maybe', 'DateTimeFormat'],
    }],
    // "no-nested-ternary": 0,
    'no-eval': 0,
    'arrow-parens': ['error', 'as-needed'],
    'no-mixed-operators': 'error',
    'no-bitwise': 0,
    'no-plusplus': 0,
    'no-else-return': 0,
    'no-underscore-dangle': 0,
    'operator-linebreak': ['error', 'after'],
    'no-only-tests/no-only-tests': 'error',
    'space-before-function-paren': 0,
    curly: ['error', 'multi-line'],
  },
  globals: {
    FlowRouter: 'readonly',
    BlazeLayout: 'readonly',
  },
};
