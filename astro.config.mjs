// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import studioCMS from 'studiocms';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: 'https://twonature.com',
  output: 'server',
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  integrations: [
    studioCMS(),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@node-rs/argon2': path.resolve(__dirname, 'src/stubs/argon2.ts'),
      },
    },
  },
});
