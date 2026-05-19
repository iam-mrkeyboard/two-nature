import { runSDK, SDKCoreJs } from 'studiocms:sdk';

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
    const page = await runSDK(SDKCoreJs.GET.page.bySlug(slug));

    if (!page || !page.defaultContent) {
      return new Response(JSON.stringify({ error: 'Section not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await runSDK(SDKCoreJs.UPDATE.pageContent({
      id: page.defaultContent.id,
      contentId: page.id,
      contentLang: 'en',
      content: JSON.stringify(data),
    }));

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
