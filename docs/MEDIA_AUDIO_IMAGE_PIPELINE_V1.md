# OmSaravanaBhava Hi-Tech — Premium Media, Image & Audio Pipeline V1

## Goal

Deliver a visually memorable Sacred-Tech experience without turning the website into a slow media gallery or publishing assets with unclear rights/provenance.

## 1. Asset classes

Every public visual/audio asset should have a class:

- `OWNER_ORIGINAL`
- `LICENSED_FOR_PUBLICATION`
- `OFFICIAL_SOURCE_LINK_ONLY`
- `DEVOTIONAL_ILLUSTRATION`
- `DOCUMENTARY_PHOTO_VERIFIED`
- `PUBLIC_DOMAIN_EDITION_REVIEWED`
- `REFERENCE_ONLY_NOT_PUBLIC`
- `QUARANTINED`

The UI must not make a devotional illustration look like documentary evidence of a temple/history.

## 2. Image provenance record

For each material image store where relevant:

- stable asset ID;
- source/creator;
- rights/licence;
- source URL/reference;
- publication state;
- factual/illustrative classification;
- alt-text intent;
- crop/focal-point guidance;
- generated-image disclosure where needed.

## 3. Image delivery

Preferred build/runtime principles:

- use SVG for original Sacred-Tech geometry/icons where practical;
- use AVIF/WebP for photographic/illustrative raster assets when quality is acceptable;
- retain a fallback only when required;
- generate multiple intrinsic widths;
- use `srcset`/`sizes`;
- always provide width/height or aspect-ratio to prevent CLS;
- lazy-load below-the-fold media;
- do not lazy-load the actual LCP image if one is introduced;
- avoid giant 4K originals on mobile;
- no decorative image should justify blocking first interaction.

## 4. Hero-media rule

Default flagship hero remains lightweight Vel/Sacred-Tech geometry.

A future premium hero image/video may be added only if measured against the performance budget.

Forbidden by default:

- autoplay hero video with sound;
- multi-megabyte initial cinematic download;
- continuous particle/WebGL background merely for spectacle;
- hero asset that delays Tamil identity/CTA.

If motion media is used, provide static/reduced-motion parity.

## 5. Temple imagery

Preferred confidence order:

1. owner-supplied rights-confirmed photograph;
2. official temple/HR&CE image with explicit reusable permission/licence where available;
3. licensed documentary photograph;
4. original devotional/architectural illustration clearly labelled as illustration;
5. no image.

`No image` is better than an unverified image of the wrong temple.

## 6. Audio types must remain distinct

Supported conceptual types:

- `RECORDED_DEVOTIONAL_AUDIO`
- `OWNER_OR_LICENSED_RECORDING`
- `DEVICE_READ_ALOUD`
- `TTS_GENERATED_READ_ALOUD`
- `REFERENCE_AUDIO_NOT_PUBLIC`

Never label device/browser TTS as a devotional recording.

Every recorded audio item requires publication-rights state.

## 7. Audio player quality

When real audio exists:

- accessible play/pause/seek/volume/mute controls;
- keyboard operable;
- visible focus;
- no autoplay with sound;
- clear track title/source/rights state;
- playback speed only where appropriate;
- persistent mini-player may be used if it does not obscure navigation/content;
- screen reader announces state changes without excessive chatter;
- loading/error states truthful.

## 8. Audio delivery

- do not preload full audio library;
- load metadata first;
- use `preload="metadata"` or none based on measurement;
- stream/range requests where hosting supports them;
- use efficient broadly supported codecs/containers after browser testing;
- retain source master outside deploy artifact;
- cache only deliberately selected/offline-safe audio, not every track automatically.

## 9. Offline media

PWA offline should start with shell + lightweight textual governed content.

Large audio/images should require explicit user choice before durable offline storage when possible.

Provide:

- estimated/downloaded size;
- remove offline item;
- clear failure/storage-full state;
- no hidden multi-hundred-MB cache growth.

## 10. Accessibility

Images:

- informative image → meaningful alt text;
- decorative Sacred-Tech motif → empty alt/hidden from AT;
- temple documentary photo → identify temple/context without devotional exaggeration;
- charts/maps → equivalent text where needed.

Audio:

- textual canonical source remains available independently where rights permit;
- audio is enhancement, not the only access path;
- do not require hearing to navigate the devotional corpus.

## 11. Performance budgets

Media must obey `release/PERFORMANCE_MOTION_BUDGET_V1.json`.

Route-level budgets should consider:

- initial compressed transfer;
- decoded image memory;
- audio not downloaded before intent;
- LCP asset size;
- low-end mobile responsiveness;
- repeat-visit cache behavior.

## 12. Media release gate

Before publication:

- provenance state valid;
- rights state valid;
- alt/accessibility complete;
- responsive variants generated;
- no broken references;
- no accidental EXIF/private metadata in published originals where applicable;
- no cross-project asset contamination;
- performance budget PASS;
- illustration/documentary distinction truthful.

## Final principle

Premium media should make OmSaravanaBhava memorable **because it is intentional and authentic**, not because every section contains a large image/video.
