import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TamilReadingPane from '@/features/works/TamilReadingPane';

describe('First-party Tamil reading layout', () => {
  it('preserves exact supplied Tamil and provides accessible size controls', async () => {
    const user = userEvent.setup();
    const text = 'முதல் வரி\nஇரண்டாம் வரி';
    const { container } = render(<TamilReadingPane tamilText={text} />);
    const verse = container.querySelector('.canonical');
    expect(verse).toHaveTextContent(text);
    expect(verse).toHaveAttribute('lang', 'ta');
    expect(verse).toHaveStyle({ whiteSpace: 'pre-wrap', fontSize: '22px' });
    await user.click(screen.getByRole('button', { name: 'எழுத்தைப் பெருக்க' }));
    expect(verse).toHaveStyle({ fontSize: '24px' });
    await user.click(screen.getByRole('button', { name: 'எழுத்தைக் குறைக்க' }));
    expect(verse).toHaveStyle({ fontSize: '22px' });
  });

  it('does not allow font controls outside the readable range', async () => {
    const user = userEvent.setup();
    render(<TamilReadingPane tamilText="சோதனை" ta={false} />);
    const smaller = screen.getByRole('button', { name: 'Decrease text size' });
    const larger = screen.getByRole('button', { name: 'Increase text size' });
    for (let i = 0; i < 12; i += 1) await user.click(smaller);
    expect(smaller).toBeDisabled();
    expect(screen.getByText('18px')).toBeInTheDocument();
    for (let i = 0; i < 12; i += 1) await user.click(larger);
    expect(larger).toBeDisabled();
    expect(screen.getByText('34px')).toBeInTheDocument();
  });
});
