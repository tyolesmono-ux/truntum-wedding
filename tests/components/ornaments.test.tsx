import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KawungBackground } from '@/components/ornaments/KawungBackground';
import { TruntumDivider } from '@/components/ornaments/TruntumDivider';

describe('Javanese Ornaments Components', () => {
  it('renders KawungBackground with proper pattern definition and aria-hidden', () => {
    const { container } = render(<KawungBackground className="custom-kawung" />);
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveClass('custom-kawung');
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');

    const pattern = container.querySelector('#kawung-pattern');
    expect(pattern).toBeInTheDocument();
  });

  it('renders TruntumDivider with separator role and Prada floral icon', () => {
    render(<TruntumDivider className="my-8" />);
    const divider = screen.getByRole('separator');

    expect(divider).toBeInTheDocument();
    expect(divider).toHaveClass('my-8');

    const svgIcon = divider.querySelector('svg');
    expect(svgIcon).toBeInTheDocument();
  });
});
