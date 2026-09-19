import { describe, it, expect, beforeEach, vi } from 'vitest';
import { checkRateLimit, resetRateLimitStore } from '@/lib/security/rate-limit';

describe('Sliding-Window Rate Limiter (src/lib/security/rate-limit.ts)', () => {
  beforeEach(() => {
    resetRateLimitStore();
    vi.useRealTimers();
  });

  it('allows up to 3 submissions within a 10-minute window', async () => {
    const ipHash = 'mock-ip-hash-1111';

    const first = await checkRateLimit(ipHash);
    expect(first.isAllowed).toBe(true);
    expect(first.remaining).toBe(2);

    const second = await checkRateLimit(ipHash);
    expect(second.isAllowed).toBe(true);
    expect(second.remaining).toBe(1);

    const third = await checkRateLimit(ipHash);
    expect(third.isAllowed).toBe(true);
    expect(third.remaining).toBe(0);

    // 4th request must be blocked
    const fourth = await checkRateLimit(ipHash);
    expect(fourth.isAllowed).toBe(false);
    expect(fourth.remaining).toBe(0);
  });

  it('maintains independent rate limits for different IP hashes', async () => {
    const ipA = 'mock-ip-user-a';
    const ipB = 'mock-ip-user-b';

    // User A exhausts quota
    await checkRateLimit(ipA);
    await checkRateLimit(ipA);
    await checkRateLimit(ipA);
    const userABlocked = await checkRateLimit(ipA);
    expect(userABlocked.isAllowed).toBe(false);

    // User B still has full quota
    const userBFirst = await checkRateLimit(ipB);
    expect(userBFirst.isAllowed).toBe(true);
    expect(userBFirst.remaining).toBe(2);
  });

  it('resets quota after 10-minute window expires', async () => {
    vi.useFakeTimers();
    const ipHash = 'mock-ip-hash-timer';

    await checkRateLimit(ipHash);
    await checkRateLimit(ipHash);
    await checkRateLimit(ipHash);
    expect((await checkRateLimit(ipHash)).isAllowed).toBe(false);

    // Advance time by 10 minutes + 1 second (601,000 ms)
    vi.advanceTimersByTime(10 * 60 * 1000 + 1000);

    const afterWindow = await checkRateLimit(ipHash);
    expect(afterWindow.isAllowed).toBe(true);
    expect(afterWindow.remaining).toBe(2);
  });

  it('rejects if database fallback reports 3 or more recent submissions', async () => {
    const ipHash = 'mock-ip-hash-db-test';
    const mockDbQuery = vi.fn().mockResolvedValue(3);

    const result = await checkRateLimit(ipHash, mockDbQuery);
    expect(result.isAllowed).toBe(false);
    expect(mockDbQuery).toHaveBeenCalledWith(ipHash);
  });
});
