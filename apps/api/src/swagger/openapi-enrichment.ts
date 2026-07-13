import type { OpenAPIObject } from '@nestjs/swagger';
import {
  getAuthHintLocalized,
  getSwaggerIntro,
  getSwaggerTagDescription,
  normalizeSwaggerLang,
  type SwaggerLang,
} from './swagger-locales';

export const SWAGGER_TAG_META: Array<{ name: string; description: string }> = [
  {
    name: 'System',
    description:
      'Liveness, readiness, and integration flags. `/health` is public (no API key).',
  },
  {
    name: 'Auth',
    description:
      'Register, login, refresh, OTP, OAuth. Rate-limited. Returns JWT access + refresh tokens.',
  },
  {
    name: 'Account',
    description: 'Authenticated customer dashboard aggregate (quotes, bookings, payments).',
  },
  {
    name: 'Airports',
    description: 'Airport search, nearby geo lookup, and parking/base flags for quote/positioning.',
  },
  {
    name: 'Quotes & Bookings',
    description:
      'Aircraft search with positioning pricing, quote requests, payments, and related booking docs.',
  },
  {
    name: 'Bookings',
    description: 'Customer booking lifecycle (create, list, detail, cancel) — JWT required.',
  },
  {
    name: 'Fixed Price',
    description: 'Published fixed-price charter routes and quote helpers for marketing pages.',
  },
  {
    name: 'Empty Legs',
    description: 'Empty-leg catalogue, alerts, and request forms.',
  },
  {
    name: 'Jet Card',
    description: 'Jet card plans and sales enquiries.',
  },
  {
    name: 'Travel Credits',
    description: 'Travel credit packages, balance, and enquiries.',
  },
  {
    name: 'Partners',
    description: 'Partner programs and application intake.',
  },
  {
    name: 'Content (CMS)',
    description: 'Public CMS: news, blogs, videos, destinations, pages, newsletter.',
  },
  {
    name: 'Media',
    description: 'Media upload/list and public media URLs.',
  },
  {
    name: 'Pricing',
    description: 'Internal pricing estimates / positioning engine helpers.',
  },
  {
    name: 'Contracts',
    description: 'Operator charter contracts, approval workflow, DocuSign send (permission-gated).',
  },
  {
    name: 'Content Sync',
    description:
      'Content sources, sync jobs, media-asset review, brand settings, legacy-brand cleanup flags.',
  },
  {
    name: 'Enquiries',
    description: 'Generic commercial enquiry intake forms.',
  },
  {
    name: 'i18n',
    description: 'Web/API locale configuration for multilingual UI.',
  },
  {
    name: 'API Gateway',
    description: 'Route catalog and UI↔API coverage audit for internal tooling.',
  },
  {
    name: 'Admin Dashboard',
    description: 'Admin KPIs, recent quotes/bookings, revenue demo, audit logs, system health.',
  },
  {
    name: 'Admin Quotes',
    description: 'Admin quote queue, status updates, and offers.',
  },
  {
    name: 'Admin Bookings',
    description: 'Admin booking management.',
  },
  {
    name: 'Admin Content',
    description: 'CMS CRUD for articles, pages, destinations, videos.',
  },
  {
    name: 'Admin Fixed Price',
    description: 'Admin CRUD for fixed-price routes and options.',
  },
  {
    name: 'Admin Empty Legs',
    description: 'Admin CRUD for empty-leg inventory.',
  },
  {
    name: 'Admin Jet Card',
    description: 'Admin jet-card plans and enquiries.',
  },
  {
    name: 'Admin Travel Credits',
    description: 'Admin travel-credit packages and ledger.',
  },
  {
    name: 'Admin Aircraft',
    description: 'Fleet / aircraft catalogue admin.',
  },
  {
    name: 'Admin Airports',
    description: 'Airport master data admin (coords, parking, base).',
  },
  {
    name: 'Admin Operators',
    description: 'Operator (hãng) profiles and operator-user accounts for flight notify mail.',
  },
  {
    name: 'Admin Email Templates',
    description: 'Editable HTML/text email templates (flight notify, customer care).',
  },
  {
    name: 'Admin Partners',
    description: 'Partner applications and programs admin.',
  },
  {
    name: 'Admin Users',
    description: 'User list and role management.',
  },
  {
    name: 'Admin Permissions',
    description: 'Permission matrix and role overrides for staff.',
  },
];

