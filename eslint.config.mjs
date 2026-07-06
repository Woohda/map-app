import antfu from '@antfu/eslint-config';

// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  antfu(
    {
      type: 'app',
      vue: true,
      typescript: true,
      formatters: true,
      stylistic: {
        indent: 2,
        semi: true,
        quotes: 'single',
      },
    },
    {
      rules: {
        'ts/no-redeclare': 'off',
        'no-console': ['warn'],
        'antfu/no-top-level-await': ['off'],
        'node/prefer-global/process': ['off'],
        'node/no-process-env': ['error'],
        'perfectionist/sort-imports': [
          'error',
          {
            tsconfigRootDir: '.',
          },
        ],
        'vue/no-multiple-template-root': ['off'],
        'unicorn/filename-case': [
          'error',
          {
            cases: {
              kebabCase: true,
              pascalCase: true,
              camelCase: true,
            },
            ignore: ['README.md', 'migration_lock.toml'],
          },
        ],
      },
    },
  ),
);
