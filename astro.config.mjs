// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import studioCMS from 'studiocms';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: 'https://twonature.com',
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  markdown: {
    syntaxHighlight: false,
  },
  integrations: [
    studioCMS(),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: [
        { find: '@node-rs/argon2', replacement: path.resolve(__dirname, 'src/stubs/argon2.ts') },
        { find: 'mysql2', replacement: path.resolve(__dirname, 'src/stubs/empty.ts') },
        { find: 'pg', replacement: path.resolve(__dirname, 'src/stubs/empty.ts') },
        { find: /^shiki$/, replacement: path.resolve(__dirname, 'src/stubs/shiki-stub.ts') },
        { find: /^shiki\/(.*)/, replacement: path.resolve(__dirname, 'src/stubs/shiki-stub.ts') },
        { find: /^@shikijs\/core/, replacement: path.resolve(__dirname, 'src/stubs/shiki-stub.ts') },
        { find: /^@shikijs\/langs/, replacement: path.resolve(__dirname, 'src/stubs/shiki-stub.ts') },
        { find: /^@shikijs\/langs\//, replacement: path.resolve(__dirname, 'src/stubs/shiki-stub.ts') },
        { find: /^@shikijs\/themes/, replacement: path.resolve(__dirname, 'src/stubs/shiki-stub.ts') },
        { find: /^@shikijs\/engine-oniguruma/, replacement: path.resolve(__dirname, 'src/stubs/shiki-stub.ts') },
        { find: /^@shikijs\/engine-javascript/, replacement: path.resolve(__dirname, 'src/stubs/shiki-stub.ts') },
        { find: /^@shikijs\/types/, replacement: path.resolve(__dirname, 'src/stubs/empty.ts') },
        { find: /^@shikijs\/vscode-textmate/, replacement: path.resolve(__dirname, 'src/stubs/empty.ts') },
        { find: /^@shikijs\/primitive/, replacement: path.resolve(__dirname, 'src/stubs/empty.ts') },
      ],
    },
  },
});
