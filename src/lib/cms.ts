import { createClient } from '@libsql/client/web';
import type { ZodType } from 'zod';

const url = process.env.CMS_LIBSQL_URL || 'file:./twonature.db';
const authToken = process.env.TURSO_DB_AUTH_TOKEN;

const db = createClient(
  url.startsWith('libsql://')
    ? { url, authToken }
    : { url }
);

export async function getSectionData<T>(
  slug: string,
  fallback: T,
  schema?: ZodType<T>
): Promise<T> {
  try {
    const result = await db.execute({
      sql: `SELECT c.content FROM StudioCMSPageData p
            JOIN StudioCMSPageContent c ON p.id = c.contentId
            WHERE p.slug = ? AND c.contentLang = 'en'`,
      args: [slug],
    });

    const row = result.rows[0];
    if (!row || !row.content) return fallback;

    const parsed = JSON.parse(row.content as string);

    if (schema) {
      const validated = schema.safeParse(parsed);
      if (validated.success) return validated.data;
      console.warn(`Schema validation failed for "${slug}":`, validated.error);
      return fallback;
    }

    return parsed as T;
  } catch (err) {
    console.warn(`Failed to fetch section "${slug}", using fallback:`, err);
    return fallback;
  }
}

export async function getAllSections() {
  try {
    const result = await db.execute({
      sql: `SELECT p.slug, c.content FROM StudioCMSPageData p
            JOIN StudioCMSPageContent c ON p.id = c.contentId
            WHERE p.slug LIKE 'section-%' AND c.contentLang = 'en'`,
      args: [],
    });

    const sections: Record<string, unknown> = {};
    for (const row of result.rows) {
      if (row.slug && row.content) {
        sections[row.slug as string] = JSON.parse(row.content as string);
      }
    }
    return sections;
  } catch (err) {
    console.warn('Failed to fetch all sections:', err);
    return {};
  }
}
