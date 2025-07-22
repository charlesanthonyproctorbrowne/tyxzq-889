import { defineConfig } from 'orval';

const workspace = '../apps/webapp/src/lib/api';

export default defineConfig({
  'connex-api-client': {
    input: '../tmp/schema.json',
    output: {
      client: 'react-query',
      mock: true,
      clean: true,
      mode: 'single',
      override: {
        mock: {
          delay: false,
          baseUrl: '*:3333',
        },
        operations: {},
      },
      prettier: true,
      target: 'actions.ts',
      workspace,
      // baseUrl: 'localhost:3333',
    },
  },
});
