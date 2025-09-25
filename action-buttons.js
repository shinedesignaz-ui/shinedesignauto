// /action-buttons.js — Shine Design Mobile Detailing
// Vehicle-first flow, grouped options, live summary, footer-safe on mobile
// Vinyl Wrap: color + finishes + brand chips (3M/Avery/Inozetek/KPMF/Hexis) + custom brand
// Single-file, drop-in script (no external dependencies)
(function () {
  'use strict';

  // ------- Quick config -------
  const AB = {
    phone: '+14805288227',
    bookingUrl: 'https://booknow.shinedesignauto.com/',
    footerMode: 'flush', // 'floating' or 'flush'
    barHeightPx: 84,
    version: 'wrapbrands-3+tint-1'
  };

  // Prevent duplicate loading (versioned so new builds override old)
  if (window.shineActionButtonsLoaded_v3) return;
  window.shineActionButtonsLoaded_v3 = AB.version;
  try { console.log('[Shine AB] Loaded', AB.version); } catch {}

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
          background:#fff;
          backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
          box-shadow:${AB.footerMode==='floating'
            ? '0 8px 32px rgba(0,0,0,.12),0 2px 8px rgba(0,0,0,.04)'
            : '0 -2px 16px rgba(0,0,0,.08)'};
          z-index:1100;display:block;border-top:1px solid #e2e8f0;
          border-radius:${AB.footerMode==='floating'?'20px':'0'};
          animation:slideUpSmooth .4s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes slideUpSmooth { from{transform:translateY(120%);opacity:0} to{transform:translateY(0);opacity:1} }
        .footer-grid{display:flex;align-items:center;justify-content:center;gap:8px;padding:12px 16px;max-width:420px;margin:0 auto}
        .footer-item{
          position:relative;background:#fff;border:1.5px solid #e2e8f0;
          padding:10px 8px;text-align:center;cursor:pointer;transition:all .2s ease;
          text-decoration:none;color:#0f172a;border-radius:14px;-webkit-tap-highlight-color:transparent;overflow:hidden;flex:1;min-width:0;
        }
        .footer-item.primary{background:linear-gradient(135deg,#0ea5e9,#0284c7);color:#fff;border-color:rgba(14,165,233,.3)}
        .footer-item:active{transform:scale(.97)}
        .footer-item svg{width:22px;height:22px;margin-bottom:4px}
        .footer-item.primary svg{color:#fff}
        .footer-item span{display:block;font-weight:700;letter-spacing:-.01em}
        .desktop-floating-buttons{display:none!important}
      }

      @media(min-width:769px){
        .mobile-sticky-footer{display:none!important}
        .desktop-floating-buttons{
          position:fixed;bottom:24px;right:20px;z-index:1100;display:flex;flex-direction:column-reverse;gap:14px;
        }
        .floating-btn{
          width:64px;height:64px;border-radius:20px;background:#fff;border:1.5px solid #e2e8f0;
          display:flex;align-items:center;justify-content:center;text-decoration:none;transition:.25s;
          box-shadow:0 8px 24px rgba(0,0,0,.12)
        }
        .floating-btn:hover{transform:translateY(-4px) scale(1.03)}
        .floating-btn svg{width:28px;height:28px;color:#0ea5e9}
        .floating-btn.primary{width:76px;height:76px;background:linear-gradient(135deg,#0ea5e9,#0284c7);border:2px solid rgba(255,255,255,.4)}
        .floating-btn.primary svg{color:#fff;width:34px;height:34px}
        .tooltip{position:absolute;right:80px;background:rgba(15,23,42,.95);color:#fff;padding:8px 12px;border-radius:8px;font-size:13px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .2s}
        .floating-btn:hover .tooltip{opacity:1}
      }

      .ab-hide-footer .mobile-sticky-footer{ display:none !important; }
      .ab-hide-footer.ab-foot-visible{ padding-bottom:0 !important; }

      /* Modal base */
      .calculator-modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:2000;animation:fadeIn .3s ease}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      .calculator-modal.active{display:flex;align-items:center;justify-content:center;padding:20px}
      .calculator-content{
        background:#fff;border-radius:24px;padding:24px 24px 28px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;
        box-shadow:0 20px 60px rgba(0,0,0,.3);font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Helvetica,Arial,sans-serif;
        scroll-padding-bottom: calc(160px + env(safe-area-inset-bottom,0px));
      }
      .kb-open .calculator-content{ padding-bottom: calc(180px + env(safe-area-inset-bottom,0px)); }

      .calculator-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;padding-bottom:12px;border-bottom:2px solid #f1f5f9}
      .calculator-header h3{color:#0f172a;font-size:22px;margin:0;font-weight:800}

      .close-btn{background:#f1f5f9;border:none;font-size:22px;color:#64748b;cursor:pointer;width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center}
      .close-btn:hover{background:#e2e8f0;color:#ef4444}

      /* Group titles */
      .section-title{margin:18px 0 10px;color:#0f172a;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:.8px}

      /* Streamlined option pills */
      .grid{display:grid;grid-template-columns:1fr;gap:8px}
      @media(min-width:520px){ .grid{grid-template-columns:1fr 1fr} }
      .option{
        display:flex;align-items:center;gap:10px;background:#fff;border:1.5px solid #e2e8f0;border-radius:12px;padding:12px 14px;cursor:pointer;transition:.2s;
      }
      .option:hover{border-color:#0ea5e9}
      .option input{width:20px;height:20px;accent-color:#0ea5e9}
      .opt-label{font-weight:800;color:#0f172a}
      .opt-sub{display:block;font-size:12px;color:#64748b;font-weight:600;line-height:1.2}
      .option.selected{border-color:#0ea5e9;box-shadow:0 4px 16px rgba(14,165,233,.18)}

      /* Summary card */
      .summary-card{margin-top:16px;border:1.5px solid #e2e8f0;border-radius:14px;padding:12px 14px;background:#f8fafc}
      .summary-card h5{margin:0 0 8px;font-size:14px;color:#0f172a}
      .summary-list{margin:0;padding-left:18px}
      .summary-list li{font-size:13px;color:#334155;margin:2px 0}

      /* Inputs */
      .input{width:100%;padding:12px 14px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:14px;background:#fff;color:#0f172a}
      .textarea{width:100%;padding:12px 14px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:14px;min-height:64px;resize:vertical}

      .cta-button{width:100%;padding:16px;background:linear-gradient(135deg,#0ea5e9,#0284c7);color:#fff;border:none;border-radius:999px;font-size:16px;font-weight:900;cursor:pointer;margin-top:14px}
      .sms-notice{font-size:13px;color:#64748b;text-align:center;margin-top:10px;display:flex;align-items:center;justify-content:center;gap:6px}

      /* Wrap color UI */
      .swatches{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
      .swatch{width:32px;height:32px;border-radius:8px;border:2px solid rgba(0,0,0,.1);cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.08)}
      .swatch.selected{outline:3px solid rgba(14,165,233,.5)}
      .wrap-picker{display:grid;grid-template-columns:1fr auto;gap:10px;margin-top:10px;align-items:center}
      .wrap-chip{display:inline-flex;align-items:center;gap:8px;padding:8px 10px;border-radius:10px;background:#f8fafc;border:1.5px solid #e2e8f0;font-size:12px;color:#0f172a;margin-top:8px}
      .wrap-chip .chip-dot{width:12px;height:12px;border-radius:50%;border:1px solid rgba(0,0,0,.2)}

      /* Chips (finish / brand) */
      .chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
      .chip{
        border:1.5px solid #e2e8f0;border-radius:999px;padding:8px 12px;font-size:13px;font-weight:700;color:#0f172a;background:#fff;cursor:pointer;
      }
      .chip.selected{border-color:#0ea5e9;background:#f0f9ff;box-shadow:0 2px 8px rgba(14,165,233,.16)}
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
          <a href="${AB.bookingUrl}" class="footer-item primary" data-gtm-event="book_click" aria-label="Book Online">
            ${iconCalendar()}<span>Book</span>
          </a>
          <a href="tel:${AB.phone}" class="footer-item" data-gtm-event="call_click" aria-label="Call">
            ${iconPhone()}<span>Call</span>
          </a>
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

    // ------- Modal (Vinyl Wrap is its own section) -------
    const calculatorModal = `
      <div class="calculator-modal" id="calculatorModal">
        <div class="calculator-content" role="dialog" aria-modal="true" aria-labelledby="calcTitle">
          <div class="calculator-header">
            <h3 id="calcTitle">✨ Build Your Package</h3>
            <button class="close-btn" onclick="window.closeCalculator()" aria-label="Close">✕</button>
          </div>

          <label style="display:block;margin-bottom:8px;color:#475569;font-size:14px;font-weight:700;">Vehicle Type:</label>
          <select class="input" id="vehicleType" aria-label="Vehicle type">
            <option value="small">🚗 Small (Sedan/Coupe/Hatchback)</option>
            <option value="medium">🚙 Medium (Small SUV/Crossover)</option>
            <option value="large">🚚 Large (Full-Size Truck/Large Sedan)</option>
            <option value="xl">🚐 XL (Full-Size SUV/Minivan)</option>
            <option value="xxl">🚌 XXL (Extended Van)</option>
            <option value="rv">🏕️ RV / Motorhome</option>
            <option value="boat">🛥️ Boat</option>
            <option value="aircraft">✈️ Aircraft</option>
          </select>

          <div class="section-title">💰 Packages (Best Value)</div>
          <div class="grid">
            ${opt('bundle','Silver Package','Interior L1 + Exterior L1')}
            ${opt('bundle','Gold Package','Interior L2 + Exterior L2')}
            ${opt('bundle','Platinum Package','Interior L3 + Exterior L2')}
          </div>

          <div class="section-title">🧹 Interior</div>
          <div class="grid">
            ${opt('interior','Vacuum & Wipe Down','carpets, seats, mats, windows')}
            ${opt('interior','Shampoo / Extraction','carpet & upholstery')}
            ${opt('interior','Stain Treatment','spot stains & spills')}
            ${opt('interior','Pet Hair Removal','moderate to heavy')}
            ${opt('interior','Odor/Ozone Treatment','smoke, mildew, pet')}
            ${opt('interior','Leather Clean & Condition','clean + moisturize')}
          </div>

          <div class="section-title">✨ Exterior</div>
          <div class="grid">
            ${opt('exterior','Maintenance Wash','foam wash + protection')}
            ${opt('exterior','Iron Decon','removes embedded iron')}
            ${opt('exterior','Clay Bar','smooths surface')}
            ${opt('exterior','One-Step Polish','gloss boost, light defects')}
            ${opt('exterior','Two-Step Correction','cut + polish, deeper defects')}
            ${opt(null,'Trim & Tire Restore','dress plastics & tires')}
          </div>

          <div class="section-title">🛠 Paint Correction</div>
          <div class="grid">
            ${opt(null,'Enhancement Polish (≈70%)','single-stage refine')}
            ${opt(null,'Full Correction (≈85%)','multi-stage cut & polish')}
            ${opt(null,'Show Car Finish (≈95%)','maximum clarity')}
          </div>

          <div class="section-title">🛡️ Ceramic Coating</div>
          <div class="grid">
            ${opt(null,'Essential – 3 Year','great daily driver')}
            ${opt(null,'Premium – 5+ Year','high gloss & durability')}
            ${opt(null,'Elite – 7+ Year / Lifetime','ultimate protection')}
          </div>

          <div class="section-title">🛡️ PPF (Paint Protection Film)</div>
          <div class="grid">
            ${opt('ppf','Front Bumper','')}
            ${opt('ppf','Partial Front','bumper + 18–24" hood/fenders + mirrors')}
            ${opt('ppf','Full Front','bumper + full hood/fenders + mirrors')}
            ${opt('ppf','High-Impact','rockers, A-pillars, door cups')}
            ${opt('ppf','Full Body PPF','maximum coverage')}
          </div>


<div class="section-title">🪟 Window Tint</div>
<div class="grid">
  ${opt('tint','Ceramic Tint','')}
  ${opt('tint','Dyed Tint','')}
  ${opt('tint','Front Windshield Tint','')}
</div>

<div id="tintOptions" class="hidden" aria-label="Tint percentages">
  <div style="font-weight:700;color:#0f172a;margin-top:8px">Tint Percentage</div>
  <div class="chips" id="tintPercentChips" role="group" aria-label="Tint percent">
    <button type="button" class="chip" data-percent="5%">5%</button>
    <button type="button" class="chip" data-percent="15%">15%</button>
    <button type="button" class="chip" data-percent="20%">20%</button>
    <button type="button" class="chip" data-percent="35%">35%</button>
    <button type="button" class="chip" data-percent="50%">50%</button>
    <button type="button" class="chip" data-percent="70%">70%</button>
  </div>
</div>

          <div class="section-title">🖼️ Vinyl Wrap</div>
          <div class="grid">
            ${opt('wrap','Full Vehicle Wrap','')}
            ${opt('wrap','Partial Wrap (Sides / Hood / Roof)','')}
            ${opt('wrap','Logos & Decals Only','')}
            ${opt('wrap','Chrome Delete','')}
            ${opt('wrap','Roof or Hood Accent','')}
            ${opt('wrap','Color Change (Specify color)','')}
          </div>

          <div id="wrapOptions" class="hidden" aria-label="Wrap details">
            <div class="wrap-picker" style="margin-top:8px">
              <div>
                <div style="font-weight:700;color:#0f172a;margin-top:6px">Wrap color</div>
                <div class="swatches" id="wrapSwatches">
                  ${swatch('#000000')}${swatch('#FFFFFF')}${swatch('#FF0000')}${swatch('#00A3FF')}
                  ${swatch('#00C853')}${swatch('#FF6F00')}${swatch('#8E24AA')}${swatch('#FFC0CB')}
                </div>
              </div>
              <input type="color" id="wrapColorCustom" class="input" value="#00A3FF" aria-label="Custom wrap color" />
            </div>

            <div class="chips" id="wrapFinishChips" role="group" aria-label="Wrap finish">
              <button type="button" class="chip" data-finish="Gloss">Gloss</button>
              <button type="button" class="chip" data-finish="Satin">Satin</button>
              <button type="button" class="chip" data-finish="Matte">Matte</button>
              <button type="button" class="chip" data-finish="Metallic">Metallic</button>
              <button type="button" class="chip" data-finish="Color-Shift">Color-Shift</button>
            </div>

            <div style="margin-top:12px">
              <div style="font-weight:700;color:#0f172a;margin-bottom:6px">Brand</div>
              <div class="chips" id="wrapBrandChips" role="group" aria-label="Wrap brand">
                <button type="button" class="chip" data-brand="3M">3M</button>
                <button type="button" class="chip" data-brand="Avery Dennison">Avery Dennison</button>
                <button type="button" class="chip" data-brand="Inozetek">Inozetek</button>
                <button type="button" class="chip" data-brand="KPMF">KPMF</button>
                <button type="button" class="chip" data-brand="Hexis">Hexis</button>
              </div>
              <input type="text" id="wrapBrandOther" class="input" placeholder="Other brand — optional" style="margin-top:8px" />
            </div>

            <div id="wrapColorChip" class="wrap-chip hidden" aria-live="polite">
              <span class="chip-dot" id="wrapChipDot"></span>
              <span id="wrapChipText">Selected: #00A3FF</span>
            </div>
          </div>

          <!-- Live summary -->
          <div class="summary-card" id="summaryCard">
            <h5>Selected Services</h5>
            <ul class="summary-list" id="summaryList"><li style="color:#64748b">Nothing selected yet.</li></ul>
          </div>

          <!-- Contact details (no date/time) -->
          <div style="margin-top:12px">
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

    // Inject UI
    document.body.insertAdjacentHTML('beforeend', mobileFooter);
    document.body.insertAdjacentHTML('beforeend', desktopButtons);
    document.body.insertAdjacentHTML('beforeend', calculatorModal);
    document.body.classList.add('ab-foot-visible'); // padding enabled

    // Hide footer when keyboard opens (prevents cutoff)
    if (window.visualViewport){
      const onViewport = () => {
        const keyboardOpen = (window.innerHeight - window.visualViewport.height) > 150;
        document.body.classList.toggle('ab-hide-footer', keyboardOpen);
        document.body.classList.toggle('kb-open', keyboardOpen);
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
      document.querySelectorAll('.option input[type="checkbox"]').forEach((cb,i)=>{
        setTimeout(()=>{ cb.checked=false; cb.closest('.option').classList.remove('selected'); }, i*10);
      });
      toggleWrapUI(false);
      selectedWrapColor = '';
      selectedWrapFinish = '';
      selectedWrapBrandChip = '';
      const chips = document.querySelectorAll('#wrapFinishChips .chip, #wrapBrandChips .chip');
      chips.forEach(c=>c.classList.remove('selected'));
      const brandOther = document.getElementById('wrapBrandOther'); if (brandOther) brandOther.value = '';
      updateSummary();
    };

    window.handleSelection = function (){
      const checked = [...document.querySelectorAll('.option input[type="checkbox"]:checked')];
      // Bundle exclusivity: uncheck interior/exterior groups when a bundle is chosen
      const hasBundle = checked.some(cb=>cb.dataset.service==='bundle');
      if (hasBundle){
        document.querySelectorAll('.option input[data-service="interior"], .option input[data-service="exterior"]').forEach(cb=>{
          if (cb.checked){ cb.checked=false; cb.closest('.option').classList.remove('selected'); }
        });
      }
      // Show/hide wrap detail UI
      toggleWrapUI( checked.some(cb=>cb.dataset.service==='wrap') );
      // Show/hide tint percentage UI
      toggleTintUI( checked.some(cb=>cb.dataset.service==='tint') );
      updateSummary();
    };

    function updateSummary(){
      const list = document.getElementById('summaryList');
      const items = [...document.querySelectorAll('.option input:checked')].map(cb=>{
        const span = cb.closest('.option').querySelector('.opt-label').textContent.trim();
        return `<li>${span}</li>`;
      });

      // Append wrap details preview if any
      const brandText = getWrapBrand();
      if (selectedWrapColor || selectedWrapFinish || brandText){
        const details = [
          selectedWrapColor ? `Color: ${selectedWrapColor.toUpperCase()}` : '',
          selectedWrapFinish ? `Finish: ${selectedWrapFinish}` : '',
          brandText ? `Brand: ${brandText}` : ''
        ].filter(Boolean).join(' • ');
        if (details) items.push(`<li>Wrap Details — ${details}</li>`);
      }
      // Append tint details if selected
      if (selectedTintPercent){
        items.push(`<li>Tint — ${selectedTintPercent}</li>`);
      }

      list.innerHTML = items.length ? items.join('') : '<li style="color:#64748b">Nothing selected yet.</li>';
    }

    // ------- Wrap details (color + finish + brand) -------
    let selectedWrapColor = '';   // hex string
    let selectedWrapFinish = '';  // string
    let selectedWrapBrandChip = '';// from chip (optional)

    // Tint state
    let selectedTintPercent = '';

    function selectWrapColor(hex){
      selectedWrapColor = hex;
      const chip = document.getElementById('wrapColorChip');
      const dot  = document.getElementById('wrapChipDot');
      const txt  = document.getElementById('wrapChipText');
      chip.classList.remove('hidden');
      dot.style.background = hex;
      txt.textContent = `Selected: ${hex.toUpperCase()}`;
      document.querySelectorAll('#wrapSwatches .swatch').forEach(s=>{
        s.classList.toggle('selected', s.getAttribute('data-color').toLowerCase() === hex.toLowerCase());
      });
      const picker = document.getElementById('wrapColorCustom');
      if (picker && picker.value.toLowerCase() !== hex.toLowerCase()){
        picker.value = hex;
      }
      updateSummary();
    }
    function setupWrapUI(){
      const sw = document.getElementById('wrapSwatches');
      if (sw){
        sw.addEventListener('click', (e)=>{
          const btn = e.target.closest('.swatch');
          if (!btn) return;
          selectWrapColor(btn.getAttribute('data-color'));
        });
      }

function setupTintUI(){
  const chips = document.getElementById('tintPercentChips');
  if (!chips) return;
  chips.addEventListener('click', (e)=>{
    const btn = e.target.closest('.chip');
    if (!btn) return;
    chips.querySelectorAll('.chip').forEach(c=>c.classList.remove('selected'));
    btn.classList.add('selected');
    selectedTintPercent = btn.getAttribute('data-percent') || '';
    updateSummary();
  });
}
function toggleTintUI(show){
  const el = document.getElementById('tintOptions');
  if (!el) return;
  if (show){ el.classList.remove('hidden'); if (!selectedTintPercent) setupTintUI(); }
  else { el.classList.add('hidden'); }
}
      const picker = document.getElementById('wrapColorCustom');
      if (picker){
        picker.addEventListener('input', ()=> selectWrapColor(picker.value));
      }
      const finishChips = document.getElementById('wrapFinishChips');
      if (finishChips){
        finishChips.addEventListener('click', (e)=>{
          const btn = e.target.closest('.chip');
          if (!btn) return;
          finishChips.querySelectorAll('.chip').forEach(c=>c.classList.remove('selected'));
          btn.classList.add('selected');
          selectedWrapFinish = btn.getAttribute('data-finish');
          updateSummary();
        });
      }
      const brandChips = document.getElementById('wrapBrandChips');
      if (brandChips){
        brandChips.addEventListener('click', (e)=>{
          const btn = e.target.closest('.chip');
          if (!btn) return;
          brandChips.querySelectorAll('.chip').forEach(c=>c.classList.remove('selected'));
          btn.classList.add('selected');
          selectedWrapBrandChip = btn.getAttribute('data-brand') || '';
          const txt = document.getElementById('wrapBrandOther');
          if (txt){ txt.value = ''; } // chip takes precedence, clear custom
          updateSummary();
        });
      }
      const brandOther = document.getElementById('wrapBrandOther');
      if (brandOther){
        brandOther.addEventListener('input', ()=>{
          // Custom brand overrides chip selection
          if (brandOther.value.trim()){
            const brandChips = document.getElementById('wrapBrandChips');
            if (brandChips) brandChips.querySelectorAll('.chip').forEach(c=>c.classList.remove('selected'));
            selectedWrapBrandChip = '';
          }
          updateSummary();
        });
      }
    }
    function getWrapBrand(){
      const custom = document.getElementById('wrapBrandOther')?.value.trim() || '';
      return custom || selectedWrapBrandChip || '';
    }
    function toggleWrapUI(show){
      const el = document.getElementById('wrapOptions');
      if (!el) return;
      if (show){ el.classList.remove('hidden'); if (!selectedWrapColor) selectWrapColor('#00A3FF'); setupWrapUI(); }
      else { el.classList.add('hidden'); }
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

      const zip  = document.getElementById('zipCode')?.value?.trim() || '';
      const notes = document.getElementById('notes')?.value?.trim() || '';
      const wrapBrand = getWrapBrand();

      const checked = [...document.querySelectorAll('.option input[type="checkbox"]:checked')];
      if (!checked.length){ alert('Please select at least one service'); return; }

      const services = checked.map(cb => cb.closest('.option').querySelector('.opt-label').textContent.trim())
                              .map(s => `• ${s}`);

      const details = [];
      if (zip)  details.push(`ZIP: ${zip}`);
      // Wrap specifics if any wrap service is selected
      if (checked.some(cb=>cb.dataset.service==='wrap')){
        if (selectedWrapColor) details.push(`Wrap Color: ${selectedWrapColor.toUpperCase()}`);
        if (selectedWrapFinish) details.push(`Wrap Finish: ${selectedWrapFinish}`);
        if (wrapBrand) details.push(`Wrap Brand: ${wrapBrand}`);
      }
      // Tint specifics if any tint service is selected
      if (checked.some(cb=>cb.dataset.service==='tint')){
        if (selectedTintPercent) details.push(`Tint Percent: ${selectedTintPercent}`);
      }
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

    // Wire “Text” buttons (mobile + desktop)
    ['ab-text-btn','ab-text-btn-desktop'].forEach(id=>{
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('click', ()=>{
        const modalOpen = document.getElementById('calculatorModal')?.classList.contains('active');
        if (!modalOpen) { window.openCalculator(); return; }
        window.sendServiceRequest();
      });
    });

    // Checkbox visuals + selection tracking
    document.addEventListener('change', (e)=>{
      const cb = e.target.closest('.option input[type="checkbox"]');
      if (!cb) return;
      cb.closest('.option').classList.toggle('selected', cb.checked);
      window.handleSelection();
    });

    // Close on backdrop
    document.getElementById('calculatorModal').addEventListener('click', (e)=>{ if (e.target.id==='calculatorModal') window.closeCalculator(); });

    // Esc
    document.addEventListener('keydown', (e)=>{ if (e.key==='Escape' && document.getElementById('calculatorModal').classList.contains('active')) window.closeCalculator(); });
  } // end init()

  // ------- Icons -------
  function iconCalendar(s=24){return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12z"/></svg>`;}
  function iconPhone(s=24){return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.49a1 1 0 01-.5 1.21l-2.26 1.13a11.04 11.04 0 005.52 5.52l1.13-2.26a1 1 0 011.21-.5l4.49 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z"/></svg>`;}
  function iconChat(s=24){return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.26-.95L3 20l1.4-3.72A7.96 7.96 0 013 12c0-4.42 4.03-8 9-8s9 3.58 9 8z"/></svg>`;}
  function iconClipboard(s=24){return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>`;}
  function iconInfo(s=16){return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;}

  // ------- Small helpers -------
  function swatch(hex){ return `<button class="swatch" type="button" data-color="${hex}" style="background:${hex}"></button>`; }
  function opt(dataService,label,sub=''){
    const dsAttr = dataService ? ` data-service="${dataService}"` : '';
    return `
      <label class="option">
        <input type="checkbox"${dsAttr} onchange="window.handleSelection()">
        <span>
          <span class="opt-label">${label}</span>
          ${sub ? `<span class="opt-sub">${sub}</span>` : ``}
        </span>
      </label>`;
  }

  // Initialize when DOM is ready
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
