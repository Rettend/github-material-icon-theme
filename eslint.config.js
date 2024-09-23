import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-console': 'warn',
  },
  ignores: ['**/download'], // does not work .-.
})
