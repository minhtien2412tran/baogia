# GĐ4 Sandbox Readiness — gap checklist (no fake prod)

> **Updated:** 2026-07-15 · **Status:** PREP ONLY — **not started**  
> **Prerequisite:** GĐ2 Dev complete · Owner SMTP (O4) ideally first  
> **Do not:** commit secrets · enable live merchant keys · mock production payments  
> **Related:** [KH_G4_KEYS_CHECKLIST.md](./KH_G4_KEYS_CHECKLIST.md) · [JETBAY_G4_INTEGRATIONS.md](./JETBAY_G4_INTEGRATIONS.md) · [OWNER_NEXT_ACTIONS.md](./OWNER_NEXT_ACTIONS.md)

```text
Current phase: GĐ2 Dev complete
Current mode: Waiting for Owner
Next technical phase after Owner unlock:
1. SMTP inbox verification
2. Payment sandbox
3. OAuth sandbox
4. SMS sandbox
5. Integration health checks
6. End-to-end UAT
7. Production readiness review
```

---

## H1. Payment sandbox

| Item | Status / gap | Notes |
|------|--------------|-------|
| Providers in code | PRESENT | Stripe · OnePay · 9Pay adapters |
| Env vars | NOT_SET on VPS | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `ONEPAY_*`, `NINEPAY_*` |
| Webhook URL | READY path | `POST /quotes/payments/stripe/webhook` (+ OnePay/9Pay routes) |
| Signature verify | PRESENT (Stripe) | Requires webhook secret |
| Idempotency | PARTIAL | Confirm via Payment row / transactionRef — re-audit when keys arrive |
| Test cards | BLOCKED_OWNER | Stripe test mode keys from Owner |
| Success/cancel UI | PRESENT web | Account payments note; polish when sandbox live |
| Refund/cancel | PARTIAL | Stripe confirm path exists; full refund UAT after sandbox |
| Production secret rule | HARD | Never put live secret in staging `.env` until UAT signed |

**Owner:** sandbox keys only first. **Dev after keys:** wire env → restart → one sandbox charge → `/integrations/status` stripe=true.

---

## H2. OAuth sandbox

| Item | Status / gap | Notes |
|------|--------------|-------|
| Google Client ID | NOT_SET | `GOOGLE_CLIENT_ID` + web `NEXT_PUBLIC_GOOGLE_CLIENT_ID` |
| Apple Client ID | NOT_SET | Optional per Owner O20 |
| Callback / redirect | STAGING domain | `https://www.minhtien.online/...` must be allowlisted |
| State / nonce | Audit at enable | Follow existing auth controllers |
| PKCE | N/A or verify | Google web often implicit/token — confirm adapter |
| Account linking | PRESENT path | Email/password first for GĐ2 |
| Error redirect | PRESENT | Login error surfaces |
| Staging domain | READY | www.minhtien.online |

**Do not** mark OAuth PASS until redirect + real provider consent screen works.

---

## H3. SMS sandbox

| Item | Status / gap | Notes |
|------|--------------|-------|
| Adapter | PRESENT | Twilio · eSMS · generic `SMS_API_URL` |
| Env | NOT_SET | `TWILIO_*` / `ESMS_*` / `SMS_API_*` |
| OTP expiration | PRESENT | Auth OTP services |
| Rate limit | PRESENT | Throttle on auth routes |
| Retry | PARTIAL | Provider-dependent |
| OTP in logs | MUST NEVER | Code must not log OTP / SMS body |
| Sandbox number | BLOCKED_OWNER | Provider test destination |

**Dev after keys:** send OTP to Owner test phone · confirm `/integrations/status` sms=true · never log OTP.

---

## Order of work (after Owner unlock)

1. **SMTP inbox** (T-S4-01) before marketing mail assumptions.  
2. Payment sandbox (1 successful charge).  
3. OAuth sandbox (if in scope).  
4. SMS sandbox (if in scope).  
5. Integration health + E2E UAT + production readiness review.  

**Not GĐ4 started:** no merchant keys yet → phase remains **Waiting for Owner**.
