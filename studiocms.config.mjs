import { defineStudioCMSConfig } from 'studiocms/config';
import html from '@studiocms/html';
import md from '@studiocms/md';

export default defineStudioCMSConfig({
  dbStartPage: false,
  plugins: [
    html(),
    md(),
  ],
});
