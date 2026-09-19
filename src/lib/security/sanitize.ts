import DOMPurify from 'isomorphic-dompurify';

const URL_PATTERN = /(https?:\/\/|www\.|\.com|\.org|\.net|\.id|\.xyz|bit\.ly|t\.me)/i;

export interface SanitizeResult {
  isValid: boolean;
  sanitizedText: string;
  errorMessage?: string;
}

/**
 * Memvalidasi dan membersihkan teks pesan ucapan doa restu tamu.
 * Menolak pesan yang mengandung tautan URL dan melucuti seluruh tag HTML/XSS.
 */
export function sanitizeGuestMessage(rawMessage: string): SanitizeResult {
  const trimmed = rawMessage.trim();

  // 1. Deteksi Pola Tautan / Link Phishing
  if (URL_PATTERN.test(trimmed)) {
    return {
      isValid: false,
      sanitizedText: '',
      errorMessage: 'Pesan doa restu tidak diperkenankan memuat tautan atau link website.',
    };
  }

  // 2. Pembersihan Tag HTML & XSS Payload via DOMPurify
  const cleaned = DOMPurify.sanitize(trimmed, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  }).trim();

  if (cleaned.length === 0) {
    return {
      isValid: false,
      sanitizedText: '',
      errorMessage: 'Pesan tidak boleh kosong setelah pembersihan konten.',
    };
  }

  return {
    isValid: true,
    sanitizedText: cleaned,
  };
}
