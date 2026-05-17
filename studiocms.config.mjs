import { defineStudioCMSConfig } from 'studiocms/config';
import html from '@studiocms/html';
import md from '@studiocms/md';

export default defineStudioCMSConfig({
  dbStartPage: false,
  toolbar: false,
  requireEmailVerification: false,
  features: {
    authConfig: {
      enabled: true,
      providers: {
        usernameAndPassword: true,
        usernameAndPasswordConfig: {
          allowUserRegistration: true,
        },
      },
    },
    developerConfig: {
      demoMode: {
        username: 'admin',
        password: 'admin123',
      },
    },
  },
  plugins: [
    html(),
    md(),
  ],
});
