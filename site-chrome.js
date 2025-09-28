(() => {
  const headerHTML = `
  <header>
    <div class="wrap">
      <div class="row">
        <a class="brand" href="/" aria-label="ShineDesign Home">
          <img src="/logo.ico" alt="Shine Design">
          <div class="brand-text">
            <span class="brand-name">Shine Design</span>
            <span class="brand-tagline">DETAILING • TINT • PPF • CERAMIC</span>
          </div>
        </a>
        <nav class="links" aria-label="Primary">
          <a href="/services/">Services</a>
          <a href="/pricing/">Pricing</a>
          <a href="/gallery">Gallery</a>
          <a href="/locations/">Locations</a>
          <a href="/about/">About</a>
        </nav>
        <button class="menu" type="button" aria-controls="mobile" aria-expanded="false" aria-label="Open menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>
    </div>
  </header>
`;
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
  <footer class="footer" role="contentinfo">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-column" itemscope itemtype="https://schema.org/LocalBusiness">
          <h4 itemprop="name">Shine Design</h4>
          <p style="color: rgba(255,255,255,0.7); line-height: 1.6;" itemprop="description">Premium mobile auto detailing serving the East Valley since 2019. We bring the shop to you.</p>
          <div class="social-links" style="margin-top: 20px;" aria-label="Social media links">
            <a href="https://www.facebook.com/shinedesigndetail/" class="social-link" aria-label="Facebook" rel="noopener noreferrer" target="_blank">f</a>
            <a href="https://www.instagram.com/shinedesigndetail/" class="social-link" aria-label="Instagram" rel="noopener noreferrer" target="_blank">ig</a>
            <a href="https://maps.app.goo.gl/QFiEZLF4jH3ySGUd9" class="social-link" aria-label="Google Business Profile" rel="noopener noreferrer" target="_blank">g</a>
            <a href="https://www.youtube.com/@shinedesigndetail" class="social-link" aria-label="YouTube" rel="noopener noreferrer" target="_blank">y</a>
          </div>
        </div>
        <div class="footer-column">
          <h4>Services</h4>
          <ul class="footer-links" role="navigation" aria-label="Services navigation">
            <li><a href="/services/auto-detailing" title="Mobile Auto Detailing Services">Auto Detailing</a></li>
            <li><a href="/services/ceramic-coating" title="Ceramic Coating Installation">Ceramic Coating</a></li>
            <li><a href="/services/paint-protection-film" title="Paint Protection Film Installation">Paint Protection Film</a></li>
            <li><a href="/services/window-tinting" title="Window Tinting Services">Window Tinting</a></li>
            <li><a href="/services/paint-correction" title="Paint Correction Services">Paint Correction</a></li>
            <li><a href="/services/interior-detailing" title="Interior Detailing Services">Interior Detailing</a></li>
            <li><a href="/services/exterior-detailing" title="Exterior Detailing Services">Exterior Detailing</a></li>
            <li><a href="/services/rv-detailing" title="RV Detailing Services">RV Detailing</a></li>
            <li><a href="/services/boat-detailing" title="Boat Detailing Services">Boat Detailing</a></li>
            <li><a href="/services/airplane-detailing" title="Airplane Detailing Services">Airplane Detailing</a></li>
            <li><a href="/services/headlight-restoration" title="Headlight Restoration Services">Headlight Restoration</a></li>
            <li><a href="/services/paint-restoration" title="Paint Restoration Services">Paint Restoration</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Service Areas</h4>
          <ul class="footer-links" role="navigation" aria-label="Service areas navigation">
            <li><a href="/locations/gilbert" title="Auto Detailing in Gilbert AZ">Gilbert</a></li>
            <li><a href="/locations/queen-creek" title="Auto Detailing in Queen Creek AZ">Queen Creek</a></li>
            <li><a href="/locations/san-tan-valley" title="Auto Detailing in San Tan Valley AZ">San Tan Valley</a></li>
            <li><a href="/locations/chandler" title="Auto Detailing in Chandler AZ">Chandler</a></li>
            <li><a href="/locations/mesa" title="Auto Detailing in Mesa AZ">Mesa</a></li>
            <li><a href="/locations/tempe" title="Auto Detailing in Tempe AZ">Tempe</a></li>
            <li><a href="/locations/florence" title="Auto Detailing in Florence AZ">Florence</a></li>
            <li><a href="/locations/coolidge" title="Auto Detailing in Coolidge AZ">Coolidge</a></li>
            <li><a href="/locations/apache-junction" title="Auto Detailing in Apache Junction">Apache Junction</a></li>
            <li><a href="/locations/gold-canyon" title="Auto Detailing in Gold Canyon AZ">Gold Canyon</a></li>
          </ul>
        </div>
        <div class="footer-column" itemscope itemtype="https://schema.org/ContactPoint">
          <h4>Contact</h4>
          <ul class="footer-links">
            <li itemprop="telephone">📞 <a href="tel:+14805288227" title="Call Shine Design">(480) 528-8227</a></li>
            <li itemprop="email">📧 <a href="mailto:info@shinedesignauto.com" title="Email Shine Design">info@shinedesignauto.com</a></li>
            <li>⏰ <time datetime="07:00-19:00">Mon-Sun: 7AM - 7PM</time></li>
            <li itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
              📍 <span itemprop="addressLocality">Gilbert</span>, <span itemprop="addressRegion">AZ</span> <span itemprop="postalCode">85295</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="copyright">© <span id="y"></span> ShineDesign Auto Detailing. All rights reserved.</p>
        <nav class="footer-legal" aria-label="Footer links">
          <a href="/privacy-policy" rel="nofollow">Privacy</a>
          <a href="/terms-of-service" rel="nofollow">Terms</a>
          <a href="/sitemap.xml">Sitemap</a>
        </nav>
      </div>
    </div>
  </footer>
`;

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