/** Explicit summaries/descriptions for operations that lack @ApiOperation */
const OP_DOCS: Record<string, { summary: string; description: string }> = {
  'GET /': {
    summary: 'API root index',
    description:
      'Returns service name, status, and links to Swagger/OpenAPI/health. Public (no X-API-Key).',
  },
  'GET /health': {
    summary: 'Liveness probe',
    description:
      'Lightweight health check for load balancers and deploy scripts. Public (no X-API-Key). Returns `status`, `service`, `env`, `version`.',
  },
  'GET /integrations/status': {
    summary: 'Integration readiness flags',
    description:
      'Boolean readiness for JWT/DB/Redis and G4 integrations (SMTP, OAuth, payment, SMS). **Never returns secret values.** Requires X-API-Key.',
  },
  'POST /admin/operators': {
    summary: 'Create operator',
    description: 'Create an operator (hãng) record used for fleet ownership and flight-notify contacts. Admin JWT + X-API-Key.',
  },
  'GET /admin/operators/{id}': {
    summary: 'Get operator by id',
    description: 'Return operator detail including linked operator users. Admin JWT + X-API-Key.',
  },
  'PATCH /admin/operators/{id}': {
    summary: 'Update operator',
    description: 'Patch operator profile fields (name, code, status, contact). Admin JWT + X-API-Key.',
  },
  'POST /admin/operators/{id}/users': {
    summary: 'Attach or create operator user',
    description:
      'Link an existing user or create a new operator-login for mail notify. Admin JWT + X-API-Key.',
  },
  'DELETE /admin/operators/{id}/users/{userId}': {
    summary: 'Detach operator user',
    description: 'Remove operator-user link without deleting the global user account. Admin JWT + X-API-Key.',
  },
  'GET /admin/email-templates/{key}': {
    summary: 'Get email template by key',
    description: 'Fetch subject/body for a template key (e.g. flight notify). Admin JWT + X-API-Key.',
  },
  'PATCH /admin/email-templates/{key}': {
    summary: 'Upsert email template',
    description: 'Create or update HTML/text template content for a key + locale. Admin JWT + X-API-Key.',
  },
  'POST /admin/contracts': {
    summary: 'Create contract',
    description: 'Create an operator charter contract draft from booking/aircraft. Requires `contract.create`.',
  },
  'GET /admin/contracts/templates': {
    summary: 'List contract templates',
    description: 'List available contract templates for drafting. Requires `contract.view`.',
  },
  'GET /admin/contracts/{id}': {
    summary: 'Get contract detail',
    description: 'Return contract detail and approval state. Requires `contract.view`.',
  },
  'POST /admin/contracts/{id}/submit': {
    summary: 'Submit contract for approval',
    description: 'Move contract into approval workflow. Requires `contract.submit_approval`.',
  },
  'POST /admin/contracts/{id}/approve': {
    summary: 'Approve contract',
    description: 'Approve a submitted contract. Requires `contract.approve`.',
  },
  'POST /admin/contracts/{id}/reject': {
    summary: 'Reject contract',
    description: 'Reject a submitted contract with reason. Requires `contract.approve`.',
  },
  'POST /admin/contracts/{id}/request-changes': {
    summary: 'Request contract changes',
    description: 'Send contract back for edits. Requires `contract.approve`.',
  },
  'POST /admin/contracts/{id}/send-docusign': {
    summary: 'Send contract via DocuSign',
    description: 'Trigger DocuSign send when integration is configured. Requires contract send permission.',
  },
  'GET /admin/content-sources': {
    summary: 'List content sources',
    description: 'List configured content/media sources (e.g. JetVina reference). Requires `content_source.view`.',
  },
  'POST /admin/content-sources': {
    summary: 'Create content source',
    description: 'Register a new sync source with allowed domains. Requires `content_source.manage`.',
  },
  'POST /admin/content-sources/seed-jetvina-reference': {
    summary: 'Seed JetVina reference source',
    description: 'Idempotent seed of the JetVina reference content source. Requires `content_source.manage`.',
  },
  'GET /admin/content-sources/{id}': {
    summary: 'Get content source',
    description: 'Content source detail. Requires `content_source.view`.',
  },
  'PATCH /admin/content-sources/{id}': {
    summary: 'Update content source',
    description: 'Patch source config (URL, domains, sync mode). Requires `content_source.manage`.',
  },
  'POST /admin/content-sources/{id}/test-connection': {
    summary: 'Test content source connection',
    description: 'Probe reachability of the source base URL. Requires `content_source.manage`.',
  },
  'POST /admin/content-sync/discover': {
    summary: 'Discover sync candidates',
    description: 'Start a discover job (metadata only / dry-run capable). Requires content sync permissions.',
  },
  'GET /admin/content-sync/jobs': {
    summary: 'List sync jobs',
    description: 'List content sync jobs with status filters.',
  },
  'GET /admin/content-sync/jobs/{id}': {
    summary: 'Get sync job',
    description: 'Sync job detail including counts and errors.',
  },
  'GET /admin/content-sync/jobs/{id}/items': {
    summary: 'List sync job items',
    description: 'Per-item review queue for a sync job.',
  },
  'GET /admin/content-sync/jobs/{id}/diff': {
    summary: 'Sync job diff',
    description: 'Diff summary between discovered and existing content.',
  },
  'POST /admin/content-sync/items/{id}/approve': {
    summary: 'Approve sync item',
    description: 'Approve a discovered content item for import/staging.',
  },
  'POST /admin/content-sync/items/{id}/reject': {
    summary: 'Reject sync item',
    description: 'Reject a discovered content item.',
  },
  'POST /admin/content-sync/items/{id}/request-rewrite': {
    summary: 'Request rewrite on sync item',
    description: 'Flag item for editorial rewrite before publish.',
  },
  'GET /admin/content-rights': {
    summary: 'List content rights records',
    description: 'Rights/license records for synced assets.',
  },
  'POST /admin/content-rights': {
    summary: 'Create content rights record',
    description: 'Attach ownership/license metadata to content.',
  },
  'POST /admin/content-rights/{id}/approve': {
    summary: 'Approve content rights',
    description: 'Mark rights as approved for staging/production policy.',
  },
  'POST /admin/content-rights/{id}/block': {
    summary: 'Block content rights',
    description: 'Block asset from further publish due to rights issues.',
  },
  'GET /admin/media-assets': {
    summary: 'List media assets (review)',
    description: 'Admin media review list with rights/status filters.',
  },
  'POST /admin/media-assets': {
    summary: 'Upsert media asset metadata',
    description: 'Create/update media asset alt text, focal, rights flags.',
  },
  'GET /admin/media-assets/{id}': {
    summary: 'Get media asset',
    description: 'Media asset detail for review UI.',
  },
  'POST /admin/media-assets/{id}/approve-staging': {
    summary: 'Approve media for staging',
    description: 'Allow asset in non-production environments.',
  },
  'POST /admin/media-assets/{id}/approve-production': {
    summary: 'Approve media for production',
    description: 'Allow asset on production only when rights status permits.',
  },
  'POST /admin/media-assets/{id}/block': {
    summary: 'Block media asset',
    description: 'Block asset from public resolution.',
  },
  'GET /admin/content-cleanup/jetbay': {
    summary: 'Legacy brand leftover cleanup report',
    description: 'Scan for residual third-party branding/assets in CMS content (internal cleanup tool).',
  },
  'GET /admin/site-settings/brand': {
    summary: 'Get brand site settings',
    description: 'Admin brand settings (name, logo flags).',
  },
  'PATCH /admin/site-settings/brand': {
    summary: 'Update brand site settings',
    description: 'Patch public brand settings used by web/admin.',
  },
  'GET /admin/content-sync/flags': {
    summary: 'Content sync feature flags',
    description: 'Runtime flags for content-sync / media production gates.',
  },
};

