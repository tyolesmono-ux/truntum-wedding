import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { LoveStoryTimeline } from './LoveStoryTimeline';
import { LoveStoryMilestone } from '@/lib/config/wedding-content';

const mockMilestones: readonly LoveStoryMilestone[] = [
  {
    id: 'pertemuan-pertama',
    year: '2021',
    period: 'Agustus 2021',
    title: 'Awal mula pertemuan',
    story: 'Takdir mempertemukan dua insan dalam perbincangan santun di kota Surakarta.',
  },
  {
    id: 'ikrar-komitmen',
    year: '2024',
    period: 'Mei 2024',
    title: 'Menjalin doa dan komitmen',
    story: 'Doa yang terpanjat perlahan menemukan muaranya untuk saling menjaga.',
  },
  {
    id: 'menuju-pelaminan',
    year: '2026',
    period: 'Oktober 2026',
    title: 'Langkah menuju janji suci',
    story: 'Dengan restu seluruh keluarga besar, kami mengikat janji setia.',
  },
];

const originalMatchMedia = window.matchMedia;

afterEach(() => {
  window.matchMedia = originalMatchMedia;
});

function mockReducedMotion(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: matches && query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('LoveStoryTimeline component', () => {
  it('renders a labelled region on the Malam Wulung dark surface', () => {
    render(<LoveStoryTimeline milestones={mockMilestones} />);

    const section = screen.getByRole('region', { name: /linimasa kisah cinta/i });
    expect(section).toBeInTheDocument();
    expect(section.className).toContain('bg-surakarta-bg-dark');
    expect(section.className).toContain('text-surakarta-fg-on-dark');
  });

  it('renders every milestone with a Didone year, period, title, and narrative', () => {
    const { container } = render(<LoveStoryTimeline milestones={mockMilestones} />);

    const years = container.querySelectorAll('time');
    expect(years).toHaveLength(3);
    expect(years[0]).toHaveTextContent('2021');
    expect(years[0]).toHaveAttribute('datetime', '2021');
    expect(years[0].className).toContain('font-display');

    expect(screen.getByRole('heading', { name: 'Awal mula pertemuan' })).toBeInTheDocument();
    expect(screen.getByText('Agustus 2021')).toBeInTheDocument();
    expect(
      screen.getByText(/Takdir mempertemukan dua insan dalam perbincangan santun/)
    ).toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'Langkah menuju janji suci' })).toBeInTheDocument();
  });

  it('renders the scroll-linked gold rail as an accessible progressbar', () => {
    render(<LoveStoryTimeline milestones={mockMilestones} />);

    const progressbar = screen.getByRole('progressbar', { name: /progres kisah cinta/i });
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
    expect(progressbar.className).toContain('bg-surakarta-gold');
    expect(progressbar).toHaveAttribute('data-static', 'false');
  });

  it('renders one concentric gold node marker per milestone', () => {
    render(<LoveStoryTimeline milestones={mockMilestones} />);

    expect(screen.getAllByTestId('milestone-node')).toHaveLength(3);
  });

  it('locks the progress rail static and skips reveal motion when motion is reduced', async () => {
    mockReducedMotion(true);
    render(<LoveStoryTimeline milestones={mockMilestones} />);

    const section = screen.getByRole('region', { name: /linimasa kisah cinta/i });
    await waitFor(() => expect(section).toHaveAttribute('data-reduced-motion', 'true'));
    expect(screen.getByRole('progressbar', { name: /progres kisah cinta/i })).toHaveAttribute(
      'data-static',
      'true'
    );
  });

  it('keeps the rail left-aligned regardless of viewport width', () => {
    render(<LoveStoryTimeline milestones={mockMilestones} />);

    const rail = screen.getByTestId('timeline-rail');
    expect(rail.className).toContain('left-0');
  });
});
