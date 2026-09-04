# OmSaravanaBhava Hi-Tech — Corrections & Feedback Workflow V1

## Purpose

Make source corrections easy for devotees and researchers without turning user submissions directly into published scripture/temple facts.

## 1. Correction categories

Support clearly separated categories:

- canonical text / textual variant;
- transliteration;
- meaning/commentary;
- temple identity;
- temple contact/timing/facility information;
- temple history/traditional narrative;
- source/citation issue;
- broken link/media;
- accessibility/UX issue;
- privacy/security concern;
- general product feedback.

## 2. Submission principle

A correction is evidence, not publication authority.

No public record changes automatically from a submission.

Every submission should enter a review state such as:

`RECEIVED -> TRIAGED -> SOURCE_REVIEW -> ACCEPTED / REJECTED / NEEDS_MORE_EVIDENCE -> PUBLISHED`

## 3. Minimal data collection

Collect only what is needed to investigate the report.

Preferred fields:

- affected route/record ID;
- issue category;
- concise description;
- proposed correction if applicable;
- source/reference URL or citation;
- optional contact address if the person wants a reply.

Do not require an account.

Avoid collecting religious profile information or practice history.

## 4. Canonical-text corrections

For canonical text or mantra/song corrections require source evidence.

Never replace canonical text because a submission is plausible.

Review should record:

- current text;
- proposed text;
- source edition/witness;
- variant status;
- reviewer decision;
- effective release/version.

If sources conflict, preserve the variant instead of silently choosing one.

## 5. Temple corrections

Dynamic temple facts such as timings/contact details must preserve:

- official source;
- retrieved/verified timestamp;
- previous value where useful;
- new value;
- reviewer/source authority.

Official HR&CE/temple sources outrank anonymous submissions for operational facts.

## 6. Abuse/spam controls

If a public form is enabled, use privacy-conscious anti-abuse measures.

Do not expose raw submitter email or free-form content publicly.

Rate limiting/Turnstile or equivalent may be used only after privacy/CSP review.

## 7. Public acknowledgement

Where useful, display a neutral correction note/change history without exposing submitter identity unless explicit permission exists.

Do not gamify religious-content corrections with leaderboards or public reputation scores.

## 8. Emergency correction lane

Security/privacy issues, dangerous misinformation, incorrect official payment/donation details, or materially corrupted canonical text require expedited triage.

If a bad direct-support/payment link is discovered, remove/disable it immediately while verification proceeds.

## 9. Contact route requirement

Before production the Contact/Corrections route must provide either:

- a real owner-approved destination/form; or
- an explicit truthful statement that submissions are not yet available.

A page that tells users to contact the project without giving a channel is a P0 product defect.

## 10. Audit trail

Accepted corrections should be traceable to:

- record ID;
- issue/submission reference;
- source evidence;
- reviewer decision;
- Git/content commit or release version;
- publication date.

## Release gate

`CORRECTION_WORKFLOW_GATE` passes when users have a real or honestly unavailable correction path and no user submission can bypass governed source/review/publication states.