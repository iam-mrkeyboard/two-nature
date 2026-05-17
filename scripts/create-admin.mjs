import { createClient } from '@libsql/client';
import { hash } from '@node-rs/argon2';
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

// Admin user credentials
const username = 'admin';
const email = 'admin@twonature.com';
const displayName = 'Admin User';
const password = 'admin123';

async function createAdminUser() {
  console.log('Creating admin user with argon2 hashing...');
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);
  console.log('');

  // Hash password with argon2 (StudioCMS default)
  const hashedPassword = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  console.log('Password hashed with argon2');

  const now = new Date().toISOString();
  const userId = `user-${Date.now()}`;

  // Remove existing admin user if exists
  await db.execute({
    sql: 'DELETE FROM StudioCMSUsersTable WHERE username = ? OR email = ?',
    args: [username, email],
  });

  // Insert new user
  await db.execute({
    sql: `INSERT INTO StudioCMSUsersTable 
      (id, username, name, email, password, emailVerified, createdAt, updatedAt) 
      VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
    args: [userId, username, displayName, email, hashedPassword, now, now],
  });
  console.log('User created successfully!');

  console.log('');
  console.log('=== Login Credentials ===');
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);
  console.log('');
  console.log('Go to http://localhost:4321/dashboard/login and use these credentials.');
}

createAdminUser().catch(console.error);
