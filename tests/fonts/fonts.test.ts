import { describe, it, expect, vi } from 'vitest';

// Mocking next/font/google untuk lingkungan vitest
vi.mock('next/font/google', () => ({
  Bodoni_Moda: vi.fn().mockReturnValue({
    variable: '--font-bodoni',
    className: 'mock-bodoni',
  }),
  Jost: vi.fn().mockReturnValue({
    variable: '--font-jost',
    className: 'mock-jost',
  }),
  Amiri: vi.fn().mockReturnValue({
    variable: '--font-amiri',
    className: 'mock-amiri',
  }),
}));

describe('Google Fonts Configuration', () => {
  it('exports bodoniModa, jost, and amiri with proper CSS variables', async () => {
    const fonts = await import('@/app/fonts');

    expect(fonts.bodoniModa.variable).toBe('--font-bodoni');
    expect(fonts.jost.variable).toBe('--font-jost');
    expect(fonts.amiri.variable).toBe('--font-amiri');
  });
});
