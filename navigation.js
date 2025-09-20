// /navigation.js — wires the header AFTER it's injected (works on every page)
(function () {
  let wired = false;

  function wireNav() {
    if (wired) return;
    const header = document.querySelector('header.main-header, header#main-header, header.site-header');
    if (!header) return;

    const btn  = header.querySelector('.menu-btn');
    const menu = document.getElementById('mobile-nav');
    if (!btn || !menu) return; // header mounted but expected hooks missing

    // Ensure initial state
    if (!menu.hasAttribute('hidden')) menu.setAttribute('hidden','');
    btn.setAttribute('aria-controls', 'mobile-nav');
    btn.setAttribute('aria-expanded', 'false');

    function openMenu(){
      menu.removeAttribute('hidden');
      btn.setAttribute('aria-expanded','true');
      if (!btn.dataset._origLabel) btn.dataset._origLabel = btn.textContent;
      btn.textContent = '✕';
      document.documentElement.style.overflow = 'hidden';
    }
    function closeMenu(){
      menu.setAttribute('hidden','');
      btn.setAttribute('aria-expanded','false');
      if (btn.dataset._origLabel) btn.textContent = btn.dataset._origLabel;
      document.documentElement.style.overflow = '';
      // collapse any open mobile submenus
      document.querySelectorAll('.mobile-dropdown').forEach((d)=>{
        d.classList.remove('open');
        const sub = d.querySelector('.mobile-submenu');
        const b   = d.querySelector('button[aria-expanded]');
        if (sub) sub.setAttribute('hidden','');
        if (b)   b.setAttribute('aria-expanded','false');
      });
    }

    // Drawer toggle
    btn.addEventListener('click', () => menu.hasAttribute('hidden') ? openMenu() : closeMenu());

    // Click-away & ESC to close
    document.addEventListener('click', (e) => {
      if (!menu.hasAttribute('hidden') && !btn.contains(e.target) && !menu.contains(e.target)) closeMenu();
    }, { passive: true });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hasAttribute('hidden')) closeMenu(); });

    // Mobile accordion (one open at a time)
    document.querySelectorAll('.mobile-dropdown').forEach((block) => {
      const toggle  = block.querySelector('button');
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
        }
      });
    });

    wired = true;
  }

  // Try now (covers pages with inlined header)
  wireNav();

  // Wire as soon as the injector signals the header is mounted
  window.addEventListener('site-chrome:header-mounted', wireNav);

  // Fallback: if no event fired, watch the mount point for injected content
  const mount = document.getElementById('site-header');
  if (mount) {
    const mo = new MutationObserver(() => { wireNav(); if (wired) mo.disconnect(); });
    mo.observe(mount, { childList: true, subtree: true });
  }
})();