const HTTP_METHODS = new Set(['get', 'post', 'put', 'patch', 'delete', 'options', 'head']);

function authHint(op: Record<string, unknown>, lang: SwaggerLang = 'en'): string {
  const security = op.security as Array<Record<string, unknown>> | undefined;
  const parts: string[] = [];
  const secList = security ?? [];
  const flat = secList.flatMap((s) => Object.keys(s));
  if (flat.includes('bearer') || flat.includes('Bearer')) {
    parts.push(
      lang === 'vi'
        ? 'Cần `Authorization: Bearer` (JWT).'
        : lang === 'zh-cn'
          ? '需要 `Authorization: Bearer`（JWT）。'
          : 'Requires `Authorization: Bearer` (JWT).',
    );
  }
  if (flat.includes('X-API-Key')) {
    parts.push(
      lang === 'vi'
        ? 'Cần header `X-API-Key`.'
        : lang === 'zh-cn'
          ? '需要 Header `X-API-Key`。'
          : 'Requires header `X-API-Key`.',
    );
  }
  if (parts.length === 0) {
    const summary = String(op.summary ?? '');
    const isPublicLike = /public|health|liveness|root index|công khai|存活|公开/i.test(
      summary,
    );
    return getAuthHintLocalized(lang, isPublicLike);
  }
  return parts.join(' ');
}

