// Inject header, drawer, footer, and handle "Book Now" modal.
(() => {
  const FORM_URL = "https://api.leadconnectorhq.com/widget/form/iOAJA6wWRWJ3ycF2AUKI";

  const headerHTML = `
  <header class="site-chrome" role="navigation" aria-label="Site">
    <div class="wrap">
      <div class="row">
        <!-- Logo/Brand -->
        <a class="brand" href="/" aria-label="ShineDesign Home">
          <img src="/logo.ico" alt="Shine Design" width="140" height="42">
          <div class="brand-text">
            <span class="brand-name">Shine Design</span>
            <span class="brand-tagline">DETAILING • TINT • PPF • CERAMIC</span>
          </div>
        </a>
        
        <!-- Desktop Navigation -->
        <nav class="links" aria-label="Primary Navigation">
          <a href="/services/">Services</a>
          <a href="/pricing/">Pricing</a>
          <a href="/gallery">Gallery</a>
          <a href="/locations/">Locations</a>
          <a href="/about/">About</a>
          <a href="/contact/">Contact</a>
          <a class="book" href="/booking/" aria-label="Book or Get Instant Quote" data-book="true">
            Book Now
          </a>
        </nav>
        
        <!-- Mobile Menu Button -->
        <button class="menu" type="button" aria-controls="mobile" aria-expanded="false" aria-label="Open menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
    <div class="mgrid" role="menu">
      <a class="mbtn" href="/auto-detailing" role="menuitem">
        Auto Detailing <span>→</span>
      </a>
      <a class="mbtn" href="/ceramic-coating" role="menuitem">
        Ceramic Coating <span>→</span>
      </a>
      <a class="mbtn" href="/paint-protection-film" role="menuitem">
        Paint Protection Film <span>→</span>
      </a>
      <a class="mbtn" href="/window-tinting" role="menuitem">
        Window Tinting <span>→</span>
      </a>
      <a class="mbtn" href="/rv-detailing" role="menuitem">
        RV Detailing <span>→</span>
      </a>
      <a class="mbtn" href="/boat-detailing" role="menuitem">
        Boat Detailing <span>→</span>
      </a>
      <a class="mbtn" href="/airplane-detailing" role="menuitem">
        Airplane Detailing <span>→</span>
      </a>
      <a class="mbtn" href="/paint-correction" role="menuitem">
        Paint Correction <span>→</span>
      </a>
      <a class="mbtn" href="/pricing/" role="menuitem">
        Pricing <span>→</span>
      </a>
      <a class="mbtn" href="/gallery" role="menuitem">
        Gallery <span>→</span>
      </a>
      <a class="mbtn" href="/locations/" role="menuitem">
        Locations <span>→</span>
      </a>
      <a class="mbtn" href="/about/" role="menuitem">
        About <span>→</span>
      </a>
      <a class="mbtn" href="/contact/" role="menuitem">
        Contact <span>→</span>
      </a>
    </div>
    <div class="mcta">
      <a class="call" href="tel:+14805288227">
        📞 Call (480) 528-8227
      </a>
      <a class="txt" href="sms:+14805288227">
        💬 Text Us
      </a>
    </div>
  </nav>`;

  const footerHTML = `
  <footer>
    <div class="wrap">
      <div class="fgrid">
        <div>
          <h4>Shine Design</h4>
          <p style="margin-bottom: 12px; color: #94a3b8;">
            Professional Auto Detailing<br>
            Ceramic Coating • PPF • Tint
          </p>
          <a href="tel:+14805288227" style="font-weight: 600; color: var(--brand);">
            📞 (480) 528-8227
          </a>
        </div>
        <div>
          <h4>Services</h4>
          <a href="/auto-detailing">Auto Detailing</a>
          <a href="/ceramic-coating">Ceramic Coating</a>
          <a href="/paint-protection-film">Paint Protection Film</a>
          <a href="/window-tinting">Window Tinting</a>
          <a href="/paint-correction">Paint Correction</a>
        </div>
        <div>
          <h4>Service Areas</h4>
          <a href="/gilbert">Gilbert</a>
          <a href="/mesa">Mesa</a>
          <a href="/chandler">Chandler</a>
          <a href="/scottsdale">Scottsdale</a>
          <a href="/queen-creek">Queen Creek</a>
          <a href="/phoenix">Phoenix</a>
        </div>
        <div>
          <h4>Information</h4>
          <a href="/pricing/">Pricing & Packages</a>
          <a href="/gallery">Work Gallery</a>
          <a href="/about/">About Us</a>
          <a href="/contact">Contact</a>
          <a href="/booking/" data-book="true">Book Online</a>
        </div>
      </div>
      <div class="copy">
        © <span id="year"></span> ShineDesign. All rights reserved. | Professional Auto Detailing in Gilbert, AZ
      </div>
    </div>
  </footer>`;

  // Inject chrome elements
  function injectChrome() {
    // Only inject if not already present
    if (!document.querySelector('header.site-chrome')) {
      document.body.insertAdjacentHTML('afterbegin', headerHTML);
      document.body.insertAdjacentHTML('beforeend', scrimHTML + mobileHTML + footerHTML);
    }
    
    // Set current year
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  // Bind navigation interactions
  function bindNav() {
    const menuBtn = document.querySelector('.menu');
    const mobile = document.getElementById('mobile');
    const scrim = document.getElementById('scrim');
    const closeBtn = document.getElementById('closeBtn');

    const openDrawer = () => {
      mobile?.classList.add('active');
      document.body.classList.add('noscroll');
      scrim?.classList.add('show');
      menuBtn?.setAttribute('aria-expanded', 'true');
      mobile?.setAttribute('aria-hidden', 'false');
    };

    const closeDrawer = () => {
      mobile?.classList.remove('active');
      document.body.classList.remove('noscroll');
      scrim?.classList.remove('show');
      menuBtn?.setAttribute('aria-expanded', 'false');
      mobile?.setAttribute('aria-hidden', 'true');
    };

    const toggleDrawer = () => {
      if (mobile?.classList.contains('active')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    };

    // Event listeners
    menuBtn?.addEventListener('click', toggleDrawer);
    closeBtn?.addEventListener('click', closeDrawer);
    scrim?.addEventListener('click', closeDrawer);
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDrawer();
      }
    });
    
    // Close drawer when clicking a link
    mobile?.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        closeDrawer();
      }
    });

    // Add scroll effect to header
    const header = document.querySelector('header.site-chrome');
    const handleScroll = () => {
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 10);
      }
    };
    
    handleScroll(); // Check initial state
    document.addEventListener('scroll', handleScroll, { passive: true });
  }

  // Booking modal functionality
  function bookingModal() {
    // Inject modal HTML lazily
    function injectModal() {
      if (document.getElementById('sd-book-modal')) return;
      
      const modalHTML = `
      <div id="sd-book-modal" class="sd-modal" role="dialog" aria-modal="true" aria-labelledby="sd-book-title" hidden>
        <div class="sd-modal__scrim" data-close></div>
        <div class="sd-modal__panel" role="document">
          <button class="sd-modal__close" type="button" aria-label="Close" data-close>✕</button>
          <h2 id="sd-book-title" class="sr-only">Book or Get Instant Quote</h2>
          <iframe id="sd-book-iframe" src="${FORM_URL}" title="ShineDesign Booking Form"></iframe>
        </div>
      </div>`;
      
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      
      // Load form embed script if not already loaded
      if (!document.querySelector('script[src*="form_embed.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://link.msgsndr.com/js/form_embed.js';
        script.defer = true;
        document.body.appendChild(script);
      }
    }

    // Open modal
    const openModal = () => {
      injectModal();
      const modal = document.getElementById('sd-book-modal');
      if (modal) {
        modal.hidden = false;
        document.body.classList.add('noscroll');
      }
    };

    // Close modal
    const closeModal = () => {
      const modal = document.getElementById('sd-book-modal');
      if (modal) {
        modal.hidden = true;
        document.body.classList.remove('noscroll');
      }
    };

    // Close modal handlers
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });

    // Intercept booking-related clicks
    document.addEventListener('click', (e) => {
      const element = e.target.closest('a, button');
      if (!element) return;

      const text = (element.getAttribute('aria-label') || element.textContent || '').toLowerCase();
      const href = (element.getAttribute('href') || '').toLowerCase();

      // Check for booking-related text
      const bookingKeywords = /\b(book|book now|get instant quote|instant quote|quote|estimate|schedule)\b/;
      const matchesText = bookingKeywords.test(text);
      const matchesHref = /book|schedule|quote|get-quote|estimate/.test(href);
      const hasDataAttribute = element.dataset.book === 'true' || element.dataset.quote === 'true';

      if (matchesText || matchesHref || hasDataAttribute) {
        // Don't intercept phone/sms/email links
        if (/^(tel:|sms:|mailto:)/.test(href)) return;
        
        e.preventDefault();
        
        // Close mobile menu if open
        const mobile = document.getElementById('mobile');
        const scrim = document.getElementById('scrim');
        if (mobile?.classList.contains('active')) {
          mobile.classList.remove('active');
          scrim?.classList.remove('show');
          document.querySelector('.menu')?.setAttribute('aria-expanded', 'false');
        }
        
        openModal();
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectChrome();
      bindNav();
      bookingModal();
    });
  } else {
    // DOM is already loaded
    injectChrome();
    bindNav();
    bookingModal();
  } 
})();