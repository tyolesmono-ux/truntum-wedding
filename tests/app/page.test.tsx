import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';
import { setupWebAudioMock } from '../mocks/audio-mock';

describe('Root Page Smoke Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupWebAudioMock();
  });

  it('renders editorial welcome heading and Surakarta ornaments', async () => {
    const pageComponent = await HomePage({ searchParams: Promise.resolve({}) });
    render(pageComponent);

    const mainHeading = screen.getByRole('heading', { level: 1, name: /Bespoke Luxury/i });
    expect(mainHeading).toBeDefined();

    const separator = screen.getByRole('separator');
    expect(separator).toBeInTheDocument();
  });

  it('renders VirtualEnvelope with personalized guest name from searchParams', async () => {
    const pageComponent = await HomePage({
      searchParams: Promise.resolve({ to: 'Bapak Raden Mas' }),
    });
    render(pageComponent);

    expect(screen.getAllByText('Bapak Raden Mas').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: 'Buka undangan' }).length).toBeGreaterThanOrEqual(2);
  });
});

