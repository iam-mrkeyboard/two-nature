import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..', '..', '..', '..');
const imagesDir = path.join(rootDir, 'public', 'images');

export const GET: APIRoute = async ({ url }) => {
  try {
    const section = url.searchParams.get('section');
    const images: { url: string; name: string; section: string; size: number }[] = [];

    function scanDir(dir: string, relativePath: string) {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath, path.join(relativePath, entry.name));
        } else if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(entry.name)) {
          const stat = fs.statSync(fullPath);
          images.push({
            url: `/images/${relativePath}/${entry.name}`,
            name: entry.name,
            section: relativePath,
            size: stat.size,
          });
        }
      }
    }

    if (section) {
      const sectionDir = path.join(imagesDir, section);
      scanDir(sectionDir, section);
    } else {
      scanDir(imagesDir, '');
    }

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
