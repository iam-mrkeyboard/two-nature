// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import studioCMS from 'studiocms';

// https://astro.build/config
export default defineConfig({
  site: 'http://localhost:4321/',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  session: {
    driver: {
      entrypoint: 'unstorage/drivers/fs',
      config: { base: './.sessions' },
    },
  },
  integrations: [
    studioCMS(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
