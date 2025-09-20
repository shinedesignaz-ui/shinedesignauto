// /site-chrome.js — minimal, reliable injector for header/footer partials
(function () {
  // Read a cache-busting version from the script tag (e.g., data-chrome-version="2025-09-19-03")
  const self = document.currentScript;
  const VERSION = (self && (self.dataset.chromeVersion || self.getAttribute('data-chrome-version'))) || '2025-09-19-03';

  // Helper: add ?v=VERSION to a URL
  const withVer = (url) => url + (url.includes('?') ? '&' : '?') + 'v=' + encodeURIComponent(VERSION);

  // Generic injector for a mount element
  async function inject(mountEl, evtName) {
    if (!mountEl || !mountEl.dataset.chromePath) return;

    const src = withVer(mountEl.dataset.chromePath);
    try {
      const res = await fetch(src, { cache: 'no-store', credentials: 'same-origin' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      mountEl.innerHTML = html;

      // Fire the “mounted” event after DOM updates so listeners can query elements reliably
      queueMicrotask(() => window.dispatchEvent(new CustomEvent(evtName)));
    } catch (err) {
      console.error(`[site-chrome] Failed to inject ${evtName} from ${src}:`, err);
    }
  }

  async function injectChrome() {
    // Ensure placeholders exist (safe if already present)
    if (!document.getElementById('site-header')) {
      const top = document.createElement('div');
      top.id = 'site-header';
      top.dataset.chromePath = '/partials/header';
      document.body.insertBefore(top, document.body.firstChild);
    }
    if (!document.getElementById('site-footer')) {
      const bottom = document.createElement('div');
      bottom.id = 'site-footer';
      bottom.dataset.chromePath = '/partials/footer';
      document.body.appendChild(bottom);
    }

    const headerMount = document.getElementById('site-header');
    const footerMount = document.getElementById('site-footer');

    await inject(headerMount, 'site-chrome:header-mounted');
    await inject(footerMount, 'site-chrome:footer-mounted');
  }

  document.addEventListener('DOMContentLoaded', injectChrome);

  // Optional manual hook if you ever want to retrigger injection
  window.ShineChrome = {
    reload: injectChrome,
    version: VERSION
  };
})();