function humanizePath(method: string, path: string): string {
  const m = method.toUpperCase();
  const clean = path.replace(/\{([^}]+)\}/g, ':$1');
  if (m === 'GET' && path.endsWith('s') && !path.includes('{')) return `List ${clean}`;
  if (m === 'GET' && path.includes('{')) return `Get ${clean}`;
  if (m === 'POST') return `Create / submit ${clean}`;
  if (m === 'PATCH' || m === 'PUT') return `Update ${clean}`;
  if (m === 'DELETE') return `Delete ${clean}`;
  return `${m} ${clean}`;
}

function authorizeFooter(lang: SwaggerLang): string {
  if (lang === 'vi') {
    return 'Dùng **Ủy quyền** với `X-API-Key` và (khi cần) `bearer` JWT từ `POST /auth/login`.';
  }
  if (lang === 'zh-cn') {
    return '使用 **授权** 填写 `X-API-Key`，必要时再填 `POST /auth/login` 返回的 `bearer` JWT。';
  }
  return 'Use Swagger **Authorize** with `X-API-Key` and (when required) `bearer` JWT from `POST /auth/login`.';
}

function buildDescription(
  summary: string,
  method: string,
  path: string,
  op: Record<string, unknown>,
  lang: SwaggerLang,
): string {
  const tags = (op.tags as string[] | undefined)?.join(', ') || 'API';
  const auth = authHint(op, lang);
  const tagLabel = lang === 'vi' ? 'Nhóm' : lang === 'zh-cn' ? '分组' : 'Tag';
  const methodLabel =
    lang === 'vi' ? 'Method / path' : lang === 'zh-cn' ? '方法 / 路径' : 'Method / path';
  return [
    summary,
    '',
    `**${tagLabel}:** ${tags}`,
    `**${methodLabel}:** \`${method.toUpperCase()} ${path}\``,
    '',
    auth,
    '',
    authorizeFooter(lang),
  ].join('\n');
}

