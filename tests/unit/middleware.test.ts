import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';

describe('HTTP Security Middleware & CSP Directives (src/middleware.ts)', () => {
  it('attaches all mandatory security headers to outgoing responses', () => {
    const request = new NextRequest('https://luxury-wedding.example.com/');
    const response = middleware(request);

    // 1. Content Security Policy
    const csp = response.headers.get('Content-Security-Policy');
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain('https://challenges.cloudflare.com');
    expect(csp).toContain('https://fonts.googleapis.com');
    expect(csp).toContain('https://fonts.gstatic.com');
    expect(csp).toContain('https://*.supabase.co');
    expect(csp).toContain('wss://*.supabase.co');
    expect(csp).toContain("frame-ancestors 'none'");

    // 2. Anti-Clickjacking
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');

    // 3. Anti-MIME Sniffing
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');

    // 4. Referrer Policy
    expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');

    // 5. Permissions Policy
    expect(response.headers.get('Permissions-Policy')).toBe('camera=(), microphone=(), geolocation=(), interest-cohort=()');

    // 6. HSTS (2 Tahun)
    const hsts = response.headers.get('Strict-Transport-Security');
    expect(hsts).toContain('max-age=63072000');
    expect(hsts).toContain('includeSubDomains');
    expect(hsts).toContain('preload');
  });
});
