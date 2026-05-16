import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';
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
const password = 'admin123'; // Change this after first login!

async function createAdminUser() {
  console.log('Creating admin user...');
  console.log(`Username: ${username}`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log('');

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Password hashed successfully');

  const now = new Date().toISOString();
  const userId = `user-${Date.now()}`;

  // Check if user already exists
  const existing = await db.execute({
    sql: 'SELECT id FROM StudioCMSUsersTable WHERE username = ? OR email = ?',
    args: [username, email],
  });

  if (existing.rows.length > 0) {
    console.log('User already exists, updating...');
    await db.execute({
      sql: 'UPDATE StudioCMSUsersTable SET password = ?, updatedAt = ? WHERE id = ?',
      args: [hashedPassword, now, existing.rows[0].id],
    });
    console.log('User updated successfully!');
  } else {
    // Insert new user
    await db.execute({
      sql: `INSERT INTO StudioCMSUsersTable 
        (id, username, name, email, password, emailVerified, createdAt, updatedAt) 
        VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
      args: [userId, username, displayName, email, hashedPassword, now, now],
    });
    console.log('User created successfully!');
  }

  console.log('');
  console.log('=== Login Credentials ===');
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);
  console.log('');
  console.log('Go to http://localhost:4321/dashboard/login and use these credentials.');
  console.log('IMPORTANT: Change the password after your first login!');
}

createAdminUser().catch(console.error);
