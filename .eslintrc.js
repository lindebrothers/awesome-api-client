module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  plugins: ['react'],
  rules: {
    'import/newline-after-import': [1, { count: 1 }],
    'arrow-body-style': 'off',
    'arrow-parens': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-named-as-default': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'no-param-reassign': 'off',
    'no-underscore-dangle': 'off',
    'react/forbid-prop-types': 'off',
    'react/require-default-props': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'jsx-a11y/no-static-element-interactions': 'off',
    semi: ['error', 'never'],
    'react/prefer-stateless-function': 'off',
    'class-methods-use-this': 'off',
    'implicit-arrow-linebreak': 'off',
    'no-console': 'off',
  },
  // Currently ESLint does not allow to have glob-specific settings (i.e.
  // settings that apply to specific files only), hence the use of this setting
  globals: {
    // General rules
    document: true,
    window: true,
    // Rules for tests (**.spec.js)
    after: true,
    afterEach: true,
    before: true,
    beforeEach: true,
    describe: true,
    expect: true,
    it: true,
    jest: true,
    spyOn: true,
  },
}
