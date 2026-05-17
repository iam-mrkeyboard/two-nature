import { createClient } from '@libsql/client';

export async function POST({ request, params }) {
  try {
    const slug = params.slug;
    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await request.json();
    const db = createClient({ url: process.env.CMS_LIBSQL_URL || 'file:./twonature.db' });

    // Get page ID
    const pageResult = await db.execute({
      sql: 'SELECT id, title FROM StudioCMSPageData WHERE slug = ?',
      args: [slug],
    });

    if (pageResult.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Section not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const pageId = pageResult.rows[0].id;
    const now = new Date().toISOString();

    // Update page data
    await db.execute({
      sql: 'UPDATE StudioCMSPageData SET title = ?, updatedAt = ? WHERE id = ?',
      args: [data.title || pageResult.rows[0].title, now, pageId],
    });

    // Update content
    await db.execute({
      sql: 'UPDATE StudioCMSPageContent SET content = ? WHERE contentId = ? AND contentLang = ?',
      args: [JSON.stringify(data), pageId, 'en'],
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update section error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
