import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SmoothScrollProvider } from './SmoothScrollProvider';

// Mock lenis/react to inspect options passed to ReactLenis
vi.mock('lenis/react', () => ({
  ReactLenis: vi.fn(({ children, options, root }) => (
    <div data-testid="lenis-root" data-root={root} data-options={JSON.stringify(options)}>
      {children}
    </div>
  )),
  useLenis: vi.fn(),
}));

describe('SmoothScrollProvider component', () => {
  it('renders children within the smooth scroll container', () => {
    render(
      <SmoothScrollProvider>
        <div data-testid="test-child">Konten Undangan</div>
      </SmoothScrollProvider>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Konten Undangan')).toBeInTheDocument();
  });

  it('configures ReactLenis with luxury lerp and mobile native touch bypass (syncTouch: false)', () => {
    render(
      <SmoothScrollProvider>
        <div>Konten</div>
      </SmoothScrollProvider>
    );

    const lenisRoot = screen.getByTestId('lenis-root');
    expect(lenisRoot).toBeInTheDocument();

    const options = JSON.parse(lenisRoot.getAttribute('data-options') || '{}');
    expect(options.lerp).toBe(0.085);
    expect(options.wheelMultiplier).toBe(1);
    expect(options.touchMultiplier).toBe(1.6);
    expect(options.syncTouch).toBe(false);
  });
});
