# Source Data Staging

This directory contains **governed source-evidence inputs**, not blindly publishable application content.

Rules:

- every dynamic fact must keep `sourceUrl`, `sourceAuthority`, `retrievedAt`, `lastVerifiedAt`, and `dynamic: true`;
- current temple timings/contact/facility/service information can change and must be reverified before production publication when stale;
- official temple devotional/traditional narrative is evidence of what the temple publishes, not automatically independent secular history;
- no record in this directory bypasses `release/CONTENT_STATE_MODEL_V1.json`, `release/CONTENT_INGESTION_SCHEMA_V1.json`, rights review, or publication policy;
- official donation/service destinations remain external; OmSaravanaBhava must not receive or intermediate temple funds;
- do not copy this source-data directory wholesale into runtime bundles without a deliberate ingestion step.

R6 application runtime is not source-data authority. Legacy app shell/runtime files are forbidden here.
