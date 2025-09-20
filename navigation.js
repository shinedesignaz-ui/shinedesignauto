// /navigation.js
(function () {
  let wired = false;

  function wireNav() {
    if (wired) return;
    const btn  = document.querySelector('.menu-btn');
    const menu = document.getElementById('mobile-nav');
    if (!btn || !menu) return; // header not ready yet

    function openMenu() {
      menu.removeAttribute('hidden');
      btn.setAttribute('aria-expanded', 'true');
      btn.textContent = '✕';
    }
    function closeMenu() {
      menu.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = '☰';
    }

    btn.addEventListener('click', () => {
      if (menu.hasAttribute('hidden')) openMenu(); else closeMenu();
    });

    document.addEventListener('click', (e) => {
      if (!menu.hasAttribute('hidden') && !btn.contains(e.target) && !menu.contains(e.target)) {
        closeMenu();
      }
    }, { passive: true });

    // Mobile dropdowns: toggle "hidden" on the submenu and aria-expanded
    document.querySelectorAll('.mobile-dropdown > button').forEach((button) => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const parent  = button.parentElement;
        const submenu = button.nextElementSibling; // .mobile-submenu

        // close all
        document.querySelectorAll('.mobile-dropdown').forEach((md) => {
          md.classList.remove('open');
          const sm = md.querySelector('.mobile-submenu');
          if (sm) sm.setAttribute('hidden', '');
          const b = md.querySelector('button');
          if (b) b.setAttribute('aria-expanded', 'false');
        });

        // open current
        parent.classList.add('open');
        if (submenu) submenu.removeAttribute('hidden');
        button.setAttribute('aria-expanded', 'true');
      }, { passive: true });
    });

    wired = true;
  }

  // 1) Try immediately (in case header is already present)
  wireNav();

  // 2) Listen for a custom event from site-chrome.js if you dispatch one
  window.addEventListener('site-chrome:header-mounted', wireNav, { once: true });

  // 3) Fallback: MutationObserver watches #site-header for injected content
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    const mo = new MutationObserver(() => { wireNav(); if (wired) mo.disconnect(); });
    mo.observe(siteHeader, { childList: true, subtree: true });
  } else {
    // If you inlined the header on some pages, this still works:
    const mo2 = new MutationObserver(() => { wireNav(); if (wired) mo2.disconnect(); });
    mo2.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
