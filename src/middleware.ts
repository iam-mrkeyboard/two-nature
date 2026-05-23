import type { MiddlewareHandler } from 'astro';

const exactPublicPaths = new Set([
  '/',
  '/admin/login',
  '/dashboard/login',
  '/dashboard/signup',
]);

const prefixPublicPaths = [
  '/images/',
  '/api/admin/login',
  '/api/admin/logout',
  '/studiocms_api/auth/',
];

export const onRequest: MiddlewareHandler = async (context, next) => {
  const url = new URL(context.request.url);
  const path = url.pathname;

  const isPublic = exactPublicPaths.has(path)
    || prefixPublicPaths.some(p => path.startsWith(p));

  if (isPublic) return next();

  if (!context.session) {
    return context.redirect('/admin/login');
  }

  const userId = await context.session.get('userId');

  if (!userId) {
    return context.redirect('/admin/login');
  }

  return next();
};
