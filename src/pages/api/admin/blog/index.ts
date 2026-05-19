import type { APIRoute } from 'astro';
import { runSDK, SDKCoreJs } from 'studiocms:sdk';
import { createClient } from '@libsql/client';

const db = createClient({ url: process.env.CMS_LIBSQL_URL || 'file:./twonature.db' });

export const GET: APIRoute = async () => {
  try {
    const pages = await runSDK(SDKCoreJs.GET.pages());
    const blogPosts = pages.filter((p: { slug: string }) => p.slug?.startsWith('blog-') && p.slug !== 'blog');

    return new Response(JSON.stringify({ success: true, posts: blogPosts }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('List blog posts error:', error);
    return new Response(JSON.stringify({ error: 'Failed to list blog posts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const slug = `blog-${body.slug || Date.now().toString(36)}`;
    const now = new Date().toISOString();
    const pageId = `page-${slug}`;
    const authorId = 'system-admin';

    await db.execute({
      sql: `INSERT INTO StudioCMSPageData 
        (id, package, title, description, showOnNav, publishedAt, updatedAt, slug, contentLang, 
         heroImage, categories, tags, authorId, contributorIds, showAuthor, showContributors, 
         parentFolder, draft, augments)
        VALUES (?, ?, ?, ?, 0, ?, ?, ?, 'en', ?, '[]', '[]', ?, '[]', 1, 0, NULL, ?, '{}')`,
      args: [
        pageId,
        'studiocms',
        body.title || 'Untitled Post',
        body.description || '',
        now,
        now,
        slug,
        body.heroImage || '',
        authorId,
        body.draft ?? true,
      ],
    });

    await db.execute({
      sql: 'INSERT INTO StudioCMSPageContent (id, contentId, contentLang, content) VALUES (?, ?, ?, ?)',
      args: [`${pageId}-content-en`, pageId, 'en', JSON.stringify(body.content || {})],
    });

    return new Response(JSON.stringify({ success: true, slug }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Create blog post error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create blog post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
