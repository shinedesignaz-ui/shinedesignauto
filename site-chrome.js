(() => {
  const headerHTML = `
  <header>
    <div class="wrap">
      <div class="row">
        <a class="brand" href="/" aria-label="ShineDesign Home">
          <img src="/logo.ico" alt="ShineDesign"><div><div class="n">ShineDesign</div></div>
        </a>
        <nav class="links" aria-label="Primary">
          <a href="/services/">Services</a>
          <a href="/pricing/">Pricing</a>
          <a href="/gallery">Gallery</a>
          <a href="/locations/">Locations</a>
          <a href="/about/">About</a>
        </nav>
        <button class="menu" type="button" aria-controls="mobile" aria-expanded="false" aria-label="Open menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
      </div>
    </div>
  </header>`;
  const scrimHTML = `<div class="scrim" id="scrim"></div>`;
  const mobileHTML = `
  <nav id="mobile" aria-hidden="true">
    <div class="mhd">
      <strong>Menu</strong>
      <button type="button" id="closeBtn" aria-label="Close menu">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <div class="mgrid" role="menu">
      <a class="mbtn" href="/ceramic-coating" role="menuitem">Ceramic Coating <span>→</span></a>
      <a class="mbtn" href="/paint-protection-film" role="menuitem">Paint Protection Film <span>→</span></a>
      <a class="mbtn" href="/window-tinting" role="menuitem">Window Tinting <span>→</span></a>
      <a class="mbtn" href="/auto-detailing" role="menuitem">Auto Detailing <span>→</span></a>
      <a class="mbtn" href="/pricing/" role="menuitem">Pricing <span>→</span></a>
      <a class="mbtn" href="/gallery" role="menuitem">Gallery <span>→</span></a>
      <a class="mbtn" href="/locations/" role="menuitem">Locations <span>→</span></a>
      <a class="mbtn" href="/about/" role="menuitem">About <span>→</span></a>
      <a class="mbtn" href="/contact/" role="menuitem">Contact <span>→</span></a>
    </div>
    <div class="mcta">
      <a class="call" href="tel:+14805288227">Call (480) 528-8227</a>
      <a class="txt" href="sms:+14805288227">Text Us</a>
    </div>
  </nav>`;
  const footerHTML = `
  <footer>
    <div class="wrap fgrid">
      <div><h4>ShineDesign</h4><p>Detailing • Tint • PPF • Ceramic</p><a href="tel:+14805288227">(480) 528-8227</a></div>
      <div><h4>Services</h4><a href="/auto-detailing">Auto Detailing</a><a href="/ceramic-coating">Ceramic Coating</a><a href="/paint-protection-film">Paint Protection Film</a><a href="/window-tinting">Window Tinting</a></div>
      <div><h4>Locations</h4><a href="/gilbert">Gilbert</a><a href="/mesa">Mesa</a><a href="/chandler">Chandler</a><a href="/queen-creek">Queen Creek</a></div>
      <div><h4>Book</h4><a href="https://booknow.shinedesignauto.com/">Book Online</a><a href="/pricing/">Pricing</a><a href="/contact">Contact</a></div>
    </div>
    <div class="wrap copy">© <span id="y"></span> Shine Design. All rights reserved.</div>
  </footer>`;

  // Inject at runtime
  document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    document.body.insertAdjacentHTML('beforeend', scrimHTML + mobileHTML + footerHTML);
    const y = document.getElementById('y'); if (y) y.textContent = new Date().getFullYear();

    // Wire up mobile drawer
    const menuBtn = document.querySelector('.menu');
    const mobile = document.getElementById('mobile');
    const scrim = document.getElementById('scrim');
    const closeBtn = document.getElementById('closeBtn');

    function openDrawer(){
      mobile.classList.add('active'); document.body.classList.add('noscroll');
      scrim.classList.add('show'); menuBtn?.setAttribute('aria-expanded','true');
      mobile.setAttribute('aria-hidden','false');
    }
    function closeDrawer(){
      mobile.classList.remove('active'); document.body.classList.remove('noscroll');
      scrim.classList.remove('show'); menuBtn?.setAttribute('aria-expanded','false');
      mobile.setAttribute('aria-hidden','true');
    }
    function toggle(){ mobile.classList.contains('active') ? closeDrawer() : openDrawer(); }

    menuBtn?.addEventListener('click', toggle);
    closeBtn?.addEventListener('click', closeDrawer);
    scrim?.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
    mobile?.addEventListener('click', e => { if (e.target.closest('a')) closeDrawer(); });
  });
})();
