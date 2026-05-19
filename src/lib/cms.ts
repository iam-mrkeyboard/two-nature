import { runSDK, SDKCoreJs } from 'studiocms:sdk';

export async function getSectionData<T>(slug: string, fallback: T): Promise<T> {
  try {
    const page = await runSDK(SDKCoreJs.GET.page.bySlug(slug));
    if (page?.defaultContent?.content) {
      return JSON.parse(page.defaultContent.content) as T;
    }
  } catch (err) {
    console.warn(`Failed to fetch section "${slug}", using fallback:`, err);
  }
  return fallback;
}

export async function getAllSections() {
  try {
    const pages = await runSDK(SDKCoreJs.GET.pages());
    const sections: Record<string, unknown> = {};
    for (const page of pages) {
      if (page.slug?.startsWith('section-') && page.defaultContent?.content) {
        sections[page.slug] = JSON.parse(page.defaultContent.content);
      }
    }
    return sections;
  } catch (err) {
    console.warn('Failed to fetch all sections:', err);
    return {};
  }
}
