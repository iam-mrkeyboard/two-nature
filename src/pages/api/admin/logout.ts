import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ session, redirect }) => {
  if (!session) return redirect('/admin/login');
  session.destroy();
  return redirect('/admin/login');
};
