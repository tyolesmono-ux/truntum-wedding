import { describe, it, expect } from 'vitest';
import { sanitizeGuestMessage } from '@/lib/security/sanitize';

describe('Sanitization & Anti-Phishing Helper (sanitizeGuestMessage)', () => {
  it('accepts clean, polite wedding messages', () => {
    const message = 'Selamat menempuh hidup baru untuk kedua mempelai! Semoga sakinah mawaddah warahmah.';
    const result = sanitizeGuestMessage(message);

    expect(result.isValid).toBe(true);
    expect(result.sanitizedText).toBe(message);
    expect(result.errorMessage).toBeUndefined();
  });

  it('rejects messages containing https:// or http:// URLs', () => {
    const message = 'Kunjungi tautan kami di https://spam-link.example.com untuk hadiah!';
    const result = sanitizeGuestMessage(message);

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain('tautan');
  });

  it('rejects messages containing www. or domain extensions (.com, .org, .net, .id, .xyz, bit.ly, t.me)', () => {
    const urls = [
      'Silakan cek www.undangan-palsu.net',
      'Hubungi kami di t.me/botspam',
      'Dapatkan promo di bit.ly/promo-nikah',
      'Kunjungi situs.xyz sekarang',
      'Link di weddingku.id ya',
    ];

    urls.forEach((urlText) => {
      const result = sanitizeGuestMessage(urlText);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBeDefined();
    });
  });

  it('strips all HTML script and styling tags using DOMPurify without preserving markup', () => {
    const malicious = '<script>alert("XSS")</script><b>Selamat</b> ya <img src=x onerror="alert(1)">!';
    const result = sanitizeGuestMessage(malicious);

    expect(result.isValid).toBe(true);
    expect(result.sanitizedText).not.toContain('<script>');
    expect(result.sanitizedText).not.toContain('<b>');
    expect(result.sanitizedText).not.toContain('<img');
    expect(result.sanitizedText).toContain('Selamat ya !');
  });

  it('rejects message that becomes empty after HTML stripping', () => {
    const onlyTags = '<script></script><div></div>';
    const result = sanitizeGuestMessage(onlyTags);

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBeDefined();
  });
});
