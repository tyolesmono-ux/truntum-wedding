import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

describe('Root Page Smoke Test', () => {
  it('renders editorial welcome heading and Surakarta ornaments', () => {
    render(<HomePage />);

    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveTextContent(/Bespoke Luxury/i);

    const separator = screen.getByRole('separator');
    expect(separator).toBeInTheDocument();
  });
});
