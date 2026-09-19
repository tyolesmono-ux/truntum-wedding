import { describe, it, expect } from 'vitest';
import { hashClientIp, extractClientIp } from '@/lib/security/ip';

describe('Client IP Extraction and Salted Hashing (src/lib/security/ip.ts)', () => {
  it('extracts the first IP from comma-separated x-forwarded-for header', () => {
    const headers = new Headers({
      'x-forwarded-for': '203.0.113.195, 70.41.3.18, 150.172.238.178',
    });

    const ip = extractClientIp(headers);
    expect(ip).toBe('203.0.113.195');
  });

  it('extracts IP from x-real-ip when x-forwarded-for is missing', () => {
    const headers = new Headers({
      'x-real-ip': '198.51.100.1',
    });

    const ip = extractClientIp(headers);
    expect(ip).toBe('198.51.100.1');
  });

  it('falls back to 127.0.0.1 when headers are empty', () => {
    const headers = new Headers();
    const ip = extractClientIp(headers);
    expect(ip).toBe('127.0.0.1');
  });

  it('generates a 64-character hex string hash with salt', () => {
    const hash = hashClientIp('203.0.113.195');
    expect(hash).toHaveLength(64);
    expect(/^[a-f0-9]{64}$/.test(hash)).toBe(true);
  });

  it('produces deterministic output for the same IP and salt', () => {
    const hash1 = hashClientIp('198.51.100.42');
    const hash2 = hashClientIp('198.51.100.42');
    expect(hash1).toBe(hash2);
  });

  it('produces distinct hashes for different IPs', () => {
    const hashA = hashClientIp('198.51.100.1');
    const hashB = hashClientIp('198.51.100.2');
    expect(hashA).not.toBe(hashB);
  });
});
