# Content sync workflow

**Mode in force:** `SAFE_REFERENCE_MODE` (default — no ownership evidence for JetVina content in repo).

## Overall flow

```mermaid
flowchart LR
    A[Authorized Source or Public Reference] --> B[Source Discovery]
    B --> C[Fetch Metadata]
    C --> D[Normalize]
    D --> E[Copyright and Rights Check]
    E -->|Approved| F[Transform or Rewrite]
    E -->|Unverified| G[Block from Publish]
    F --> H[Deduplicate]
    H --> I[Staging]
    I --> J[Content Diff]
    J --> K[Human Review]
    K -->|Approved| L[Publish]
    K -->|Rejected| M[Revision]
    L --> N[Website API]
    N --> O[Website and Admin]
    L --> P[Version History]
    P --> Q[Rollback]
```

## Missing-module development

```mermaid
flowchart TD
    A[Repository Audit] --> B[Gap Analysis]
    B --> C[Data Model]
    C --> D[Migration]
    D --> E[Backend API]
    E --> F[Admin CMS]
    F --> G[Website Integration]
    G --> H[Automated Tests]
    H --> I[Staging Deployment]
    I --> J[Content Review]
    J --> K[Production Cutover]
    K --> L[Monitoring and Rollback]
```

## Per-record state

```mermaid
stateDiagram-v2
    [*] --> DISCOVERED
    DISCOVERED --> FETCHED
    FETCHED --> NORMALIZED
    NORMALIZED --> RIGHTS_REVIEW
    RIGHTS_REVIEW --> BLOCKED
    RIGHTS_REVIEW --> TRANSFORMING
    TRANSFORMING --> REVIEW_PENDING
    REVIEW_PENDING --> APPROVED
    REVIEW_PENDING --> REJECTED
    REJECTED --> TRANSFORMING
    APPROVED --> PUBLISHED
    PUBLISHED --> UPDATED
    UPDATED --> REVIEW_PENDING
    PUBLISHED --> ROLLED_BACK
```

## Rules (enforced in code)

1. First sync always `dryRun=true`.
2. SAFE mode stores **metadata only** (id, slug, title, URL, modified) — never marketing HTML.
3. Legal pages → `BLOCK` / `PROHIBITED` until legal review.
4. Media import off unless `EXTERNAL_MEDIA_IMPORT_ENABLED=true` **and** rights approved.
5. Publish requires `CONTENT_SYNC_PUBLISH_ENABLED=true` and all items APPROVED with publishable rights.
6. Never auto-delete target when source missing → `SOURCE_MISSING` + review.
7. Manual editor edits → conflict (do not overwrite).

## Feature flags

| Flag | Default prod |
|------|----------------|
| `CONTENT_SYNC_ENABLED` | on (manual) |
| `CONTENT_SYNC_PUBLISH_ENABLED` | **off** |
| `EXTERNAL_MEDIA_IMPORT_ENABLED` | **off** |
| `NEW_BRAND_CONTENT_ENABLED` | off until cutover |
| `JETBAY_CONTENT_CLEANUP_ENABLED` | on |
