import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LocaleProvider } from '@/lib/locale';
import { About } from '@/features/legal/Legal';

describe('About content-governance wording', () => {
  it('explains independent publication dimensions instead of claiming all visible records are fully verified', () => {
    render(
      <LocaleProvider>
        <About />
      </LocaleProvider>,
    );

    expect(
      screen.getByText(/பொதுக் காட்சி, மூல இணைப்பு, முழுமை\/சரிபார்ப்பு மற்றும் வெளியீட்டு உரிமை ஆகியவை தனித்தனி நிலைகள்/),
    ).toBeInTheDocument();
    expect(screen.queryByText('சரிபார்க்கப்படாத தகவலை வெளியிடாமல் இருத்தல்.')).toBeNull();
  });
});
