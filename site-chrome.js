(() => {
  // ===== Versioning & one-time guards
  const scriptEl = document.currentScript;
  const VERSION =
    (scriptEl && (scriptEl.dataset.chromeVersion || scriptEl.getAttribute('data-chrome-version'))) || '11';

  if (window.__shineChromeVersion === VERSION && window.__shineChromeBooted) return;
  window.__shineChromeVersion = VERSION;
  window.__shineChromeBooted = true;

  const vParam = (url) => url + (url.includes('?') ? '&' : '?') + 'v=' + encodeURIComponent(VERSION);
  const key = (p) => `chrome:${VERSION}:${p}`;

  // ===== Ensure header CSS (fallback)
  (function injectHeaderCSS(){
    const href = '/assets/css/header-styles.css';
    const already =
      document.querySelector(`link[rel="stylesheet"][href^="${href}"]`) ||
      Array.from(document.styleSheets || []).some(s => s.href && s.href.includes(href));
    if (!already) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = vParam(href);
      document.head.appendChild(link);
    }
  })();

  // ===== Remove any legacy static chrome
  function removeLegacyChrome(){
    document.querySelectorAll('header.main-header, header#main-header, header.site-header, .micro-footer, footer.site-footer')
      .forEach(el => el.remove());
  }

  // ===== Ensure mount placeholders
  function ensurePlaceholders(){
    if (!document.getElementById('site-header')) {
      const top = document.createElement('div');
      top.id = 'site-header';
      top.setAttribute('data-chrome-path', '/partials/header.html');
      document.body.insertBefore(top, document.body.firstChild);
    }
    if (!document.getElementById('site-footer')) {
      const bottom = document.createElement('div');
      bottom.id = 'site-footer';
      bottom.setAttribute('data-chrome-path', '/partials/footer.html');
      document.body.appendChild(bottom);
    }
  }

  // ===== Mount helper (localStorage cache + rewire)
  async function mount(id, path, after){
    const slot = document.getElementById(id) || document.querySelector(`[data-chrome-path="${path}"]`);
    if (!slot) return;

    try {
      const cached = localStorage.getItem(key(path));
      if (cached) {
        slot.outerHTML = cached;
        if (typeof after === 'function') queueMicrotask(after);
      }
    } catch {}

    try {
      const res = await fetch(vParam(path), { cache: 'no-store', credentials: 'same-origin' });
      if (!res.ok) return;
      const html = await res.text();
      try { localStorage.setItem(key(path), html); } catch {}
      const target = document.getElementById(id) || document.querySelector(`[data-chrome-path="${path}"]`);
      if (target) {
        target.outerHTML = html;
        if (typeof after === 'function') after();
      }
    } catch (e) {
      console.error('[site-chrome] fetch error', e);
    }
  }

  // ===== Create a simple mobile drawer if missing
  function buildMobileNavIfMissing(header){
    let menu = document.getElementById('mobile-nav');
    if (menu) return menu;

    menu = document.createElement('nav');
    menu.id = 'mobile-nav';
    menu.setAttribute('hidden','');
    menu.setAttribute('aria-label','Mobile');

    const panel = document.createElement('div');
    panel.className = 'mobile-panel';

    // Clone desktop links (top-level + dropdown items)
    const links = [];
    header.querySelectorAll('.nav-links > a').forEach(a => links.push(a));
    header.querySelectorAll('.nav-dropdown .dropdown-menu a').forEach(a => links.push(a));

    links.forEach(a => {
      const href = a.getAttribute('href');
      const label = (a.textContent || '').trim();
      if (!href || !label) return;
      const m = document.createElement('a');
      m.href = href;
      m.textContent = label;
      panel.appendChild(m);
    });

    // Book Now CTA (if present on desktop, keep it too)
    const cta = header.querySelector('.cta');
    if (cta) {
      const mcta = document.createElement('a');
      mcta.className = 'cta';
      mcta.href = cta.getAttribute('href') || '#';
      mcta.textContent = cta.textContent.trim() || 'Book Now';
      panel.appendChild(mcta);
    }

    // Sticky call/text bar (phone derived from page, fallback to your number)
    const phoneLink = document.querySelector('a[href^="tel:"]');
    const phone = phoneLink ? phoneLink.getAttribute('href').replace('tel:','') : '14805288227';

    const bar = document.createElement('div');
    bar.className = 'mobile-call';
    bar.innerHTML = `
      <div class="btn-row">
        <a class="btn-call" href="tel:+${phone}"><svg class="icon-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 5a2 2 0 0 1 2-2h3.3a1 1 0 0 1 .95.68l1.5 4.5a1 1 0 0 1-.5 1.2l-2.26 1.13a11 11 0 0 0 5.52 5.52l1.13-2.26a1 1 0 0 1 1.2-.5l4.5 1.5a1 1 0 0 1 .68.95V19a2 2 0 0 1-2 2h-1C9.7 21 3 14.3 3 6V5z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Call</a>
        <a class="btn-text" href="sms:+${phone}"><svg class="icon-text" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12c0 4.4-4 8-9 8-1.5 0-2.9-.3-4.3-.9L3 20l1.4-3.7A8.9 8.9 0 0 1 3 12C3 7.6 7 4 12 4s9 3.6 9 8ZM8 12h.01M12 12h.01M16 12h.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Text</a>
      </div>
      <div class="hours">Open 8am–6pm</div>
    `;
    panel.appendChild(bar);

    menu.appendChild(panel);
    // place right after header
    (header.nextElementSibling ? header : document.body).insertAdjacentElement('afterend', menu);

    return menu;
  }

  // ===== Header wiring (desktop dropdowns + mobile drawer/submenus)
  function wireHeader(){
    if (window.__shineHeaderWired) return;
    window.__shineHeaderWired = true;

    const header = document.querySelector('header.main-header, header#main-header, header.site-header');
    if (!header) return;

    // Desktop dropdown a11y
    header.querySelectorAll('.nav-dropdown').forEach((dd) => {
      const trigger = dd.querySelector(':scope > a');
      const menu = dd.querySelector(':scope .dropdown-menu');
      if (!trigger || !menu) return;

      function open(){
        dd.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
      }
      function close(){
        dd.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        menu.style.opacity = '';
        menu.style.visibility = '';
      }

      dd.addEventListener('mouseenter', open, { passive: true });
      dd.addEventListener('mouseleave', close, { passive: true });
      dd.addEventListener('focusin', open);
      dd.addEventListener('focusout', (e) => { if (!dd.contains(e.relatedTarget)) close(); });
      dd.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { e.stopPropagation(); close(); trigger.focus(); }
      });
    });

    // Mobile drawer (global lookup; create if absent)
    const btn  = header.querySelector('.menu-btn');
    let menu = document.getElementById('mobile-nav') || buildMobileNavIfMissing(header);
    if (!btn || !menu) return;

    // Initial state + ARIA
    if (!menu.hasAttribute('hidden')) menu.setAttribute('hidden','');
    btn.setAttribute('aria-controls', 'mobile-nav');
    btn.setAttribute('aria-expanded', 'false');

    function openDrawer(){
      menu.removeAttribute('hidden');
      btn.setAttribute('aria-expanded','true');
      if (!btn.dataset._origLabel) btn.dataset._origLabel = btn.textContent;
      btn.textContent = '✕';
      document.documentElement.style.overflow = 'hidden';
    }
    function closeDrawer(){
      menu.setAttribute('hidden','');
      btn.setAttribute('aria-expanded','false');
      if (btn.dataset._origLabel) btn.textContent = btn.dataset._origLabel;
      document.documentElement.style.overflow = '';
      document.querySelectorAll('.mobile-dropdown').forEach((d)=>{
        d.classList.remove('open');
        const sub = d.querySelector('.mobile-submenu');
        const b = d.querySelector('button[aria-expanded]');
        if (sub) sub.setAttribute('hidden','');
        if (b) b.setAttribute('aria-expanded','false');
      });
    }

    btn.addEventListener('click', () => {
      if (menu.hasAttribute('hidden')) openDrawer(); else closeDrawer();
    });

    document.addEventListener('click', (e) => {
      if (!menu.hasAttribute('hidden') && !btn.contains(e.target) && !menu.contains(e.target)) closeDrawer();
    }, { passive: true });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hasAttribute('hidden')) closeDrawer();
    });

    // Mobile accordion (only if .mobile-dropdown groups exist)
    document.querySelectorAll('.mobile-dropdown').forEach((block) => {
      const toggle = block.querySelector('button');
      const submenu = block.querySelector('.mobile-submenu');
      if (!toggle || !submenu) return;

      toggle.setAttribute('aria-expanded', 'false');
      submenu.setAttribute('hidden','');

      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const willOpen = toggle.getAttribute('aria-expanded') !== 'true';

        document.querySelectorAll('.mobile-dropdown').forEach((d) => {
          const b = d.querySelector('button');
          const s = d.querySelector('.mobile-submenu');
          d.classList.remove('open');
          if (b) b.setAttribute('aria-expanded','false');
          if (s) s.setAttribute('hidden','');
        });

        if (willOpen) {
          block.classList.add('open');
          toggle.setAttribute('aria-expanded','true');
          submenu.removeAttribute('hidden');
        } else {
          block.classList.remove('open');
          toggle.setAttribute('aria-expanded','false');
          submenu.setAttribute('hidden','');
        }
      });
    });
  }

  // Expose no-op safe hook for legacy
  window._wireNavOnce = function(){ wireHeader(); };

  // ===== Footer util
  function fixYear(){
    document.querySelectorAll('footer .small').forEach((el) => {
      el.innerHTML = el.innerHTML.replace('{year}', String(new Date().getFullYear()));
    });
    document.querySelectorAll('[data-year]').forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  // ===== Boot
  console.log('[site-chrome] v' + VERSION + ' starting');
  removeLegacyChrome();
  ensurePlaceholders();
  mount('site-header', '/partials/header.html', wireHeader);
  mount('site-footer', '/partials/footer.html', fixYear);
})();
document.getElementById('site-header').innerHTML = fetchedHeaderHtml;
window.dispatchEvent(new CustomEvent('site-chrome:header-mounted'));
