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
  var COOKIE_KEY = 'jb_swagger_lang';
  var applying = false;
  var specLoadedFor = null;

  function normalize(raw) {
    var v = String(raw || '').toLowerCase();
    if (v.indexOf('vi') === 0) return 'vi';
    if (v.indexOf('zh') === 0) return 'zh-cn';
    return 'en';
  }

  function setCookie(lang) {
    try {
      document.cookie =
        COOKIE_KEY +
        '=' +
        encodeURIComponent(lang) +
        '; Path=/; Max-Age=31536000; SameSite=Lax';
    } catch (e) {}
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
    setCookie(lang);
    var url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.location.href = url.toString();
  }

  function setText(el, value) {
    if (!el || el.getAttribute('data-jb-i18n') === value) return;
    if ((el.textContent || '').trim() === value) {
      el.setAttribute('data-jb-i18n', value);
      return;
    }
    el.textContent = value;
    el.setAttribute('data-jb-i18n', value);
  }

  function applyUiText(lang) {
    if (applying) return;
    applying = true;
    try {
      var pack = PACKS[lang] || PACKS.en;

      document.querySelectorAll('.btn.authorize').forEach(function (el) {
        var span = el.querySelector('span');
        setText(span || el, pack.authorize);
      });

      document.querySelectorAll('.try-out__btn').forEach(function (el) {
        var t = (el.textContent || '').trim().toLowerCase();
        var isCancel =
          el.classList.contains('cancel') ||
          t.indexOf('cancel') >= 0 ||
          t === pack.cancel.toLowerCase();
        setText(el, isCancel ? pack.cancel : pack.tryItOut);
      });
      document.querySelectorAll('.btn.execute').forEach(function (el) {
        setText(el, pack.execute);
      });
      document.querySelectorAll('.btn.clear').forEach(function (el) {
        setText(el, pack.clear);
      });
      document.querySelectorAll('.btn-done').forEach(function (el) {
        setText(el, pack.close);
      });

      var filter = document.querySelector('.operation-filter-input');
      if (filter && filter.getAttribute('placeholder') !== pack.filterPlaceholder) {
        filter.setAttribute('placeholder', pack.filterPlaceholder);
      }

      var tip = document.querySelector('.jb-docs-tip');
      if (tip) setText(tip, pack.tipMobile);
      var lab = document.querySelector('.jb-lang label');
      if (lab) setText(lab, pack.langLabel);
    } finally {
      applying = false;
    }
  }

  function ensureBar(lang) {
    if (document.querySelector('.jb-docs-bar')) return;
    var bar = document.createElement('div');
    bar.className = 'jb-docs-bar';
    bar.innerHTML =
      '<div class="jb-docs-brand"><strong>JETVINA API DOCS</strong><span class="jb-docs-tip"></span></div>' +
      '<div class="jb-lang"><label for="jb-swagger-lang"></label><select id="jb-swagger-lang" aria-label="Language"></select></div>';
    var host = document.getElementById('swagger-ui');
    if (host && host.parentNode) {
      host.parentNode.insertBefore(bar, host);
    } else {
      document.body.insertBefore(bar, document.body.firstChild);
    }
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

  function openApiUrl(lang) {
    return window.location.origin + '/openapi.json?lang=' + encodeURIComponent(lang);
  }

  function applyLocalizedSpec(lang) {
    if (specLoadedFor === lang) return;
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      var ui = window.ui;
      if (!ui || !ui.specActions) {
        if (tries > 80) clearInterval(timer);
        return;
      }
      clearInterval(timer);
      fetch(openApiUrl(lang), { credentials: 'same-origin' })
        .then(function (r) {
          if (!r.ok) throw new Error('openapi ' + r.status);
          return r.json();
        })
        .then(function (spec) {
          specLoadedFor = lang;
          if (ui.specActions.updateJsonSpec) {
            ui.specActions.updateJsonSpec(spec);
          } else if (ui.specActions.updateSpec) {
            ui.specActions.updateSpec(JSON.stringify(spec));
          }
          if (spec && spec.info && spec.info.title) {
            document.title = spec.info.title;
          }
          setTimeout(function () {
            applyUiText(lang);
          }, 100);
        })
        .catch(function () {
          /* keep embedded EN spec */
        });
    }, 50);
  }

  function boot() {
    var lang = currentLang();
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
    setCookie(lang);
    try {
      var url = new URL(window.location.href);
      if (!url.searchParams.get('lang')) {
        url.searchParams.set('lang', lang);
        history.replaceState(null, '', url.pathname + '?' + url.searchParams.toString());
      }
    } catch (e) {}

    ensureBar(lang);
    applyUiText(lang);
    applyLocalizedSpec(lang);

    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      applyUiText(lang);
      if (document.querySelector('.swagger-ui .opblock-tag') || tries > 40) {
        clearInterval(timer);
      }
    }, 250);
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
