import { createClient } from '@libsql/client';
import type { MiddlewareHandler } from 'astro';

const publicPaths = [
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

  // Allow public paths
  if (publicPaths.some(p => path.startsWith(p))) {
    return next();
  }

  // Check session
  const sessionId = context.cookies.get('auth_session')?.value;

  if (!sessionId) {
    return context.redirect('/admin/login');
  }

  // Validate session
  const db = createClient({ url: process.env.CMS_LIBSQL_URL || 'file:./twonature.db' });
  const session = await db.execute({
    sql: 'SELECT userId, expiresAt FROM StudioCMSSessionTable WHERE id = ?',
    args: [sessionId],
  });

  if (session.rows.length === 0) {
    return context.redirect('/admin/login');
  }

  const expiresAt = new Date(session.rows[0].expiresAt as string);
  if (expiresAt < new Date()) {
    return context.redirect('/admin/login');
  }

  return next();
};
