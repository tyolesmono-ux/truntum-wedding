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
  it('exports bodoniModa, jost, and amiri configured with exact SSoT options', async () => {
    const { Bodoni_Moda, Jost, Amiri } = await import('next/font/google');
    const fonts = await import('@/app/fonts');

    expect(fonts.bodoniModa.variable).toBe('--font-bodoni');
    expect(fonts.jost.variable).toBe('--font-jost');
    expect(fonts.amiri.variable).toBe('--font-amiri');

    expect(Bodoni_Moda).toHaveBeenCalledWith(
      expect.objectContaining({
        subsets: ['latin'],
        display: 'swap',
        variable: '--font-bodoni',
        weight: '400',
        style: ['normal', 'italic'],
      })
    );

    expect(Jost).toHaveBeenCalledWith(
      expect.objectContaining({
        subsets: ['latin'],
        display: 'swap',
        variable: '--font-jost',
        weight: ['300', '400', '500'],
      })
    );

    expect(Amiri).toHaveBeenCalledWith(
      expect.objectContaining({
        subsets: ['arabic'],
        display: 'swap',
        variable: '--font-amiri',
        weight: '400',
      })
    );
  });
});
