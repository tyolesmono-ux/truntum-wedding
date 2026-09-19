import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('Utility cn()', () => {
  it('combines multiple class names correctly', () => {
    const result = cn('bg-sand', 'text-wulung');
    expect(result).toBe('bg-sand text-wulung');
  });

  it('handles conditional and falsy values', () => {
    const result = cn('base-class', false && 'hidden', null, undefined, 'active-class');
    expect(result).toBe('base-class active-class');
  });

  it('merges conflicting Tailwind utility classes properly via tailwind-merge', () => {
    const result = cn('px-4 py-2 text-sm', 'px-6 text-lg');
    expect(result).toBe('py-2 px-6 text-lg');
  });
});
