import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitRSVP } from '@/actions/submit-rsvp';
import * as supabaseServer from '@/lib/supabase/server';
import * as turnstile from '@/lib/security/turnstile';
import * as rateLimit from '@/lib/security/rate-limit';
import * as weddingData from '@/lib/config/wedding-data';

vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Headers({ 'x-forwarded-for': '127.0.0.1' })),
  cookies: vi.fn(() => ({
    getAll: () => [],
    set: () => {},
  })),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/lib/security/turnstile', () => ({
  verifyTurnstileToken: vi.fn(),
}));

vi.mock('@/lib/security/rate-limit', () => ({
  checkRateLimit: vi.fn(),
  resetRateLimitStore: vi.fn(),
}));

vi.mock('@/lib/config/wedding-data', () => ({
  EMERGENCY_FEATURE_FLAGS: {
    isGuestbookFormActive: true,
    isRealtimeBroadcastActive: true,
  },
  WEDDING_GIFT_CONFIG: {
    accounts: [],
    qris: { imageUrl: '', altText: '', merchantName: '' },
  },
}));

describe('Server Action: submitRSVP', () => {
  const mockInsert = vi.fn();
  const mockFrom = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (weddingData.EMERGENCY_FEATURE_FLAGS as { isGuestbookFormActive: boolean }).isGuestbookFormActive = true;

    mockInsert.mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'mock-uuid-1234',
            guest_name: 'Bpk. Hendra',
            attendance_status: 'attending',
            pax_count: 2,
            message: 'Selamat menempuh hidup baru!',
            created_at: '2026-09-19T20:00:00Z',
          },
          error: null,
        }),
      }),
    });

    mockFrom.mockReturnValue({
      insert: mockInsert,
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          gte: vi.fn().mockResolvedValue({ count: 0, error: null }),
        }),
      }),
    });

    vi.mocked(supabaseServer.createClient).mockResolvedValue({
      from: mockFrom,
    } as unknown as Awaited<ReturnType<typeof supabaseServer.createClient>>);

    vi.mocked(turnstile.verifyTurnstileToken).mockResolvedValue(true);
    vi.mocked(rateLimit.checkRateLimit).mockResolvedValue({ isAllowed: true, remaining: 2 });
  });

  describe('User Story 1: Valid RSVP Submissions & Validation', () => {
    it('successfully saves valid RSVP submission and returns data envelope without ip_hash', async () => {
      const payload = {
        guest_name: 'Bpk. Hendra',
        attendance_status: 'attending' as const,
        pax_count: 2,
        message: 'Selamat menempuh hidup baru!',
        turnstile_token: 'valid-token',
      };

      const response = await submitRSVP(payload);

      expect(response.success).toBe(true);
      if (response.success) {
        expect(response.data).toEqual({
          id: 'mock-uuid-1234',
          guest_name: 'Bpk. Hendra',
          attendance_status: 'attending',
          pax_count: 2,
          message: 'Selamat menempuh hidup baru!',
          created_at: '2026-09-19T20:00:00Z',
        });
        expect('ip_hash' in response.data).toBe(false);
      }

      expect(mockFrom).toHaveBeenCalledWith('rsvps');
      expect(mockInsert).toHaveBeenCalled();
    });

    it('successfully saves declined attendance status', async () => {
      mockInsert.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          single: vi.fn().mockResolvedValueOnce({
            data: {
              id: 'mock-uuid-5678',
              guest_name: 'Ibu Ratna',
              attendance_status: 'declined',
              pax_count: 1,
              message: 'Mohon maaf berhalangan hadir. Selamat berbahagia!',
              created_at: '2026-09-19T20:05:00Z',
            },
            error: null,
          }),
        }),
      });

      const payload = {
        guest_name: 'Ibu Ratna',
        attendance_status: 'declined' as const,
        pax_count: 1,
        message: 'Mohon maaf berhalangan hadir. Selamat berbahagia!',
        turnstile_token: 'valid-token',
      };

      const response = await submitRSVP(payload);

      expect(response.success).toBe(true);
      if (response.success) {
        expect(response.data.attendance_status).toBe('declined');
      }
    });

    it('returns VALIDATION_ERROR when guest_name is too short (< 2 chars)', async () => {
      const payload = {
        guest_name: 'A',
        attendance_status: 'attending' as const,
        pax_count: 1,
        message: 'Selamat ya!',
        turnstile_token: 'valid-token',
      };

      const response = await submitRSVP(payload);

      expect(response.success).toBe(false);
      if (!response.success) {
        expect(response.error).toBe('VALIDATION_ERROR');
        expect(response.details?.guest_name).toBeDefined();
      }
    });

    it('returns VALIDATION_ERROR when guest_name exceeds 60 chars', async () => {
      const payload = {
        guest_name: 'A'.repeat(61),
        attendance_status: 'attending' as const,
        pax_count: 1,
        message: 'Selamat berbahagia!',
        turnstile_token: 'valid-token',
      };

      const response = await submitRSVP(payload);

      expect(response.success).toBe(false);
      if (!response.success) {
        expect(response.error).toBe('VALIDATION_ERROR');
      }
    });

    it('returns VALIDATION_ERROR when pax_count is out of bounds (e.g. 0 or 6)', async () => {
      const payload = {
        guest_name: 'Dimas',
        attendance_status: 'attending' as const,
        pax_count: 6,
        message: 'Selamat ya!',
        turnstile_token: 'valid-token',
      };

      const response = await submitRSVP(payload);

      expect(response.success).toBe(false);
      if (!response.success) {
        expect(response.error).toBe('VALIDATION_ERROR');
        expect(response.details?.pax_count).toBeDefined();
      }
    });

    it('returns VALIDATION_ERROR when message is too short (< 3 chars)', async () => {
      const payload = {
        guest_name: 'Dimas',
        attendance_status: 'attending' as const,
        pax_count: 1,
        message: 'Ok',
        turnstile_token: 'valid-token',
      };

      const response = await submitRSVP(payload);

      expect(response.success).toBe(false);
      if (!response.success) {
        expect(response.error).toBe('VALIDATION_ERROR');
        expect(response.details?.message).toBeDefined();
      }
    });

    it('returns BOT_DETECTED when turnstile verification fails', async () => {
      vi.mocked(turnstile.verifyTurnstileToken).mockResolvedValueOnce(false);

      const payload = {
        guest_name: 'Bot User',
        attendance_status: 'attending' as const,
        pax_count: 1,
        message: 'Hello world spam message',
        turnstile_token: 'invalid-bot-token',
      };

      const response = await submitRSVP(payload);

      expect(response.success).toBe(false);
      if (!response.success) {
        expect(response.error).toBe('BOT_DETECTED');
      }
      expect(mockInsert).not.toHaveBeenCalled();
    });
  });

  describe('User Story 2: Anti-Phishing, Anti-XSS & Rate Limiting Integration', () => {
    it('returns LINKS_NOT_ALLOWED when message contains a URL', async () => {
      const payload = {
        guest_name: 'Spammer',
        attendance_status: 'attending' as const,
        pax_count: 1,
        message: 'Selamat! Cek hadiah di https://spam-link.xyz ya!',
        turnstile_token: 'valid-token',
      };

      const response = await submitRSVP(payload);

      expect(response.success).toBe(false);
      if (!response.success) {
        expect(response.error).toBe('LINKS_NOT_ALLOWED');
      }
      expect(mockInsert).not.toHaveBeenCalled();
    });

    it('returns RATE_LIMIT_EXCEEDED when checkRateLimit returns isAllowed: false', async () => {
      vi.mocked(rateLimit.checkRateLimit).mockResolvedValueOnce({ isAllowed: false, remaining: 0 });

      const payload = {
        guest_name: 'Flood User',
        attendance_status: 'attending' as const,
        pax_count: 1,
        message: 'Pesan keempat berturut-turut',
        turnstile_token: 'valid-token',
      };

      const response = await submitRSVP(payload);

      expect(response.success).toBe(false);
      if (!response.success) {
        expect(response.error).toBe('RATE_LIMIT_EXCEEDED');
      }
      expect(mockInsert).not.toHaveBeenCalled();
    });

    it('strips HTML tags before inserting into database and includes ip_hash in insert call', async () => {
      const payload = {
        guest_name: 'Ahmad',
        attendance_status: 'attending' as const,
        pax_count: 2,
        message: '<script>alert(1)</script><b>Barakallahu laka</b>',
        turnstile_token: 'valid-token',
      };

      await submitRSVP(payload);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Barakallahu laka',
          ip_hash: expect.stringMatching(/^[a-f0-9]{64}$/),
        })
      );
    });
  });

  describe('User Story 4: Emergency Incident Control / Kill Switch', () => {
    it('returns FORM_DISABLED immediately when isGuestbookFormActive is false without database call', async () => {
      (weddingData.EMERGENCY_FEATURE_FLAGS as { isGuestbookFormActive: boolean }).isGuestbookFormActive = false;

      const payload = {
        guest_name: 'Bpk. Hendra',
        attendance_status: 'attending' as const,
        pax_count: 2,
        message: 'Selamat menempuh hidup baru!',
        turnstile_token: 'valid-token',
      };

      const response = await submitRSVP(payload);

      expect(response.success).toBe(false);
      if (!response.success) {
        expect(response.error).toBe('FORM_DISABLED');
      }
      expect(mockInsert).not.toHaveBeenCalled();
    });
  });
});
