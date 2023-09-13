module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    semi: 'off',
    'vue/multi-word-component-names': 'off',
    quotes: "off",
    'object-curly-spacing': "off",
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'comma-dangle': 'off',
    'space-before-function-paren': 'warn',
    'keyword-spacing': 'warn',
    '@typescript-eslint/no-this-alias': [
      "error",
      {
        allowDestructuring: true, // Allow `const { props, state } = this`; false by default
        allowedNames: ["vm"] // Allow `const vm = this`; `[]` by default
      }
    ],
    camelcase: "off",
    'no-tabs': 'off',
    "new-cap": ["error", { capIsNew: false }]
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
