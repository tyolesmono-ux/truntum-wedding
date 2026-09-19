import { describe, it, expect } from 'vitest';
import { WEDDING_GIFT_CONFIG } from '@/lib/config/wedding-data';

describe('Immutable Financial Data Configuration (WEDDING_GIFT_CONFIG)', () => {
  it('defines valid official bank accounts for BCA and Bank Mandiri', () => {
    expect(WEDDING_GIFT_CONFIG.accounts).toBeDefined();
    expect(WEDDING_GIFT_CONFIG.accounts.length).toBeGreaterThanOrEqual(2);

    const bca = WEDDING_GIFT_CONFIG.accounts.find((acc) => acc.bankName.includes('BCA'));
    expect(bca).toBeDefined();
    expect(bca?.accountNumber).toBeDefined();
    expect(bca?.accountHolder).toBeDefined();
    expect(bca?.copyPayload).toBe(bca?.accountNumber);

    const mandiri = WEDDING_GIFT_CONFIG.accounts.find((acc) => acc.bankName.includes('Mandiri'));
    expect(mandiri).toBeDefined();
    expect(mandiri?.accountNumber).toBeDefined();
    expect(mandiri?.accountHolder).toBeDefined();
    expect(mandiri?.copyPayload).toBe(mandiri?.accountNumber);
  });

  it('defines valid official QRIS configuration with local image asset', () => {
    expect(WEDDING_GIFT_CONFIG.qris).toBeDefined();
    expect(WEDDING_GIFT_CONFIG.qris.imageUrl).toMatch(/^\/images\/gift\/.*\.webp$/);
    expect(WEDDING_GIFT_CONFIG.qris.altText).toBeDefined();
    expect(WEDDING_GIFT_CONFIG.qris.merchantName).toBeDefined();
  });

  it('is deeply immutable and cannot be mutated at runtime', () => {
    // TypeScript readonly / as const protection check
    expect(Object.isFrozen(WEDDING_GIFT_CONFIG)).toBe(true);
    expect(Object.isFrozen(WEDDING_GIFT_CONFIG.accounts)).toBe(true);
    expect(Object.isFrozen(WEDDING_GIFT_CONFIG.qris)).toBe(true);
  });
});
