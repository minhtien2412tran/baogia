/** Responsive JetVina Swagger UI theme (inline via customCss). */
export const SWAGGER_THEME_CSS = `
:root {
  --jb-bg: #0b0e14;
  --jb-bg2: #121722;
  --jb-card: #161d2b;
  --jb-border: rgba(201, 164, 92, 0.28);
  --jb-gold: #c9a45c;
  --jb-gold2: #e8c98a;
  --jb-text: #eef1f6;
  --jb-muted: #9aa3b2;
  --jb-ok: #3ecf8e;
  --jb-warn: #f0b429;
  --jb-err: #f07178;
  --jb-radius: 14px;
  --jb-font: "Segoe UI", system-ui, -apple-system, "Noto Sans", sans-serif;
}

html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: radial-gradient(1200px 600px at 10% -10%, #1a2438 0%, var(--jb-bg) 55%) !important;
  color: var(--jb-text);
  font-family: var(--jb-font);
}

.swagger-ui .topbar { display: none !important; }

/* Floating language + tip bar */
.jb-docs-bar {
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 16px;
  padding: 10px 14px;
  background: rgba(11, 14, 20, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--jb-border);
}
.jb-docs-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.jb-docs-brand strong {
  color: var(--jb-gold2);
  font-size: 14px;
  letter-spacing: 0.04em;
  white-space: nowrap;
}
.jb-docs-tip {
  color: var(--jb-muted);
  font-size: 12px;
  line-height: 1.35;
  max-width: 520px;
}
.jb-lang {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}
.jb-lang label {
  color: var(--jb-muted);
  font-size: 12px;
}
.jb-lang select {
  appearance: none;
  background: var(--jb-card);
  color: var(--jb-text);
  border: 1px solid var(--jb-border);
  border-radius: 999px;
  padding: 8px 34px 8px 14px;
  font-size: 13px;
  background-image: linear-gradient(45deg, transparent 50%, var(--jb-gold) 50%),
    linear-gradient(135deg, var(--jb-gold) 50%, transparent 50%);
  background-position: calc(100% - 16px) 55%, calc(100% - 11px) 55%;
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
  min-height: 40px;
  min-width: 140px;
}
.jb-lang select:focus {
  outline: 2px solid rgba(201, 164, 92, 0.45);
  outline-offset: 2px;
}

.swagger-ui {
  max-width: 1120px;
  margin: 0 auto;
  padding: 8px 12px 48px;
}

.swagger-ui .information-container {
  padding: 8px 0 0 !important;
}
.swagger-ui .info {
  margin: 12px 0 20px !important;
}
.swagger-ui .info .title {
  color: var(--jb-text) !important;
  font-size: clamp(1.45rem, 4vw, 2rem) !important;
  font-weight: 700 !important;
}
.swagger-ui .info .title small {
  background: rgba(201, 164, 92, 0.15) !important;
  border: 1px solid var(--jb-border);
  color: var(--jb-gold2) !important;
}
.swagger-ui .info p,
.swagger-ui .info li,
.swagger-ui .info table,
.swagger-ui .markdown p,
.swagger-ui .markdown li {
  color: var(--jb-muted) !important;
  font-size: 14px !important;
  line-height: 1.6 !important;
}
.swagger-ui .info a { color: var(--jb-gold2) !important; }
.swagger-ui .info .description { max-width: 100% !important; }
.swagger-ui .info table {
  display: block;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  width: 100%;
}
.swagger-ui .info th,
.swagger-ui .info td {
  border-color: rgba(255,255,255,0.08) !important;
  padding: 8px 10px !important;
  white-space: nowrap;
}

.swagger-ui .scheme-container {
  background: var(--jb-card) !important;
  box-shadow: none !important;
  border: 1px solid var(--jb-border);
  border-radius: var(--jb-radius);
  margin: 0 0 18px !important;
  padding: 12px !important;
}
.swagger-ui .auth-wrapper .authorize,
.swagger-ui .btn.authorize {
  background: transparent !important;
  border: 1px solid var(--jb-gold) !important;
  color: var(--jb-gold2) !important;
  border-radius: 999px !important;
  min-height: 40px;
  padding: 8px 16px !important;
  font-weight: 600 !important;
}
.swagger-ui .btn.authorize svg { fill: var(--jb-gold2) !important; }

.swagger-ui .opblock-tag-section {
  margin-bottom: 10px;
}
.swagger-ui .opblock-tag {
  border-bottom: 1px solid rgba(255,255,255,0.08) !important;
  color: var(--jb-text) !important;
  font-size: 16px !important;
  padding: 12px 4px !important;
}
.swagger-ui .opblock-tag small {
  color: var(--jb-muted) !important;
  font-size: 12px !important;
  font-weight: 400 !important;
}

.swagger-ui .opblock {
  background: var(--jb-card) !important;
  border: 1px solid rgba(255,255,255,0.08) !important;
  border-radius: 12px !important;
  box-shadow: none !important;
  margin: 0 0 10px !important;
  overflow: hidden;
}
.swagger-ui .opblock .opblock-summary {
  padding: 10px 12px !important;
  align-items: flex-start !important;
  gap: 8px;
}
.swagger-ui .opblock .opblock-summary-method {
  border-radius: 8px !important;
  min-width: 68px !important;
  font-size: 11px !important;
  font-weight: 700 !important;
}
.swagger-ui .opblock .opblock-summary-path,
.swagger-ui .opblock .opblock-summary-path__deprecated {
  color: var(--jb-text) !important;
  font-size: 13px !important;
  word-break: break-all;
}
.swagger-ui .opblock .opblock-summary-description {
  color: var(--jb-muted) !important;
  font-size: 12px !important;
}
.swagger-ui .opblock-body {
  background: rgba(0,0,0,0.15) !important;
}
.swagger-ui .opblock-section-header {
  background: transparent !important;
  box-shadow: none !important;
}
.swagger-ui .opblock-section-header h4,
.swagger-ui .opblock-description-wrapper p,
.swagger-ui .opblock-description-wrapper,
.swagger-ui label,
.swagger-ui .parameter__name,
.swagger-ui .parameter__type,
.swagger-ui .response-col_status,
.swagger-ui .response-col_description,
.swagger-ui .tab li,
.swagger-ui .model-title,
.swagger-ui table thead tr td,
.swagger-ui table thead tr th,
.swagger-ui .response-col_links {
  color: var(--jb-muted) !important;
}
.swagger-ui .parameter__name {
  color: var(--jb-text) !important;
}

.swagger-ui select,
.swagger-ui input[type=text],
.swagger-ui input[type=password],
.swagger-ui input[type=search],
.swagger-ui input[type=email],
.swagger-ui textarea,
.swagger-ui .microlight {
  background: #0d121c !important;
  color: var(--jb-text) !important;
  border: 1px solid rgba(255,255,255,0.12) !important;
  border-radius: 10px !important;
  font-size: 14px !important;
}
.swagger-ui input[type=text],
.swagger-ui input[type=password],
.swagger-ui input[type=search],
.swagger-ui textarea {
  min-height: 42px;
  padding: 10px 12px !important;
}
.swagger-ui textarea { min-height: 120px; }

.swagger-ui .btn {
  border-radius: 999px !important;
  min-height: 40px;
  font-weight: 600 !important;
}
.swagger-ui .btn.execute {
  background: var(--jb-gold) !important;
  color: #111 !important;
  border-color: var(--jb-gold) !important;
}
.swagger-ui .btn.cancel {
  border-color: rgba(255,255,255,0.2) !important;
  color: var(--jb-text) !important;
  background: transparent !important;
}

.swagger-ui .filter-container {
  margin: 0 0 14px !important;
  padding: 0 !important;
}
.swagger-ui .filter .operation-filter-input {
  width: 100% !important;
  margin: 0 !important;
  border-radius: 999px !important;
  border: 1px solid var(--jb-border) !important;
  background: var(--jb-card) !important;
  color: var(--jb-text) !important;
  min-height: 44px;
  padding: 10px 16px !important;
}

.swagger-ui .dialog-ux .modal-ux {
  background: var(--jb-bg2) !important;
  border: 1px solid var(--jb-border) !important;
  border-radius: 16px !important;
  color: var(--jb-text) !important;
  max-width: min(560px, 94vw) !important;
}
.swagger-ui .dialog-ux .modal-ux-header h3,
.swagger-ui .dialog-ux .modal-ux-content h4,
.swagger-ui .dialog-ux label,
.swagger-ui .dialog-ux p {
  color: var(--jb-text) !important;
}

.swagger-ui .highlight-code,
.swagger-ui .microlight {
  border-radius: 12px !important;
}
.swagger-ui .responses-inner h4,
.swagger-ui .responses-inner h5 {
  color: var(--jb-gold2) !important;
}

.swagger-ui section.models {
  border: 1px solid rgba(255,255,255,0.08) !important;
  border-radius: var(--jb-radius);
  background: var(--jb-card) !important;
}
.swagger-ui section.models h4 { color: var(--jb-text) !important; }
.swagger-ui .model { color: var(--jb-muted) !important; }

/* Mobile / tablet */
@media (max-width: 900px) {
  .swagger-ui { padding: 6px 8px 40px; }
  .jb-docs-tip { display: none; }
  .swagger-ui .opblock .opblock-summary {
    flex-wrap: wrap;
  }
  .swagger-ui .opblock .opblock-summary-path {
    flex: 1 1 100%;
    order: 3;
    margin-top: 4px;
  }
  .swagger-ui .opblock .opblock-summary-description {
    flex: 1 1 100%;
    order: 4;
  }
  .swagger-ui .parameters-col_description,
  .swagger-ui .response-col_description {
    display: block !important;
  }
  .swagger-ui table {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}

@media (max-width: 560px) {
  .jb-docs-bar { padding: 10px; }
  .jb-docs-brand strong { font-size: 13px; }
  .jb-lang { width: 100%; justify-content: space-between; }
  .jb-lang select { flex: 1; }
  .swagger-ui .scheme-container .schemes {
    flex-direction: column;
    align-items: stretch !important;
    gap: 10px;
  }
  .swagger-ui .auth-wrapper {
    justify-content: stretch !important;
  }
  .swagger-ui .btn.authorize { width: 100%; }
  .swagger-ui .opblock .opblock-summary-method {
    min-width: 56px !important;
  }
  .swagger-ui .execute-wrapper {
    padding: 12px !important;
  }
  .swagger-ui .btn.execute,
  .swagger-ui .btn.try-out__btn {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}

/* Larger tap targets for try-it-out on touch */
@media (pointer: coarse) {
  .swagger-ui .opblock-summary { min-height: 52px; }
  .swagger-ui .btn { min-height: 44px; padding-left: 16px !important; padding-right: 16px !important; }
}
`;
