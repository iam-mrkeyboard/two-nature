import { createClient } from '@libsql/client';
import { verify } from '@node-rs/argon2';
import crypto from 'crypto';

export async function POST({ request, cookies }) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Username and password required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const db = createClient({ url: process.env.CMS_LIBSQL_URL || 'file:./twonature.db' });

    // Find user
    const users = await db.execute({
      sql: 'SELECT id, username, password FROM StudioCMSUsersTable WHERE username = ?',
      args: [username],
    });

    if (users.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = users.rows[0];

    // Verify password
    const isValid = await verify(user.password, password);
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create session
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await db.execute({
      sql: 'INSERT INTO StudioCMSSessionTable (id, userId, expiresAt) VALUES (?, ?, ?)',
      args: [sessionId, user.id, expiresAt],
    });

    // Set session cookie
    cookies.set('auth_session', sessionId, {
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
    });

    return new Response(JSON.stringify({ success: true, redirect: '/dashboard' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
