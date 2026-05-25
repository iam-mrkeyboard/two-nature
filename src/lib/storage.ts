import fs from 'node:fs/promises';
import path from 'node:path';

const UPLOADS_DIR = process.env.UPLOADS_DIR || path.resolve(process.cwd(), 'uploads');

export async function uploadImage(file: File, section: string): Promise<string> {
  const ext = file.name.split('.').pop() || 'webp';
  const key = `${section}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const dest = path.join(UPLOADS_DIR, key);

  await fs.mkdir(path.dirname(dest), { recursive: true });
  const bytes = await file.arrayBuffer();
  await fs.writeFile(dest, Buffer.from(bytes));

  return `/uploads/${key}`;
}

export async function listImages(section?: string) {
  const dir = section ? path.join(UPLOADS_DIR, section) : UPLOADS_DIR;

  let files: string[];
  try {
    files = await fs.readdir(dir, { recursive: true });
  } catch {
    return [];
  }

  const objects = files
    .filter((f) => /\.(webp|png|jpg|jpeg|gif|svg|avif)$/i.test(f))
    .map((f) => {
      const relativePath = path.relative(UPLOADS_DIR, path.join(dir, f));
      return {
        url: `/uploads/${relativePath.replace(/\\/g, '/')}`,
        name: path.basename(f),
        section: section || 'uploads',
      };
    });

  return objects;
}