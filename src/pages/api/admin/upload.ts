import type { APIRoute } from 'astro';
import { uploadImage } from '../../../lib/storage';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const section = (formData.get('section') as string) || 'uploads';

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const env = (locals as any).runtime.env;
    const url = await uploadImage(file, section, env);

    return new Response(JSON.stringify({ success: true, url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ error: 'Upload failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
