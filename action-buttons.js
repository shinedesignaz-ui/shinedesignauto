// /action-buttons.js — Shine Design Mobile Detailing
// Modern floating action buttons + mobile bar + service selector modal
// Single-file, drop-in script (no external dependencies)
(function () {
  'use strict';

  // ------- Quick config -------
  const AB = {
    phone: '+14805288227',
    bookingUrl: 'https://booknow.shinedesignauto.com/',
    footerMode: 'flush', // 'floating' or 'flush'
    barHeightPx: 84
  };

  // Prevent duplicate loading
  if (window.shineActionButtonsLoaded) return;
  window.shineActionButtonsLoaded = true;

  function init() {
    // ------- Styles --------
    const styles = `
      :root { --ab-bar-h: ${AB.barHeightPx}px; }
      *{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
      html,body{max-width:100%;overflow-x:hidden}
      .hidden{display:none!important}

      @media (prefers-reduced-motion: reduce){
        *,*::before,*::after{animation:none!important;transition:none!important}
      }

      @media(max-width:768px){
        /* Only reserve space when our footer is mounted & visible */
        body.ab-foot-visible{
          padding-bottom:calc(var(--ab-bar-h) + env(safe-area-inset-bottom,0px))!important
        }
        .mobile-sticky-footer{
          position:fixed;
          left:${AB.footerMode==='floating'?'10px':'0'};
          right:${AB.footerMode==='floating'?'10px':'0'};
          bottom:${AB.footerMode==='floating'
            ? 'calc(10px + env(safe-area-inset-bottom,0px))'
            : 'max(0px, env(safe-area-inset-bottom,0px))'};
          background:rgba(255,255,255,0.98);
          backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
          box-shadow:${AB.footerMode==='floating'
            ? '0 8px 32px rgba(0,0,0,.12),0 2px 8px rgba(0,0,0,.04)'
            : '0 -2px 16px rgba(0,0,0,.08)'};
          z-index:1100;display:block;border:1px solid rgba(226,232,240,.5);
          border-radius:${AB.footerMode==='floating'?'20px':'0'};
          animation:slideUpSmooth .4s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes slideUpSmooth { from{transform:translateY(120%);opacity:0} to{transform:translateY(0);opacity:1} }
        .footer-grid{display:flex;align-items:center;justify-content:center;gap:8px;padding:12px 16px;max-width:420px;margin:0 auto}
        .footer-item{
          position:relative;background:linear-gradient(145deg,#fff,#f8fafc);
          padding:10px 8px;text-align:center;cursor:pointer;transition:all .3s cubic-bezier(.4,0,.2,1);
          text-decoration:none;color:#0f172a;border:2px solid rgba(226,232,240,.8);
          font-family: system-ui,-apple-system,Segoe UI,Roboto,Inter,Helvetica,Arial,sans-serif;
          font-size:10px;border-radius:14px;-webkit-tap-highlight-color:transparent;overflow:hidden;flex:1;min-width:0;box-shadow:0 2px 8px rgba(0,0,0,.04)
        }
        .footer-item::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,#0ea5e9,#0284c7);opacity:0;transition:opacity .3s ease;border-radius:14px}
        .footer-item.primary{background:linear-gradient(135deg,#0ea5e9,#0284c7);color:#fff;border-color:rgba(14,165,233,.3);box-shadow:0 4px 16px rgba(14,165,233,.25),0 2px 8px rgba(0,0,0,.08);transform:scale(1.02)}
        .footer-item:active{transform:scale(.96)} .footer-item.primary:active{transform:scale(.98)}
        .footer-item svg{width:22px;height:22px;margin-bottom:4px;color:#0ea5e9;position:relative;z-index:1;transition:all .3s ease}
        .footer-item.primary svg{color:#fff;width:24px;height:24px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.1))}
        .footer-item span{display:block;font-size:10px;font-weight:600;color:#475569;line-height:1.2;position:relative;z-index:1;letter-spacing:-.02em}
        .footer-item.primary span{color:#fff;font-weight:700;font-size:11px}
        .footer-item:hover:not(.primary)::before{opacity:.06}
        .footer-item.pulse{animation:subtlePulse 2.5s infinite}
        @keyframes subtlePulse {0%,100%{transform:scale(1.02);box-shadow:0 4px 16px rgba(14,165,233,.25),0 2px 8px rgba(0,0,0,.08)}50%{transform:scale(1.05);box-shadow:0 6px 20px rgba(14,165,233,.35),0 2px 10px rgba(0,0,0,.1)}}
        .desktop-floating-buttons{display:none!important}
      }

      @media(min-width:769px){
        .mobile-sticky-footer{display:none!important}
        .desktop-floating-buttons{
          position:fixed;bottom:24px;right:20px;z-index:1100;display:flex;flex-direction:column-reverse;gap:14px;animation:cascadeIn .6s cubic-bezier(.34,1.56,.64,1)
        }
        @keyframes cascadeIn {from{opacity:0;transform:translateY(40px) scale(.8)} to{opacity:1;transform:translateY(0) scale(1)}}
        .floating-btn{
          width:64px;height:64px;border-radius:20px;background:rgba(255,255,255,.95);
          backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
          box-shadow:0 8px 32px rgba(0,0,0,.12),inset 0 1px 0 rgba(255,255,255,.8);
          display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .4s cubic-bezier(.4,0,.2,1);text-decoration:none;border:1px solid rgba(226,232,240,.3);position:relative;overflow:hidden;animation:floatButton 3s ease-in-out infinite
        }
        .floating-btn:nth-child(1){--index:0}.floating-btn:nth-child(2){--index:1}.floating-btn:nth-child(3){--index:2}.floating-btn:nth-child(4){--index:3}
        @keyframes floatButton {0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        .floating-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,#0ea5e9,#0284c7);opacity:0;transition:opacity .3s ease;border-radius:20px}
        .floating-btn:hover{transform:translateY(-4px) scale(1.05);box-shadow:0 12px 40px rgba(0,0,0,.15),inset 0 1px 0 rgba(255,255,255,.9);border-color:#0ea5e9}
        .floating-btn:hover::before{opacity:.06}
        .floating-btn svg{width:28px;height:28px;color:#0ea5e9;position:relative;z-index:1;transition:all .3s ease}
        .floating-btn:hover svg{transform:scale(1.1) rotate(5deg)}
        .floating-btn.primary{width:76px;height:76px;background:linear-gradient(135deg,#0ea5e9,#0284c7);border:2px solid rgba(255,255,255,.3);animation:primaryPulse 2.5s ease-in-out infinite}
        @keyframes primaryPulse {0%,100%{box-shadow:0 8px 32px rgba(14,165,233,.4),0 0 0 0 rgba(14,165,233,.4)}50%{box-shadow:0 12px 40px rgba(14,165,233,.5),0 0 0 12px rgba(14,165,233,0)}}
        .floating-btn.primary svg{color:#fff;width:34px;height:34px;filter:drop-shadow(0 2px 8px rgba(0,0,0,.2))}
        .floating-btn.primary:hover{transform:translateY(-6px) scale(1.08) rotate(-2deg);background:linear-gradient(135deg,#0284c7,#0369a1)}
        .tooltip{position:absolute;right:80px;background:rgba(15,23,42,.95);color:#fff;padding:8px 12px;border-radius:8px;font-size:13px;font-weight:500;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .3s ease;backdrop-filter:blur(12px)}
        .floating-btn:hover .tooltip{opacity:1}
      }

      /* Hide footer & remove padding when keyboard is open */
      .ab-hide-footer .mobile-sticky-footer{ display:none !important; }
      .ab-hide-footer.ab-foot-visible{ padding-bottom:0 !important; }

      /* Modal base */
      .calculator-modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:2000;animation:fadeIn .3s ease}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      .calculator-modal.active{display:flex;align-items:center;justify-content:center;padding:20px}
      .calculator-content{background:#fff;border-radius:24px;padding:28px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.3);animation:slideUpCalc .4s cubic-bezier(.34,1.56,.64,1);font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Helvetica,Arial,sans-serif}
      @keyframes slideUpCalc{from{opacity:0;transform:translateY(40px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
      .calculator-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #f1f5f9}
      .calculator-header h3{color:#0f172a;font-size:24px;margin:0;font-weight:800;background:linear-gradient(135deg,#0ea5e9,#0284c7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
      .close-btn{background:linear-gradient(145deg,#f8fafc,#e2e8f0);border:none;font-size:24px;color:#64748b;cursor:pointer;width:40px;height:40px;border-radius:12px;transition:all .3s ease;display:flex;align-items:center;justify-content:center}
      .close-btn:hover{background:linear-gradient(145deg,#e2e8f0,#cbd5e1);transform:rotate(90deg);color:#ef4444}
      .vehicle-select{width:100%;padding:14px 16px;border:2px solid #e2e8f0;border-radius:12px;margin-bottom:24px;font-size:15px;background:#fff;color:#0f172a;font-weight:600;cursor:pointer;transition:all .3s ease}
      .vehicle-select:hover{border-color:#0ea5e9;box-shadow:0 0 0 3px rgba(14,165,233,.1)}
      .vehicle-select:focus{outline:none;border-color:#0ea5e9;box-shadow:0 0 0 3px rgba(14,165,233,.2)}
      .calculator-content h4{margin:22px 0 10px;color:#475569;font-size:12px;text-transform:uppercase;letter-spacing:.8px;font-weight:800;display:flex;align-items:center;gap:8px}
      .calculator-content h4.bundle-header{color:#22c55e;font-size:13px;background:linear-gradient(145deg,#f0fdf4,#dcfce7);padding:8px 12px;border-radius:8px;margin-top:18px}
      .service-option{padding:0;margin-bottom:8px;border:2px solid transparent;border-radius:12px;cursor:pointer;transition:all .3s cubic-bezier(.4,0,.2,1);background:linear-gradient(145deg,#f8fafc,#f1f5f9);position:relative;overflow:hidden}
      .service-option::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,#0ea5e9,#0284c7);opacity:0;transition:opacity .3s ease}
      .service-option:hover{border-color:#0ea5e9;transform:translateX(4px);box-shadow:0 4px 12px rgba(14,165,233,.15)}
      .service-option.selected{border-color:#0ea5e9;background:linear-gradient(145deg,#f0f9ff,#e0f2fe);box-shadow:0 4px 16px rgba(14,165,233,.2)}
      .service-option.selected::before{opacity:.05}
      .service-option label{display:flex;align-items:center;cursor:pointer;font-size:14px;color:#0f172a;margin:0;padding:14px;position:relative;z-index:1;font-weight:600}
      .service-option input[type="checkbox"]{margin-right:12px;width:20px;height:20px;cursor:pointer;accent-color:#0ea5e9}

      .request-section{margin-top:20px;padding:18px;background:linear-gradient(135deg,#0ea5e9,#0284c7);border-radius:16px;text-align:center;box-shadow:0 8px 24px rgba(14,165,233,.25);color:#fff;font-weight:700}
      .cta-button{width:100%;padding:16px;background:linear-gradient(135deg,#0ea5e9,#0284c7);color:#fff;border:none;border-radius:999px;font-size:16px;font-weight:800;cursor:pointer;margin-top:16px;transition:all .3s cubic-bezier(.4,0,.2,1);box-shadow:0 8px 24px rgba(14,165,233,.3);letter-spacing:-.02em;position:relative;overflow:hidden}
      .cta-button:hover{background:linear-gradient(135deg,#0284c7,#0369a1);transform:translateY(-2px);box-shadow:0 12px 32px rgba(14,165,233,.4)}
      .sms-notice{font-size:13px;color:#64748b;text-align:center;margin-top:10px;display:flex;align-items:center;justify-content:center;gap:6px;padding:8px;background:#f8fafc;border-radius:8px}

      .inline-fields{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}
      .input{width:100%;padding:12px 14px;border:2px solid #e2e8f0;border-radius:12px;font-size:14px;background:#fff;color:#0f172a;transition:.2s}
      .input:focus{outline:none;border-color:#0ea5e9;box-shadow:0 0 0 3px rgba(14,165,233,.15)}
      .textarea{width:100%;padding:12px 14px;border:2px solid #e2e8f0;border-radius:12px;font-size:14px;min-height:64px;resize:vertical}
      .textarea:focus{outline:none;border-color:#0ea5e9;box-shadow:0 0 0 3px rgba(14,165,233,.15)}

      /* Wrap color UI */
      .swatches{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
      .swatch{width:32px;height:32px;border-radius:8px;border:2px solid rgba(0,0,0,.1);cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.08)}
      .swatch.selected{outline:3px solid rgba(14,165,233,.5)}
      .wrap-picker{display:grid;grid-template-columns:1fr auto;gap:10px;margin-top:10px;align-items:center}
      .wrap-chip{display:inline-flex;align-items:center;gap:8px;padding:8px 10px;border-radius:10px;background:#f8fafc;border:1px solid #e2e8f0;font-size:12px;color:#0f172a;margin-top:8px}
      .wrap-chip .chip-dot{width:12px;height:12px;border-radius:50%;border:1px solid rgba(0,0,0,.2)}
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // ------- UI: Mobile footer -------
    const mobileFooter = `
      <div class="mobile-sticky-footer" role="region" aria-label="Quick actions">
        <div class="footer-grid">
          <button class="footer-item" data-gtm-event="open_calculator" onclick="window.openCalculator()" aria-label="Service Selector">
            ${iconClipboard()}<span>Services</span>
          </button>
          <a href="${AB.bookingUrl}" class="footer-item primary pulse" data-gtm-event="book_click" aria-label="Book Online">
            ${iconCalendar()}<span>Book</span>
          </a>
          <a href="tel:${AB.phone}" class="footer-item" data-gtm-event="call_click" aria-label="Call">
            ${iconPhone()}<span>Call</span>
          </a>
          <!-- Use a button so we can build a clean, encoded SMS -->
          <button type="button" class="footer-item" id="ab-text-btn" data-gtm-event="sms_click" aria-label="Text Us">
            ${iconChat()}<span>Text</span>
          </button>
        </div>
      </div>
    `;

    // ------- UI: Desktop buttons -------
    const desktopButtons = `
      <div class="desktop-floating-buttons" aria-hidden="false">
        <button type="button" class="floating-btn" id="ab-text-btn-desktop" data-gtm-event="sms_click" aria-label="Text Us">
          <span class="tooltip">Text Us</span>${iconChat(28)}
        </button>
        <a href="tel:${AB.phone}" class="floating-btn" data-gtm-event="call_click" aria-label="Call">
          <span class="tooltip">Call Now</span>${iconPhone(28)}
        </a>
        <button class="floating-btn" data-gtm-event="open_calculator" onclick="window.openCalculator()" aria-label="Service Selector">
          <span class="tooltip">Select Services</span>${iconClipboard(28)}
        </button>
        <a href="${AB.bookingUrl}" class="floating-btn primary" data-gtm-event="book_click" aria-label="Book Online">
          <span class="tooltip">Book Online</span>${iconCalendar(34)}
        </a>
      </div>
    `;

    // ------- Modal (adds wrap color + tint %) -------
    const calculatorModal = `
      <div class="calculator-modal" id="calculatorModal">
        <div class="calculator-content" role="dialog" aria-modal="true" aria-labelledby="calcTitle">
          <div class="calculator-header">
            <h3 id="calcTitle">✨ Service Selection</h3>
            <button class="close-btn" onclick="window.closeCalculator()" aria-label="Close">✕</button>
          </div>

          <label style="display:block;margin-bottom:8px;color:#475569;font-size:14px;font-weight:700;">Vehicle Type:</label>
          <select class="vehicle-select" id="vehicleType" aria-label="Vehicle type">
            <option value="small">🚗 Small (Sedan/Coupe/Hatchback)</option>
            <option value="medium">🚙 Medium (Small SUV/Crossover)</option>
            <option value="large">🚚 Large (Full-Size Truck/Large Sedan)</option>
            <option value="xl">🚐 XL (Full-Size SUV/Minivan)</option>
            <option value="xxl">🚌 XXL (Extended Van/RV)</option>
          </select>

          <h4 class="bundle-header">💰 Bundle Packages (Best Value)</h4>
          ${opt('bundle','Silver Package (Interior L1 + Exterior L1)')}
          ${opt('bundle','Gold Package (Interior L2 + Exterior L2)')}
          ${opt('bundle','Platinum Package (Interior L3 + Exterior L2)')}

          <h4>🧹 Interior Services</h4>
          ${opt('interior','Level 1: Refresh & Clean')}
          ${opt('interior','Level 2: Deep Clean & Restore')}
          ${opt('interior','Level 3: Elite Transformation')}

          <h4>✨ Exterior Services</h4>
          ${opt('exterior','Level 1: Maintenance Wash')}
          ${opt('exterior','Level 2: Deep Clean & Seal')}

          <h4>🛠 Paint Correction</h4>
          ${opt(null,'Enhancement Polish (≈70% correction)')}
          ${opt(null,'Paint Correction (≈85% correction)')}
          ${opt(null,'Show Car Finish (≈95% perfection)')}

          <h4>🛡️ Ceramic Coating</h4>
          ${opt(null,'Essential – 3 Year Protection')}
          ${opt(null,'Premium – 5+ Year Protection')}
          ${opt(null,'Elite – 7+ Year / Lifetime')}

          <h4>🎨 Window Tint</h4>
          ${opt('tint','Sedan – Ceramic Tint')}
          ${opt('tint','Truck – Ceramic Tint')}
          ${opt('tint','SUV – Ceramic Tint')}
          <div id="tintOptions" class="inline-fields hidden" aria-label="Tint preferences">
            <select id="tintPercent" class="input" aria-label="Tint percentage">
              <option value="">Tint % (optional)</option>
              <option>5%</option><option>15%</option><option>20%</option>
              <option>35%</option><option>50%</option><option>70%</option>
            </select>
            <input id="tintNotes" class="input" placeholder="Windows (front/rear/windshield)" />
          </div>

          <h4>🧭 Bigger Vehicles & Specialty</h4>
          ${opt('special','RV / Motorhome – Exterior Detail')}
          ${opt('special','RV / Motorhome – Interior Detail')}
          ${opt('special','Boat (≤20 ft) – Wash & Protect')}
          ${opt('special','Boat (>20 ft) – Wash & Protect')}
          ${opt('special','Aircraft – Exterior Wash & Dry')}
          ${opt('special','Aircraft – Interior Detail')}

          <h4>🛡️ PPF / Paint Protection Film</h4>
          ${opt('ppf','Front Bumper')}
          ${opt('ppf','Partial Front (Bumper, 18–24" Hood/Fenders, Mirrors)')}
          ${opt('ppf','Full Front (Bumper, Full Hood/Fenders, Mirrors)')}
          ${opt('ppf','High-Impact (Rocker Panels, A-Pillars, Door Cups)')}
          ${opt('ppf','Full Body PPF')}

          <h4>🖼️ Vinyl Wraps</h4>
          ${opt('wrap','Full Vehicle Wrap')}
          ${opt('wrap','Partial Wrap (Sides / Hood / Roof)')}
          ${opt('wrap','Logos & Decals Only')}
          ${opt('wrap','Chrome Delete')}
          ${opt('wrap','Roof or Hood Accent')}
          ${opt('wrap','Color Change (Specify color)')}

          <div id="wrapOptions" class="hidden" aria-label="Wrap color picker">
            <div class="wrap-picker">
              <div>
                <div style="font-weight:700;color:#0f172a;margin-top:6px">Choose a color</div>
                <div class="swatches" id="wrapSwatches">
                  ${swatch('#000000')}${swatch('#FFFFFF')}${swatch('#FF0000')}${swatch('#00A3FF')}
                  ${swatch('#00C853')}${swatch('#FF6F00')}${swatch('#8E24AA')}${swatch('#FFC0CB')}
                </div>
              </div>
              <input type="color" id="wrapColorCustom" class="input" value="#00A3FF" aria-label="Custom wrap color" />
            </div>
            <div id="wrapColorChip" class="wrap-chip hidden" aria-live="polite">
              <span class="chip-dot" id="wrapChipDot"></span>
              <span id="wrapChipText">Selected: #00A3FF</span>
            </div>
          </div>

          <h4>➕ Add-Ons</h4>
          ${opt(null,'Engine Bay Detail')}
          ${opt(null,'Headlight Restoration')}
          ${opt(null,'Pet Hair Removal')}
          ${opt(null,'Carpet & Seat Shampoo')}
          ${opt(null,'Ozone Odor Elimination')}

          <div class="request-section"><span id="selectedCount">Select services to request a quote</span></div>

          <!-- Preferred date/time + zip + notes -->
          <div class="inline-fields" aria-label="Preferred date and time">
            <input class="input" type="date" id="preferredDate" placeholder="Preferred date" />
            <input class="input" type="time" id="preferredTime" placeholder="Preferred time" />
          </div>
          <div style="margin-top:10px">
            <input class="input" type="text" id="zipCode" inputmode="numeric" pattern="[0-9]*" placeholder="ZIP code (optional)" />
          </div>
          <div style="margin-top:10px">
            <textarea class="textarea" id="notes" placeholder="Notes (wrap brand/finish, extra details, etc.)"></textarea>
          </div>

          <button class="cta-button" data-gtm-event="sms_prefill" onclick="window.sendServiceRequest()">📱 Text Me for Quote</button>
          <div class="sms-notice">${iconInfo(16)}<span>Sends your selections + preferences to our text line</span></div>
        </div>
      </div>
    `;

    // Inject
    document.body.insertAdjacentHTML('beforeend', mobileFooter);
    document.body.insertAdjacentHTML('beforeend', desktopButtons);
    document.body.insertAdjacentHTML('beforeend', calculatorModal);
    // Mark footer present to enable padding
    document.body.classList.add('ab-foot-visible');

    // Hide footer when keyboard/pickers open (prevents cutoff)
    if (window.visualViewport){
      const onViewport = () => {
        const keyboardOpen = (window.innerHeight - window.visualViewport.height) > 150;
        document.body.classList.toggle('ab-hide-footer', keyboardOpen);
      };
      window.visualViewport.addEventListener('resize', onViewport);
      window.visualViewport.addEventListener('scroll', onViewport);
      window.addEventListener('focusin', onViewport);
      window.addEventListener('focusout', onViewport);
    }

    // ------- GTM events -------
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-gtm-event]');
      if (!target) return;
      const ev = target.getAttribute('data-gtm-event');
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({event: ev, ab_location: (window.innerWidth>768?'desktop':'mobile')});
    });

    // ------- Modal logic -------
    window.openCalculator = function(){
      const m = document.getElementById('calculatorModal');
      m.classList.add('active'); document.body.style.overflow='hidden';
      window.handleSelection();
    };
    window.closeCalculator = function(){
      const m = document.getElementById('calculatorModal');
      m.classList.remove('active'); document.body.style.overflow='';
      document.querySelectorAll('.service-option input[type="checkbox"]').forEach((cb,i)=>{
        setTimeout(()=>{ cb.checked=false; cb.closest('.service-option').classList.remove('selected'); }, i*20);
      });
      // Reset wrap/tint UIs
      toggleWrapUI(false); toggleTintUI(false);
      updateCount();
    };

    window.handleSelection = function (){
      const checked = [...document.querySelectorAll('.service-option input[type="checkbox"]:checked')];
      // Bundle exclusivity
      const hasBundle = checked.some(cb=>cb.dataset.service==='bundle');
      if (hasBundle){
        document.querySelectorAll('.service-option input[data-service="interior"], .service-option input[data-service="exterior"]').forEach(cb=>{
          if (cb.checked){ cb.checked=false; cb.closest('.service-option').classList.remove('selected'); }
        });
      }
      // Show/hide wrap/tint sections
      toggleWrapUI( checked.some(cb=>cb.dataset.service==='wrap') );
      toggleTintUI( checked.some(cb=>cb.dataset.service==='tint') );
      updateCount();
    };

    function updateCount(){
      const finalChecked = document.querySelectorAll('.service-option input[type="checkbox"]:checked');
      const el = document.getElementById('selectedCount');
      el.textContent = finalChecked.length === 0
        ? 'Select services to request a quote'
        : finalChecked.length === 1 ? '1 service selected' : `${finalChecked.length} services selected`;
    }

    // ------- Wrap color UI -------
    let selectedWrapColor = ''; // hex string

    function selectWrapColor(hex){
      selectedWrapColor = hex;
      const chip = document.getElementById('wrapColorChip');
      const dot  = document.getElementById('wrapChipDot');
      const txt  = document.getElementById('wrapChipText');
      chip.classList.remove('hidden');
      dot.style.background = hex;
      txt.textContent = `Selected: ${hex.toUpperCase()}`;
      // highlight swatch
      document.querySelectorAll('#wrapSwatches .swatch').forEach(s=>{
        s.classList.toggle('selected', s.getAttribute('data-color').toLowerCase() === hex.toLowerCase());
      });
      // sync color input
      const picker = document.getElementById('wrapColorCustom');
      if (picker && picker.value.toLowerCase() !== hex.toLowerCase()){
        picker.value = hex;
      }
    }
    function setupWrapUI(){
      const sw = document.getElementById('wrapSwatches');
      if (sw){
        sw.addEventListener('click', (e)=>{
          const btn = e.target.closest('.swatch');
          if (!btn) return;
          selectWrapColor(btn.getAttribute('data-color'));
          pushEvent('wrap_color_select', { color: selectedWrapColor });
        });
      }
      const picker = document.getElementById('wrapColorCustom');
      if (picker){
        picker.addEventListener('input', ()=>{
          selectWrapColor(picker.value);
          pushEvent('wrap_color_custom', { color: selectedWrapColor });
        });
      }
    }
    function toggleWrapUI(show){
      const el = document.getElementById('wrapOptions');
      if (!el) return;
      if (show){ el.classList.remove('hidden'); if (!selectedWrapColor) selectWrapColor('#00A3FF'); setupWrapUI(); }
      else { el.classList.add('hidden'); /* keep color so it can persist if they re-open */ }
    }

    // ------- Tint % UI -------
    function toggleTintUI(show){
      const el = document.getElementById('tintOptions');
      if (!el) return;
      el.classList.toggle('hidden', !show);
    }

    // ------- SMS helpers (clean iOS/Android prefill) -------
    function encodeSMSBody(str){
      return encodeURIComponent(String(str || '').replace(/\r\n?/g, '\n'));
    }
    function buildSMSHref(number, bodyText){
      const ua = navigator.userAgent || '';
      const isiOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
      const sep = isiOS ? '&' : '?'; // iOS uses &body=, Android uses ?body=
      return `sms:${number}${bodyText ? `${sep}body=${encodeSMSBody(bodyText)}` : ''}`;
    }

    // ------- SMS compose -------
    window.sendServiceRequest = function(){
      const vehicleTypeEl = document.getElementById('vehicleType');
      const vehicleLabel = vehicleTypeEl.options[vehicleTypeEl.selectedIndex].text;

      const date = document.getElementById('preferredDate')?.value || '';
      const time = document.getElementById('preferredTime')?.value || '';
      const zip  = document.getElementById('zipCode')?.value?.trim() || '';
      const notes = document.getElementById('notes')?.value?.trim() || '';

      const tintPercent = document.getElementById('tintPercent')?.value || '';
      const tintNotes   = document.getElementById('tintNotes')?.value?.trim() || '';

      const checked = [...document.querySelectorAll('.service-option input[type="checkbox"]:checked')];
      if (!checked.length){ alert('Please select at least one service'); return; }

      const services = checked.map(cb => `• ${cb.closest('label').querySelector('span').textContent.trim()}`);

      const details = [];
      if (date) details.push(`Preferred Date: ${date}`);
      if (time) details.push(`Preferred Time: ${time}`);
      if (zip)  details.push(`ZIP: ${zip}`);
      if (selectedWrapColor && checked.some(cb=>cb.dataset.service==='wrap')) details.push(`Wrap Color: ${selectedWrapColor.toUpperCase()}`);
      if (tintPercent && checked.some(cb=>cb.dataset.service==='tint')) details.push(`Tint: ${tintPercent}${tintNotes?` (${tintNotes})`:''}`);
      if (notes) details.push(`Notes: ${notes}`);

      const smsBody = [
        '🚗 Shine Design — Quote Request',
        '',
        `Vehicle: ${vehicleLabel}`,
        '',
        'Services Requested:',
        ...services,
        '',
        ...(details.length ? details : []),
        details.length ? '' : '',
        'Please send me pricing for these services.',
        '',
        'Thank you!'
      ].join('\n');

      // Open SMS app with a clean, encoded message
      location.href = buildSMSHref(AB.phone, smsBody);

      // Desktop fallback
      setTimeout(()=>{
        if (!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)){
          if (navigator.clipboard?.writeText){
            navigator.clipboard.writeText(smsBody).then(()=>alert(`Message copied! Please text it to ${AB.phone.replace('+1','')}`));
          } else {
            prompt(`Copy this message and text it to ${AB.phone.replace('+1','')} :`, smsBody);
          }
        }
      }, 500);
    };

    // Wire “Text” buttons (mobile + desktop) to use the same SMS flow
    ['ab-text-btn','ab-text-btn-desktop'].forEach(id=>{
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('click', ()=>{
        const modalOpen = document.getElementById('calculatorModal')?.classList.contains('active');
        if (!modalOpen) { window.openCalculator(); return; }
        window.sendServiceRequest();
      });
    });

    // Checkbox visuals
    document.querySelectorAll('.service-option input[type="checkbox"]').forEach(cb=>{
      cb.addEventListener('change', function(){
        const opt = this.closest('.service-option');
        if (this.checked){ opt.classList.add('selected'); opt.style.transform='scale(1.02)'; setTimeout(()=>opt.style.transform='',200); }
        else { opt.classList.remove('selected'); }
      });
    });

    // Close on backdrop
    document.getElementById('calculatorModal').addEventListener('click', (e)=>{ if (e.target.id==='calculatorModal') window.closeCalculator(); });

    // Esc
    document.addEventListener('keydown', (e)=>{ if (e.key==='Escape' && document.getElementById('calculatorModal').classList.contains('active')) window.closeCalculator(); });

    // Gentle desktop nudge
    if (window.innerWidth>768){
      setInterval(()=>{
        const p = document.querySelector('.floating-btn.primary');
        if (p){ p.style.transform='scale(1.05)'; setTimeout(()=>p.style.transform='',300); }
      }, 5000);
    }
  } // end init()

  // ------- Helpers / icons / GTM push -------
  function pushEvent(event, params={}){ window.dataLayer = window.dataLayer || []; window.dataLayer.push({event, ...params}); }

  function iconCalendar(s=24){return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12z"/></svg>`;}
  function iconPhone(s=24){return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.49a1 1 0 01-.5 1.21l-2.26 1.13a11.04 11.04 0 005.52 5.52l1.13-2.26a1 1 0 011.21-.5l4.49 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z"/></svg>`;}
  function iconChat(s=24){return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.26-.95L3 20l1.4-3.72A7.96 7.96 0 013 12c0-4.42 4.03-8 9-8s9 3.58 9 8z"/></svg>`;}
  function iconClipboard(s=24){return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>`;}
  function iconInfo(s=16){return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;}

  function swatch(hex){ return `<button class="swatch" type="button" data-color="${hex}" style="background:${hex}"></button>`; }
  function opt(dataService,label){
    const dsAttr = dataService ? ` data-service="${dataService}"` : '';
    return `<div class="service-option"><label><input type="checkbox"${dsAttr} onchange="window.handleSelection()"><span>${label}</span></label></div>`;
  }

  // Initialize when DOM is ready
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();