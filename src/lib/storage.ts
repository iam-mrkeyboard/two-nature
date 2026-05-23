import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

const accountId = process.env.R2_ACCOUNT_ID || '';
const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
const bucket = process.env.R2_BUCKET_NAME || 'two-nature-uploads';
const publicUrl = process.env.R2_PUBLIC_URL || '';

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

export async function uploadImage(file: File, section: string): Promise<string> {
  const ext = file.name.split('.').pop() || 'webp';
  const key = `${section}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  await S3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: bytes,
    ContentType: file.type || `image/${ext}`,
  }));

  return publicUrl
    ? `${publicUrl}/${key}`
    : `https://${bucket}.${accountId}.r2.dev/${key}`;
}

export async function listImages(section?: string) {
  const result = await S3.send(new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: section ? `${section}/` : undefined,
  }));

  return (result.Contents || []).map((obj) => ({
    url: publicUrl
      ? `${publicUrl}/${obj.Key}`
      : `https://${bucket}.${accountId}.r2.dev/${obj.Key}`,
    name: (obj.Key || '').split('/').pop() || '',
    section: (obj.Key || '').split('/')[0] || '',
    size: obj.Size || 0,
  }));
}
