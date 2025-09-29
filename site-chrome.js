// Inject header, drawer, footer, and handle “Book Now” modal.
(() => {
  const FORM_URL = "https://api.leadconnectorhq.com/widget/form/iOAJA6wWRWJ3ycF2AUKI";

  const headerHTML = `
  <header class="site-chrome" role="navigation" aria-label="Site">
    <div class="wrap">
      <div class="row">
        <a class="brand" href="/" aria-label="Shine Design Home">
          <img src="/logo.ico" alt="Shine Design">
          <div>
            <div class="n">ShineDesign</div>
            <div class="t">DETAILING • TINT • PPF • CERAMIC</div>
          </div>
        </a>
        <nav class="links" aria-label="Primary">
          <a href="/services/">Services</a>
          <a href="/pricing/">Pricing</a>
          <a href="/gallery">Gallery</a>
          <a href="/locations/">Locations</a>
          <a href="/about/">About</a>
          <a href="/contact/">Contact</a>
          <a class="book" href="/booking/" aria-label="Book or Get Instant Quote" data-book="true">Book Now</a>
        </nav>
        <button class="menu" type="button" aria-controls="mobile" aria-expanded="false" aria-label="Open menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M3 12h18M3 18h18"/></svg>
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
      <a class="mbtn" href="/auto-detailing" role="menuitem">Auto Detailing <span>→</span></a>
      <a class="mbtn" href="/ceramic-coating" role="menuitem">Ceramic Coating <span>→</span></a>
      <a class="mbtn" href="/paint-protection-film" role="menuitem">Paint Protection Film <span>→</span></a>
      <a class="mbtn" href="/window-tinting" role="menuitem">Window Tinting <span>→</span></a>
      <a class="mbtn" href="/rv-detailing" role="menuitem">RV Detailing <span>→</span></a>
      <a class="mbtn" href="/boat-detailing" role="menuitem">Boat Detailing <span>→</span></a>
      <a class="mbtn" href="/airplane-detailing" role="menuitem">Airplane Detailing <span>→</span></a>
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
      <div><h4>ShineDesign</h4><p>Detailing • Tint • PPF • Ceramic</p>
        <a href="tel:+14805288227">(480) 528-8227</a></div>
      <div><h4>Services</h4>
        <a href="/auto-detailing">Auto Detailing</a>
        <a href="/ceramic-coating">Ceramic Coating</a>
        <a href="/paint-protection-film">Paint Protection Film</a>
        <a href="/window-tinting">Window Tinting</a></div>
      <div><h4>Locations</h4>
        <a href="/locations/">Service Areas</a><a href="/scottsdale">Scottsdale</a>
        <a href="/gilbert">Gilbert</a><a href="/mesa">Mesa</a>
        <a href="/chandler">Chandler</a><a href="/queen-creek">Queen Creek</a></div>
      <div><h4>Book</h4>
        <a href="/pricing/">Pricing</a><a href="/contact">Contact</a></div>
    </div>
    <div class="wrap copy">© <span id="y"></span> Shine Design. All rights reserved.</div>
  </footer>`;

  function injectChrome(){
    if (!document.querySelector('header.site-chrome')) {
      document.body.insertAdjacentHTML('afterbegin', headerHTML);
      document.body.insertAdjacentHTML('beforeend', scrimHTML + mobileHTML + footerHTML);
    }
    const y = document.getElementById('y'); if (y) y.textContent = new Date().getFullYear();
  }

  function bindNav(){
    const menuBtn = document.querySelector('.menu');
    const mobile = document.getElementById('mobile');
    const scrim  = document.getElementById('scrim');
    const closeBtn = document.getElementById('closeBtn');

    const openDrawer = () => {
      mobile.classList.add('active'); document.body.classList.add('noscroll');
      scrim.classList.add('show'); menuBtn?.setAttribute('aria-expanded','true');
      mobile.setAttribute('aria-hidden','false');
    };
    const closeDrawer = () => {
      mobile.classList.remove('active'); document.body.classList.remove('noscroll');
      scrim.classList.remove('show'); menuBtn?.setAttribute('aria-expanded','false');
      mobile.setAttribute('aria-hidden','true');
    };
    const toggle = () => (mobile.classList.contains('active') ? closeDrawer() : openDrawer());

    menuBtn?.addEventListener('click', toggle);
    closeBtn?.addEventListener('click', closeDrawer);
    scrim?.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
    mobile?.addEventListener('click', e => { if (e.target.closest('a')) closeDrawer(); });

    // Sticky shadow
    const hdr = document.querySelector('header.site-chrome');
    const onScroll = () => hdr?.classList.toggle('scrolled', window.scrollY > 4);
    onScroll(); document.addEventListener('scroll', onScroll, {passive:true});
  }

  function bookingModal(){
    // open + lazy inject
    function inject(){
      if (document.getElementById("sd-book-modal")) return;
      const modalHTML = `
      <div id="sd-book-modal" class="sd-modal" role="dialog" aria-modal="true" aria-labelledby="sd-book-title" hidden>
        <div class="sd-modal__scrim" data-close></div>
        <div class="sd-modal__panel" role="document">
          <button class="sd-modal__close" type="button" aria-label="Close" data-close>✕</button>
          <h2 id="sd-book-title" class="sr-only">Book or Get Instant Quote</h2>
          <iframe id="sd-book-iframe" src="${FORM_URL}" title="Shine Design Booking"></iframe>
        </div>
      </div>`;
      document.body.insertAdjacentHTML("beforeend", modalHTML);
      if (!document.querySelector('script[src*="form_embed.js"]')) {
        const s = document.createElement("script");
        s.src = "https://link.msgsndr.com/js/form_embed.js";
        s.defer = true;
        document.body.appendChild(s);
      }
    }
    const open = () => { inject(); const m = document.getElementById("sd-book-modal"); m.hidden = false; document.body.classList.add("noscroll"); };
    const close = () => { const m = document.getElementById("sd-book-modal"); if (!m) return; m.hidden = true; document.body.classList.remove("noscroll"); };

    document.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

    // Intercept common “book/quote” triggers
    document.addEventListener("click", (e) => {
      const el = e.target.closest("a, button"); if (!el) return;
      const label = (el.getAttribute("aria-label") || el.textContent || "").toLowerCase();
      const href  = (el.getAttribute("href") || "").toLowerCase();

      const matchesText = /\bbook\b|\bbook now\b|\bget instant quote\b|\binstant quote\b|\bquote\b|\bestimate\b/.test(label);
      const matchesHref = /book|schedule|quote|get-quote|estimate/.test(href);
      const forced = el.dataset.book === "true" || el.dataset.quote === "true";

      if (matchesText || matchesHref || forced) {
        if (/^(tel:|sms:|mailto:)/.test(href)) return;
        e.preventDefault();
        document.getElementById("scrim")?.classList.remove("show");
        document.getElementById("mobile")?.classList.remove("active");
        document.querySelector(".menu")?.setAttribute("aria-expanded","false");
        document.body.classList.remove("noscroll");
        open();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectChrome();
    bindNav();
    bookingModal();
  });
})();
