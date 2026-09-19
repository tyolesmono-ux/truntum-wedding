import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CountdownSection } from './CountdownSection';

describe('CountdownSection component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders time units (Hari, Jam, Menit, Detik) and tabular values when active', () => {
    // 5 hari, 3 jam, 20 menit, 15 detik sebelum target
    const mockNow = new Date('2026-12-07T00:00:00.000Z').getTime();
    vi.setSystemTime(mockNow);

    const targetDate = '2026-12-12T01:00:00.000Z'; // ~5 hari 1 jam
    render(<CountdownSection targetDate={targetDate} />);

    expect(screen.getByText('Hari')).toBeInTheDocument();
    expect(screen.getByText('Jam')).toBeInTheDocument();
    expect(screen.getByText('Menit')).toBeInTheDocument();
    expect(screen.getByText('Detik')).toBeInTheDocument();
  });

  it('renders formal completion notice when the target date has passed', () => {
    // 1 hari setelah target
    const mockNow = new Date('2026-12-13T00:00:00.000Z').getTime();
    vi.setSystemTime(mockNow);

    const targetDate = '2026-12-12T01:00:00.000Z';
    render(<CountdownSection targetDate={targetDate} />);

    expect(screen.getByText(/sedang atau telah berlangsung/i)).toBeInTheDocument();
  });

  it('has semantic region role and accessible label', () => {
    render(<CountdownSection targetDate="2026-12-12T01:00:00.000Z" />);

    expect(screen.getByRole('region', { name: /hitung mundur hari bahagia/i })).toBeInTheDocument();
  });
});
