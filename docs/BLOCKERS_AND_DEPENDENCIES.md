# Blockers & Dependencies

> **Updated:** 2026-07-15 · **Status:** CURRENT  
> **Handoff:** [OWNER_NEXT_ACTIONS.md](./OWNER_NEXT_ACTIONS.md)

| ID | Blocker | Owner | Impact | Unblock by | Related |
|----|---------|-------|--------|------------|---------|
| B1 | SMTP production LOOPBACK (`localhost`) — Dev guard already PASS | Owner | Mail không vào inbox dù form 201 | Set real `SMTP_*` on VPS → restart → inbox verify | O4 · OWNER_NEXT_ACTIONS |
| B2 | Payment keys (Stripe/OnePay/9Pay=false) | Owner | Account pay + GĐ4 | Sandbox keys | O7 · KH_G4 |
| B3 | OAuth Google/Apple=false | Owner | Social login | Client IDs | O8 |
| B4 | SMS provider=false | Owner | OTP prod | Twilio/eSMS | O9 |
| B5 | Local Swagger Basic may be stale | Dev laptop | Local `smoke:api-sync` exit 2 | Refresh Basic from VPS yourself | **NEEDS_LOCAL_ENV_REFRESH** · not prod |
| B6 | OpenAPI anon 401 (Swagger Basic ON) | Expected | Scripts need Basic | VPS remote runner (prod PASS 173=173) | API_SYNC_SMOKE |
| B7 | CMS nội dung mỏng + locale body | Owner content | Web trống / i18n body | Publish CMS | O10–O11 · ADMIN_OPS |
| B8 | DocuSign mock | Owner (optional) | Contract e-sign | Keys GĐ4 | GĐ4 |
| B9 | Backup restore drill | — | — | **DONE** 2026-07-14 airports 120=120 | DATABASE_BACKUP_RESTORE |

**Cleared as product blocker:** O3 baocaotiendo v3.1 → **DEPLOYED / OPTIONAL_OWNER_REVIEW**.

**Không blocker architecture:** Nest refactor, RN app — để sau.
