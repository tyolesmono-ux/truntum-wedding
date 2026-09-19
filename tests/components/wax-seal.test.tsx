import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { WaxSeal } from '@/components/opening/WaxSeal';

describe('WaxSeal Component (SSoT DESIGN.md Section 6.1)', () => {
  it('renders with accessible button attributes and correct aria-label', () => {
    render(<WaxSeal onClick={vi.fn()} />);

    const sealBtn = screen.getByRole('button', { name: 'Buka undangan' });
    expect(sealBtn).toBeDefined();
    expect(sealBtn.getAttribute('aria-label')).toBe('Buka undangan');
  });

  it('renders default monogram "A & B" and custom monogram if provided', () => {
    const { rerender } = render(<WaxSeal onClick={vi.fn()} />);
    expect(screen.getByText('A & B')).toBeDefined();

    rerender(<WaxSeal onClick={vi.fn()} monogram="R & J" />);
    expect(screen.getByText('R & J')).toBeDefined();
  });

  it('triggers onClick callback when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<WaxSeal onClick={handleClick} />);

    const sealBtn = screen.getByRole('button', { name: 'Buka undangan' });
    await user.click(sealBtn);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('supports keyboard navigation with Enter and Space keys', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<WaxSeal onClick={handleClick} />);

    const sealBtn = screen.getByRole('button', { name: 'Buka undangan' });
    sealBtn.focus();
    expect(document.activeElement).toBe(sealBtn);

    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);

    await user.keyboard(' ');
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('prevents multiple clicks when isOpening is true', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<WaxSeal onClick={handleClick} isOpening={true} />);

    const sealBtn = screen.getByRole('button', { name: 'Buka undangan' });
    await user.click(sealBtn);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
