import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Load env
const envPath = join(rootDir, '.env');
const envContent = readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach((line) => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) {
    process.env[key.trim()] = rest.join('=').trim();
  }
});

const dbUrl = process.env.CMS_LIBSQL_URL;
if (!dbUrl) {
  console.error('CMS_LIBSQL_URL not set in .env');
  process.exit(1);
}

const db = createClient({ url: dbUrl });

// Load section data
const sectionsData = JSON.parse(
  readFileSync(join(rootDir, 'src/data/sections.json'), 'utf-8')
);

const now = new Date().toISOString();
const systemUserId = 'system-admin';

async function seed() {
  console.log('Seeding StudioCMS pages...');

  // Ensure system user exists
  const userExists = await db.execute({
    sql: 'SELECT id FROM StudioCMSUsersTable WHERE id = ?',
    args: [systemUserId],
  });

  if (userExists.rows.length === 0) {
    await db.execute({
      sql: `INSERT INTO StudioCMSUsersTable (id, username, name, email, password, emailVerified, createdAt, updatedAt) 
            VALUES (?, 'systemadmin', 'System Admin', 'system@twonature.com', 'system', 1, ?, ?)`,
      args: [systemUserId, now, now],
    });
    console.log('  Created system user');
  }

  for (const [key, section] of Object.entries(sectionsData)) {
    const { slug, title, content } = section;
    const pageId = `page-${key}`;

    // Check if page already exists
    const existing = await db.execute({
      sql: 'SELECT id FROM StudioCMSPageData WHERE slug = ? AND package = ?',
      args: [slug, 'studiocms'],
    });

    if (existing.rows.length > 0) {
      // Update existing page
      await db.execute({
        sql: 'UPDATE StudioCMSPageData SET title = ?, description = ?, updatedAt = ? WHERE slug = ? AND package = ?',
        args: [title, `${title} content`, now, slug, 'studiocms'],
      });

      // Update content
      await db.execute({
        sql: 'UPDATE StudioCMSPageContent SET content = ? WHERE contentId = ? AND contentLang = ?',
        args: [content, pageId, 'en'],
      });
      console.log(`  Updated: ${slug}`);
    } else {
      // Insert new page
      await db.execute({
        sql: `INSERT INTO StudioCMSPageData 
          (id, package, title, description, showOnNav, publishedAt, updatedAt, slug, contentLang, 
           heroImage, categories, tags, authorId, contributorIds, showAuthor, showContributors, 
           parentFolder, draft, augments)
          VALUES (?, ?, ?, ?, 0, ?, ?, ?, 'en', '', '[]', '[]', ?, '[]', 0, 0, NULL, 1, '{}')`,
        args: [
          pageId,
          'studiocms',
          title,
          `${title} content`,
          now,
          now,
          slug,
          systemUserId,
        ],
      });

      // Insert content
      await db.execute({
        sql: 'INSERT INTO StudioCMSPageContent (id, contentId, contentLang, content) VALUES (?, ?, ?, ?)',
        args: [`${pageId}-content-en`, pageId, 'en', content],
      });
      console.log(`  Created: ${slug}`);
    }
  }

  console.log('\nSeeding complete!');
  console.log('You can now edit these pages in the StudioCMS dashboard at /dashboard');
}

seed().catch(console.error);
