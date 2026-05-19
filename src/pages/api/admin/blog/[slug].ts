import type { APIRoute } from 'astro';
import { createClient } from '@libsql/client';

const db = createClient({ url: process.env.CMS_LIBSQL_URL || 'file:./twonature.db' });

export const POST: APIRoute = async ({ request, params }) => {
  try {
    const slug = params.slug;
    if (!slug) {
      return new Response(JSON.stringify({ error: 'Missing slug' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const now = new Date().toISOString();
    const pageId = `page-${slug}`;

    await db.execute({
      sql: 'UPDATE StudioCMSPageData SET title = ?, description = ?, heroImage = ?, draft = ?, updatedAt = ? WHERE slug = ?',
      args: [body.title, body.description, body.heroImage, body.draft ?? false, now, slug],
    });

    await db.execute({
      sql: 'UPDATE StudioCMSPageContent SET content = ? WHERE contentId = ? AND contentLang = ?',
      args: [JSON.stringify(body.content || {}), pageId, 'en'],
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update blog post error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update blog post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const slug = params.slug;
    if (!slug) {
      return new Response(JSON.stringify({ error: 'Missing slug' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const pageId = `page-${slug}`;

    await db.execute({
      sql: 'DELETE FROM StudioCMSPageContent WHERE contentId = ?',
      args: [pageId],
    });

    await db.execute({
      sql: 'DELETE FROM StudioCMSPageData WHERE slug = ?',
      args: [slug],
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Delete blog post error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete blog post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
