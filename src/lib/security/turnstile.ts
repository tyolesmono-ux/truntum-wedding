/**
 * Cloudflare Turnstile Token Verification Helper
 * Verifies Turnstile CAPTCHA response server-to-server.
 */
export async function verifyTurnstileToken(token: string, ip?: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    return false;
  }

  // Cloudflare official test dummy key or test environment bypass for deterministic offline testing
  if (secretKey === '1x0000000000000000000000000000000AA') {
    return Boolean(token && token.trim().length > 0);
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (ip) {
      formData.append('remoteip', ip);
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (!res.ok) {
      return false;
    }

    const data = await res.json();
    return Boolean(data.success);
  } catch {
    return false;
  }
}
