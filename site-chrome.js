// /site-chrome.js
(() => {
  const getVersion = () => {
    // Prefer the script tag's data attribute; fall back to placeholders
    const s = document.querySelector('script[src*="/site-chrome.js"]');
    return s?.dataset.chromeVersion
        || document.getElementById('site-header')?.dataset.chromeVersion
        || '';
  };

  const bust = (url, v) => {
    if (!v) return url;
    return url + (url.includes('?') ? '&' : '?') + 'v=' + encodeURIComponent(v);
  };

  async function injectEl(el, version) {
    const path = el?.dataset?.chromePath;
    if (!path) return;
    const url = bust(path, version);
    const res = await fetch(url, { credentials: 'same-origin', cache: 'no-store' });
    if (!res.ok) throw new Error(`Fetch failed: ${url} (${res.status})`);
    const html = await res.text();
    el.innerHTML = html;
  }

  async function run() {
    const version = getVersion();
    const parts = Array.from(document.querySelectorAll('[data-chrome-path]'));
    if (!parts.length) return;

    try {
      await Promise.all(parts.map(el => injectEl(el, version)));
      // Optional: ensure the mobile drawer starts hidden if present
      const drawer = document.getElementById('mobile-nav');
      if (drawer && !drawer.hasAttribute('hidden')) drawer.setAttribute('hidden', '');
      window.dispatchEvent(new CustomEvent('chrome:ready'));
    } catch (err) {
      console.error('[site-chrome] injection error:', err);
      window.dispatchEvent(new CustomEvent('chrome:error', { detail: err }));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