function responseText(code: string, lang: SwaggerLang): string {
  if (lang === 'vi') {
    if (code === '200' || code === '201') return 'Thành công';
    if (code === '401') return 'Unauthorized — thiếu/sai X-API-Key hoặc JWT';
    if (code === '403') return 'Forbidden — thiếu quyền';
    if (code === '404') return 'Không tìm thấy';
    if (code === '429') return 'Quá nhiều request — bị rate limit';
    return `HTTP ${code}`;
  }
  if (lang === 'zh-cn') {
    if (code === '200' || code === '201') return '成功';
    if (code === '401') return '未授权 — 缺少/无效 X-API-Key 或 JWT';
    if (code === '403') return '禁止 — 权限不足';
    if (code === '404') return '未找到';
    if (code === '429') return '请求过多 — 触发限流';
    return `HTTP ${code}`;
  }
  if (code === '200' || code === '201') return 'Success';
  if (code === '401') return 'Unauthorized — missing/invalid X-API-Key or JWT';
  if (code === '403') return 'Forbidden — insufficient role/permission';
  if (code === '404') return 'Not found';
  if (code === '429') return 'Too many requests — rate limited';
  return `HTTP ${code}`;
}

/**
 * Mutates and returns the OpenAPI document with complete tag + operation docs.
 * Pass `lang` for localized intro/tags/auth hints (operation summaries stay EN technical).
 */
export function enrichOpenApiDocument(
  document: OpenAPIObject,
  langInput?: string | null,
): OpenAPIObject {
  const lang = normalizeSwaggerLang(langInput);
  const tagMap = new Map(SWAGGER_TAG_META.map((t) => [t.name, t.description]));
  const existingTags = new Map((document.tags ?? []).map((t) => [t.name, t]));

  if (document.info) {
    document.info.description = getSwaggerIntro(lang);
    if (lang === 'vi') document.info.title = 'JetVina API — Tài liệu';
    else if (lang === 'zh-cn') document.info.title = 'JetVina API — 文档';
    else document.info.title = 'JetVina API';
  }

  document.tags = SWAGGER_TAG_META.map((t) => {
    const prev = existingTags.get(t.name);
    const enDesc = prev?.description || t.description;
    return {
      name: t.name,
      description: getSwaggerTagDescription(lang, t.name, enDesc),
    };
  });

  for (const [name, tag] of existingTags) {
    if (!tagMap.has(name)) {
      document.tags.push({
        name,
        description:
          getSwaggerTagDescription(lang, name, tag.description || `${name} endpoints`),
      });
    }
  }

  for (const [path, item] of Object.entries(document.paths ?? {})) {
    if (!item || typeof item !== 'object') continue;
    for (const [method, raw] of Object.entries(item as Record<string, unknown>)) {
      if (!HTTP_METHODS.has(method)) continue;
      if (!raw || typeof raw !== 'object') continue;
      const op = raw as Record<string, unknown>;
      const key = `${method.toUpperCase()} ${path}`;
      const catalog = OP_DOCS[key];

      if (catalog) {
        op.summary = catalog.summary;
        // Keep EN catalog body, append localized auth footer when not EN
        op.description =
          lang === 'en'
            ? catalog.description
            : `${catalog.description}\n\n---\n\n${authorizeFooter(lang)}`;
      } else {
        if (!op.summary || !String(op.summary).trim()) {
          op.summary = humanizePath(method, path);
        }
        // Always rebuild description so lang switch refreshes auth hints
        op.description = buildDescription(
          String(op.summary),
          method,
          path,
          op,
          lang,
        );
      }

      const responses = (op.responses ?? {}) as Record<string, { description?: string }>;
      for (const [code, resp] of Object.entries(responses)) {
        if (resp) {
          resp.description = responseText(code, lang);
        }
      }
      op.responses = responses;
    }
  }

  return document;
}

/** @deprecated use getSwaggerIntro('en') — kept for DocumentBuilder bootstrap */
export const SWAGGER_API_DESCRIPTION = getSwaggerIntro('en');
