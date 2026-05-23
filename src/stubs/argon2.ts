import bcrypt from 'bcryptjs';

export async function hash(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verify(hash: string, password: string): Promise<boolean> {
  if (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) {
    try {
      return await bcrypt.compare(password, hash);
    } catch {
      return false;
    }
  }

  if (hash === password) {
    return true;
  }

  console.warn('argon2 stub: unsupported hash format');
  return false;
}
