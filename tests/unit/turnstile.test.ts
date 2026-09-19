import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { verifyTurnstileToken } from '@/lib/security/turnstile';

describe('Cloudflare Turnstile Verification Helper (verifyTurnstileToken)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns true when given a valid test token or in test environment with test secret', async () => {
    process.env.TURNSTILE_SECRET_KEY = '1x0000000000000000000000000000000AA';
    const isValid = await verifyTurnstileToken('valid-test-token', '127.0.0.1');
    expect(isValid).toBe(true);
  });

  it('returns false when secret key is missing', async () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    const isValid = await verifyTurnstileToken('some-token');
    expect(isValid).toBe(false);
  });

  it('returns false when Cloudflare siteverify endpoint returns success: false', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'real-secret-key';
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false, 'error-codes': ['invalid-input-response'] }),
    } as Response);

    const isValid = await verifyTurnstileToken('invalid-token');
    expect(isValid).toBe(false);
  });

  it('returns false when fetch encounters a network or timeout error', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'real-secret-key';
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

    const isValid = await verifyTurnstileToken('some-token');
    expect(isValid).toBe(false);
  });
});
