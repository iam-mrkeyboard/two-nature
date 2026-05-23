import type { APIRoute } from 'astro';
import { listImages } from '../../../lib/storage';

export const GET: APIRoute = async ({ url, locals }) => {
  try {
    const section = url.searchParams.get('section') || undefined;
    const env = (locals as any).runtime.env;
    const images = await listImages(env, section);

    return new Response(JSON.stringify({ success: true, images }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('List images error:', error);
    return new Response(JSON.stringify({ error: 'Failed to list images' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
