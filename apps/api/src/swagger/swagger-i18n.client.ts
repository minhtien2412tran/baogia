import { SWAGGER_LANGS, getSwaggerUiPack, type SwaggerLang } from './swagger-locales';

/** Client script injected into Swagger HTML (customJsStr). */
export function buildSwaggerI18nJs(): string {
  const langsJson = JSON.stringify(SWAGGER_LANGS);
  const packs: Record<string, Record<string, string>> = {
    en: getSwaggerUiPack('en'),
    vi: getSwaggerUiPack('vi'),
    'zh-cn': getSwaggerUiPack('zh-cn'),
  };
  const packsJson = JSON.stringify(packs);

  return `
(function () {
  var LANGS = ${langsJson};
  var PACKS = ${packsJson};
  var STORAGE_KEY = 'jb_swagger_lang';

  function normalize(raw) {
    var v = String(raw || '').toLowerCase();
    if (v.indexOf('vi') === 0) return 'vi';
    if (v.indexOf('zh') === 0) return 'zh-cn';
    return 'en';
  }

  function currentLang() {
    try {
      var q = new URLSearchParams(window.location.search).get('lang');
      if (q) return normalize(q);
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return normalize(stored);
    } catch (e) {}
    var nav = (navigator.language || 'en').toLowerCase();
    if (nav.indexOf('vi') === 0) return 'vi';
    if (nav.indexOf('zh') === 0) return 'zh-cn';
    return 'en';
  }

  function setLang(lang) {
    lang = normalize(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    var url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.location.href = url.toString();
  }

  function applyUiText(lang) {
    var pack = PACKS[lang] || PACKS.en;

    document.querySelectorAll('.btn.authorize span, .btn.authorize').forEach(function (el) {
      if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
        el.textContent = pack.authorize;
      } else {
        var span = el.querySelector('span');
        if (span) span.textContent = pack.authorize;
      }
    });

    document.querySelectorAll('.try-out__btn').forEach(function (el) {
      var t = (el.textContent || '').trim().toLowerCase();
      if (t.indexOf('cancel') >= 0 || t === pack.cancel.toLowerCase()) el.textContent = pack.cancel;
      else el.textContent = pack.tryItOut;
    });
    document.querySelectorAll('.btn.execute').forEach(function (el) {
      el.textContent = pack.execute;
    });
    document.querySelectorAll('.btn.clear').forEach(function (el) {
      el.textContent = pack.clear;
    });
    document.querySelectorAll('.btn-done').forEach(function (el) {
      el.textContent = pack.close;
    });

    var filter = document.querySelector('.operation-filter-input');
    if (filter) filter.setAttribute('placeholder', pack.filterPlaceholder);

    var tip = document.querySelector('.jb-docs-tip');
    if (tip) tip.textContent = pack.tipMobile;
    var lab = document.querySelector('.jb-lang label');
    if (lab) lab.textContent = pack.langLabel;
  }

  function ensureBar(lang) {
    if (document.querySelector('.jb-docs-bar')) return;
    var bar = document.createElement('div');
    bar.className = 'jb-docs-bar';
    bar.innerHTML =
      '<div class="jb-docs-brand"><strong>JETVINA API DOCS</strong><span class="jb-docs-tip"></span></div>' +
      '<div class="jb-lang"><label for="jb-swagger-lang"></label><select id="jb-swagger-lang" aria-label="Language"></select></div>';
    document.body.insertBefore(bar, document.body.firstChild);
    var sel = bar.querySelector('select');
    LANGS.forEach(function (l) {
      var opt = document.createElement('option');
      opt.value = l.code;
      opt.textContent = l.label;
      if (l.code === lang) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.addEventListener('change', function () {
      setLang(sel.value);
    });
  }

  function boot() {
    var lang = currentLang();
    try {
      var url = new URL(window.location.href);
      if (!url.searchParams.get('lang')) {
        url.searchParams.set('lang', lang);
        history.replaceState(null, '', url.pathname + '?' + url.searchParams.toString());
      }
    } catch (e) {}

    ensureBar(lang);
    applyUiText(lang);

    var obs = new MutationObserver(function () {
      applyUiText(lang);
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
`.trim();
}

export type { SwaggerLang };
