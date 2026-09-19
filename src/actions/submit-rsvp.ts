'use server';

import { headers } from 'next/headers';
import { rsvpSchema, type RSVPInput, type ActionResponse, type RSVPRecordOutput } from '@/lib/validations/rsvp-schema';
import { createClient } from '@/lib/supabase/server';
import { verifyTurnstileToken } from '@/lib/security/turnstile';
import { extractClientIp, hashClientIp } from '@/lib/security/ip';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { sanitizeGuestMessage } from '@/lib/security/sanitize';
import { EMERGENCY_FEATURE_FLAGS } from '@/lib/config/wedding-data';

/**
 * Server Action: submitRSVP
 * Memproses dan menyimpan konfirmasi kehadiran serta doa restu tamu undangan
 * dengan perlindungan anti-bot, anti-spam, anti-phishing, pembatasan laju (rate limit),
 * dan pemutus darurat (emergency kill switch).
 */
export async function submitRSVP(input: RSVPInput): Promise<ActionResponse<RSVPRecordOutput>> {
  // 1. Sakelar Pemutus Darurat (Emergency Kill Switch Perimeter)
  if (!EMERGENCY_FEATURE_FLAGS.isGuestbookFormActive) {
    return {
      success: false,
      error: 'FORM_DISABLED',
    };
  }

  // 2. Ekstraksi IP Klien & Pembuatan Hash SHA-256 Tersalt
  const reqHeaders = await headers();
  const clientIp = extractClientIp(reqHeaders);
  const ipHash = hashClientIp(clientIp);

  // 3. Evaluasi Batas Laju Pengiriman (Rate Limiting: Max 3 submissions / 10 menit)
  const rateLimitStatus = await checkRateLimit(ipHash, async (hash) => {
    try {
      const supabase = await createClient();
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const { count, error } = await supabase
        .from('rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('ip_hash', hash)
        .gte('created_at', tenMinutesAgo);

      if (error || count === null) return 0;
      return count;
    } catch {
      return 0;
    }
  });

  if (!rateLimitStatus.isAllowed) {
    return {
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
    };
  }

  // 4. Validasi Skema Zod
  const validationResult = rsvpSchema.safeParse(input);
  if (!validationResult.success) {
    return {
      success: false,
      error: 'VALIDATION_ERROR',
      details: validationResult.error.flatten().fieldErrors,
    };
  }

  const { guest_name, attendance_status, pax_count, message, turnstile_token } = validationResult.data;

  // 5. Verifikasi Keamanan Cloudflare Turnstile
  const isHuman = await verifyTurnstileToken(turnstile_token, clientIp);
  if (!isHuman) {
    return {
      success: false,
      error: 'BOT_DETECTED',
    };
  }

  // 6. Sanitasi Input & Deteksi Pola Tautan / Phishing
  const sanitizeResult = sanitizeGuestMessage(message);
  if (!sanitizeResult.isValid) {
    const isLinkError = sanitizeResult.errorMessage?.includes('tautan');
    return {
      success: false,
      error: isLinkError ? 'LINKS_NOT_ALLOWED' : 'VALIDATION_ERROR',
    };
  }

  const sanitizedMessage = sanitizeResult.sanitizedText;

  // 7. Persistensi ke Basis Data PostgreSQL via Supabase Server Client
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('rsvps')
      .insert({
        guest_name,
        attendance_status,
        pax_count,
        message: sanitizedMessage,
        ip_hash: ipHash,
      })
      .select('id, guest_name, attendance_status, pax_count, message, created_at')
      .single();

    if (error || !data) {
      return {
        success: false,
        error: 'DATABASE_ERROR',
      };
    }

    return {
      success: true,
      data: data as RSVPRecordOutput,
    };
  } catch {
    return {
      success: false,
      error: 'DATABASE_ERROR',
    };
  }
}
