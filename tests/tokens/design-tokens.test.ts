import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Design Tokens & Surakarta Palette Integrity', () => {
  it('defines all required CSS variables in globals.css according to SSoT', () => {
    const cssPath = path.resolve(__dirname, '../../src/app/globals.css');
    expect(fs.existsSync(cssPath)).toBe(true);

    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    // Cek surfaces tokens
    expect(cssContent).toContain('--bg: #F6F1E7;');
    expect(cssContent).toContain('--surface: #FCFAF5;');
    expect(cssContent).toContain('--surface-alt: #E8DCC8;');
    expect(cssContent).toContain('--bg-dark: #15120F;');
    expect(cssContent).toContain('--surface-dark: #221D18;');

    // Cek typography tokens
    expect(cssContent).toContain('--fg: #231F1B;');
    expect(cssContent).toContain('--fg-body: #4A3E33;');
    expect(cssContent).toContain('--fg-muted: #8A7862;');
    expect(cssContent).toContain('--fg-on-dark: #EFE6D6;');
    expect(cssContent).toContain('--fg-muted-dark: #A2937C;');

    // Cek brand & accents tokens
    expect(cssContent).toContain('--brand: #6B4423;');
    expect(cssContent).toContain('--brand-soft: #B07D4A;');
    expect(cssContent).toContain('--gold: #C2A05B;');
    expect(cssContent).toContain('--gold-light: #D9BE85;');
    expect(cssContent).toContain('--accent: #8C2F27;');
    expect(cssContent).toContain('--success: #7E8C74;');

    // Cek divider tokens
    expect(cssContent).toContain('--line: #E0D3BC;');
    expect(cssContent).toContain('--line-strong: #C9B896;');
    expect(cssContent).toContain('--line-dark: rgba(217, 190, 133, 0.22);');
  });

  it('maps CSS variables in tailwind.config.ts correctly', () => {
    const configPath = path.resolve(__dirname, '../../tailwind.config.ts');
    expect(fs.existsSync(configPath)).toBe(true);

    const configContent = fs.readFileSync(configPath, 'utf-8');
    expect(configContent).toContain("fontFamily");
    expect(configContent).toContain("var(--font-bodoni)");
    expect(configContent).toContain("var(--font-jost)");
    expect(configContent).toContain("var(--font-amiri)");
    expect(configContent).toContain("var(--bg)");
    expect(configContent).toContain("var(--gold)");
    expect(configContent).toContain("var(--brand)");
    expect(configContent).toContain("card: '4px'");
    expect(configContent).toContain("luxe: 'cubic-bezier(0.22, 1, 0.36, 1)'");
  });
});
