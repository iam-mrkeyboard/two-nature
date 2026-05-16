import { createClient } from '@libsql/client';

let dbClient: ReturnType<typeof createClient> | null = null;

function getDb() {
  if (!dbClient) {
    const url = process.env.CMS_LIBSQL_URL || 'file:./twonature.db';
    dbClient = createClient({ url });
  }
  return dbClient;
}

export async function getSectionData<T>(slug: string, fallback: T): Promise<T> {
  try {
    const db = getDb();
    const result = await db.execute({
      sql: `
        SELECT pc.content 
        FROM StudioCMSPageData pd
        JOIN StudioCMSPageContent pc ON pd.id = pc.contentId
        WHERE pd.slug = ? AND pc.contentLang = 'en'
      `,
      args: [slug],
    });

    if (result.rows.length > 0) {
      return JSON.parse(result.rows[0].content as string) as T;
    }
  } catch (err) {
    console.warn(`Failed to fetch section "${slug}", using fallback:`, err);
  }
  return fallback;
}

export async function getAllSections() {
  try {
    const db = getDb();
    const result = await db.execute({
      sql: `
        SELECT pd.slug, pd.title, pc.content 
        FROM StudioCMSPageData pd
        JOIN StudioCMSPageContent pc ON pd.id = pc.contentId
        WHERE pd.package = 'studiocms' AND pc.contentLang = 'en'
        AND pd.slug LIKE 'section-%'
      `,
      args: [],
    });

    const sections: Record<string, unknown> = {};
    for (const row of result.rows) {
      const slug = row.slug as string;
      sections[slug] = JSON.parse(row.content as string);
    }
    return sections;
  } catch (err) {
    console.warn('Failed to fetch all sections:', err);
    return {};
  }
}
