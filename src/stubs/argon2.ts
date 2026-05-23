// Stub for @node-rs/argon2 — native addon not available on Cloudflare Workers.
// StudioCMS auth is disabled so these are never invoked at runtime.

export async function hash(password: string): Promise<string> {
  console.warn('argon2 stub: hash() called but auth is disabled');
  return password;
}

export async function verify(hash: string, password: string): Promise<boolean> {
  console.warn('argon2 stub: verify() called but auth is disabled');
  return false;
}
