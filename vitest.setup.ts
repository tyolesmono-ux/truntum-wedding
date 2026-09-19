import '@testing-library/jest-dom/vitest';

// Default mock environment variables for unit testing
process.env.IP_SALT_SECRET = process.env.IP_SALT_SECRET || 'test-salt-secret-key-32-chars-long';
process.env.TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';
process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';
