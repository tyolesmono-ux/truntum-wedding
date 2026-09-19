interface RateLimitRecord {
  count: number;
  expiresAt: number;
}

const WINDOW_MS = 10 * 60 * 1000; // 10 menit
const MAX_SUBMISSIONS = 3;

// In-memory store untuk rapid rejection (0 ms)
const rateLimitStore = new Map<string, RateLimitRecord>();

export interface RateLimitStatus {
  isAllowed: boolean;
  remaining: number;
}

/**
 * Mengevaluasi batas laju pengiriman form per IP hash.
 * Menggabungkan Layer 1 (In-Memory sliding window) dan Layer 2 (Database count query fallback).
 */
export async function checkRateLimit(
  ipHash: string,
  dbFallbackCheck?: (ipHash: string) => Promise<number>
): Promise<RateLimitStatus> {
  const now = Date.now();
  const existing = rateLimitStore.get(ipHash);

  // 1. Cek Record In-Memory
  if (existing) {
    if (existing.expiresAt <= now) {
      rateLimitStore.delete(ipHash);
    } else if (existing.count >= MAX_SUBMISSIONS) {
      return {
        isAllowed: false,
        remaining: 0,
      };
    }
  }

  // 2. Evaluasi Layer 2 (Database Count Query Fallback jika ada)
  if (dbFallbackCheck) {
    try {
      const dbRecentCount = await dbFallbackCheck(ipHash);
      if (dbRecentCount >= MAX_SUBMISSIONS) {
        return {
          isAllowed: false,
          remaining: 0,
        };
      }
    } catch {
      // Jika terjadi error pada fallback DB, tetap prioritaskan perlindungan in-memory
    }
  }

  // 3. Catat dan Tambah Counter
  const currentRecord = rateLimitStore.get(ipHash);
  if (!currentRecord || currentRecord.expiresAt <= now) {
    rateLimitStore.set(ipHash, {
      count: 1,
      expiresAt: now + WINDOW_MS,
    });
    return {
      isAllowed: true,
      remaining: MAX_SUBMISSIONS - 1,
    };
  }

  currentRecord.count += 1;
  const remaining = Math.max(0, MAX_SUBMISSIONS - currentRecord.count);

  return {
    isAllowed: true,
    remaining,
  };
}

/**
 * Mereset in-memory store (khusus untuk pengujian / test teardown).
 */
export function resetRateLimitStore(): void {
  rateLimitStore.clear();
}
