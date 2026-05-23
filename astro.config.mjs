// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import studioCMS from 'studiocms';

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
    ssr: {
      external: ['@node-rs/argon2'],
    },
  },
});
