interface R2Env {
  R2_BUCKET: R2Bucket;
  R2_PUBLIC_URL?: string;
}

function getPublicUrl(env: R2Env, key: string): string {
  return env.R2_PUBLIC_URL
    ? `${env.R2_PUBLIC_URL}/${key}`
    : `/images/${key}`;
}

export async function uploadImage(file: File, section: string, env: R2Env): Promise<string> {
  const ext = file.name.split('.').pop() || 'webp';
  const key = `${section}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  await env.R2_BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || `image/${ext}` },
  });

  return getPublicUrl(env, key);
}

export async function listImages(env: R2Env, section?: string) {
  const list = await env.R2_BUCKET.list({
    prefix: section ? `${section}/` : undefined,
  });

  return list.objects.map((obj) => ({
    url: getPublicUrl(env, obj.key),
    name: obj.key.split('/').pop() || '',
    section: obj.key.split('/')[0] || '',
    size: obj.size,
  }));
}
