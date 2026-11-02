import { useState } from 'react';

export default function TamilReadingPane({ tamilText, ta = true }: { tamilText: string; ta?: boolean }) {
  const [fontSize, setFontSize] = useState(22);
  return (
    <>
      <div className="reader-controls" role="group" aria-label={ta ? 'எழுத்தின் அளவு' : 'Reading text size'}>
        <button type="button" onClick={() => setFontSize((size) => Math.max(18, size - 2))}
          disabled={fontSize <= 18} aria-label={ta ? 'எழுத்தைக் குறைக்க' : 'Decrease text size'}>A−</button>
        <output aria-live="polite">{fontSize}px</output>
        <button type="button" onClick={() => setFontSize((size) => Math.min(34, size + 2))}
          disabled={fontSize >= 34} aria-label={ta ? 'எழுத்தைப் பெருக்க' : 'Increase text size'}>A+</button>
      </div>
      <div className="canonical" lang="ta"
        style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', lineHeight: 1.9, fontSize: `${fontSize}px`, maxWidth: '72ch', marginInline: 'auto' }}>
        {tamilText}
      </div>
    </>
  );
}
