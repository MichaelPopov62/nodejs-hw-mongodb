
import globals from 'globals';
import pluginJs from '@eslint/js';
import { defineConfig } from 'eslint/config';

export default  defineConfig ([
  pluginJs.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: { globals: globals.node },
    rules: {
	    semi: 'error',
	    'no-unused-vars': ['error', { args: 'none' }],
	    'no-undef': 'error'
	  },
  },
]);
