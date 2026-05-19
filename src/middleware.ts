import type { MiddlewareHandler } from 'astro';

const publicPaths = [
  '/',
  '/images/',
  '/admin/login',
  '/api/admin/login',
  '/api/admin/logout',
  '/studiocms_api/auth/login',
  '/studiocms_api/auth/register',
  '/dashboard',
  '/dashboard/login',
  '/dashboard/signup',
];

export const onRequest: MiddlewareHandler = async (context, next) => {
  const url = new URL(context.request.url);
  const path = url.pathname;

  if (publicPaths.some(p => path.startsWith(p))) {
    return next();
  }

  const userId = await context.session.get('userId');

  if (!userId) {
    return context.redirect('/admin/login');
  }

  return next();
};
