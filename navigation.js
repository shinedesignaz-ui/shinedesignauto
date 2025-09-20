// /navigation.js
// ShineDesign Navigation Handler
(() => {
  let wired = false;
  const qs  = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function initNav() {
    if (wired) return true;

    // Work inside injected header if present
    const mount  = document.getElementById('site-header') || document;
    const header = qs('#main-header', mount) || qs('.main-header', mount) || mount;
    const drawer = qs('#mobile-nav', header) || qs('#mobile-nav', document);
    const menuBtn = qs('.menu-btn', header);

    if (!drawer || !menuBtn) return false; // header not injected yet

    // Ensure ARIA wiring
    menuBtn.setAttribute('aria-controls', 'mobile-nav');
    menuBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');

    const html = document.documentElement;
    const setExpanded = (val) => menuBtn.setAttribute('aria-expanded', String(val));

    function openNav(e){
      if (e) e.preventDefault();
      drawer.removeAttribute('hidden');
      html.classList.add('nav-open');
      setExpanded(true);
      const first = drawer.querySelector('a,button,[tabindex]:not([tabindex="-1"])');
      if (first) first.focus({ preventScroll: true });
    }
    function closeNav(e){
      if (e) e.preventDefault();
      drawer.setAttribute('hidden', '');
      html.classList.remove('nav-open');
      setExpanded(false);
      menuBtn.focus({ preventScroll: true });
    }

    // Toggle menu on button click - THIS IS THE FIX
    menuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (drawer.hasAttribute('hidden')) {
        openNav(e);
      } else {
        closeNav(e);
      }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !drawer.hasAttribute('hidden')) closeNav(e);
    });
    
    // Close when tapping any link or an element with data-nav-close inside the drawer
    drawer.addEventListener('click', (e) => {
      if (e.target.closest('[data-nav-close]') || e.target.closest('a')) closeNav(e);
    });

    // Wire MOBILE submenus (each .mobile-dropdown button toggles its .mobile-submenu)
    qsa('#mobile-nav .mobile-dropdown', header).forEach(group => {
      const btn   = qs('button', group);
      const panel = qs('.mobile-submenu', group);
      if (!btn || !panel) return;
      btn.addEventListener('click', () => {
        const isOpen = group.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(isOpen));
        if (isOpen) panel.removeAttribute('hidden'); else panel.setAttribute('hidden', '');
      });
    });

    // Improve DESKTOP dropdowns for keyboard users
    qsa('.nav-dropdown', header).forEach(dd => {
      const trigger = qs('a', dd);
      const menu = qs('.dropdown-menu', dd);
      if (!trigger || !menu) return;
      trigger.addEventListener('focus', () => dd.classList.add('open'));
      trigger.addEventListener('blur',  () => dd.classList.remove('open'));
      menu.addEventListener('mouseenter', () => dd.classList.add('open'));
      menu.addEventListener('mouseleave', () => dd.classList.remove('open'));
    });

    wired = true;
    return true;
  }

  // Try now; otherwise wait for header injection
  if (!initNav()) {
    window.addEventListener('chrome:ready', () => initNav(), { once: true });
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => initNav(), { once: true });
    }
    const mo = new MutationObserver(() => { if (initNav()) mo.disconnect(); });
    mo.observe(document.body, { childList: true, subtree: true });
  }
})();