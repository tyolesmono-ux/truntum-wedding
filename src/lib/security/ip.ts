import crypto from 'crypto';

/**
 * Mengekstrak alamat IP klien dari request headers Next.js.
 * Membaca elemen pertama dari x-forwarded-for atau x-real-ip dengan fallback 127.0.0.1.
 */
export function extractClientIp(headers: Headers): string {
  return (
    headers.get('cf-connecting-ip')?.trim() ||
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip')?.trim() ||
    '127.0.0.1'
  );
}

/**
 * Menghasilkan hash SHA-256 tersalt dari alamat IP klien untuk melindungi privasi.
 * Menghasilkan 64 karakter hex string yang tidak dapat dibalik.
 */
export function hashClientIp(ip: string): string {
  const salt = process.env.IP_SALT_SECRET || 'default-secret-salt-key-for-ip-hashing';
  return crypto.createHash('sha256').update(`${ip}:${salt}`).digest('hex');
}
