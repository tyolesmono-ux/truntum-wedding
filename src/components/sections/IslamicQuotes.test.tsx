import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IslamicQuotes } from './IslamicQuotes';

describe('IslamicQuotes component', () => {
  const defaultProps = {
    arabicText: 'وَمِنْ ءَايَـٰتِهِۦٓ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَٰجًۭا لِّتَسْكُنُوٓا۟ إِلَيْهَا',
    translation: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu...',
    surahReference: 'Surat Ar-Rum: 21',
    blessingDuah: 'Barakallahu laka wa baraka \'alaika wa jama\'a bainakuma fii khair',
  };

  it('renders the Arabic calligraphy text with correct lang and dir attributes', () => {
    render(<IslamicQuotes {...defaultProps} />);

    const arabicEl = screen.getByText(/وَمِنْ ءَايَـٰتِهِۦٓ/);
    expect(arabicEl).toBeInTheDocument();
    expect(arabicEl).toHaveAttribute('dir', 'rtl');
    expect(arabicEl).toHaveAttribute('lang', 'ar');
  });

  it('renders surah reference and Indonesian translation text', () => {
    render(<IslamicQuotes {...defaultProps} />);

    expect(screen.getByText('Surat Ar-Rum: 21')).toBeInTheDocument();
    expect(screen.getByText(/Dan di antara tanda-tanda/)).toBeInTheDocument();
  });

  it('renders sunnah wedding blessing duah', () => {
    render(<IslamicQuotes {...defaultProps} />);

    expect(screen.getByText(/Barakallahu laka/)).toBeInTheDocument();
  });

  it('has semantic section role and accessible label', () => {
    render(<IslamicQuotes {...defaultProps} />);

    const section = screen.getByRole('region', { name: /ayat suci dan doa pernikahan/i });
    expect(section).toBeInTheDocument();
  });
});
