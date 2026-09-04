# Security Policy — OmSaravanaBhava Hi-Tech

## Scope

This policy applies to the new clean-room application repository:

`ssakthivel02/omsaravanabhava-hitech`

The legacy repository is not an application-source dependency of this project.

## Reporting a security issue

Do not publish credentials, private user data, exploit details, private contact information, or sensitive logs in a public GitHub issue.

Until a dedicated private security-reporting channel is configured, use the repository owner's approved private contact channel. If no private channel is currently published, do not post exploit details publicly; report only that a private contact route is required.

## Sensitive information

Never commit:

- API tokens or passwords;
- Cloudflare credentials;
- GitHub tokens;
- `.env` files containing secrets;
- private keys/certificates;
- production cookies/session data;
- user-submitted private devotional/correction information;
- analytics exports containing identifiable browsing/search data.

## Deployment security

Production deployments must:

- originate from the exact approved Git SHA;
- use the new OmSaravanaBhava Hi-Tech Cloudflare project only;
- preserve preview/production separation;
- use minimum GitHub Action permissions;
- keep production credentials out of pull-request jobs;
- verify security headers/CSP against the exact deployed candidate;
- preserve an auditable rollback target.

## Privacy principle

Saved devotional items, practice counters, reading preferences and similar personal devotional state should remain local by default. Do not add tracking or telemetry that records religious practice/search behavior without explicit privacy review and an approved purpose.

## Security claims

Do not claim security certification, penetration-test completion, WCAG conformance, privacy certification, or equivalent assurance unless the exact release has supporting evidence.

Production status remains `NO-GO` until the release gates and explicit owner approval are satisfied.
