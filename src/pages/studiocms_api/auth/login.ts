import type { APIRoute } from 'astro';
import { verify } from '@node-rs/argon2';
import { runSDK, SDKCoreJs } from 'studiocms:sdk';

export const POST: APIRoute = async ({ request, session }) => {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Username and password required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = await runSDK(SDKCoreJs.GET.users.byUsername(username));

    if (!user || !user.password) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const isValid = await verify(user.password, password);
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!session) {
      return new Response(JSON.stringify({ error: 'Session unavailable' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    session.set('userId', user.id);
    session.set('username', user.username);

    return new Response(JSON.stringify({ success: true, redirect: '/admin' }), {
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
