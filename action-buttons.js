// action-buttons.js — Shine Design Mobile Detailing
// Floating buttons (mobile footer + desktop FABs) with service calculator
(function () {
  'use strict';

  // ======= CONFIG =======
  const PHONE_NUMBER = '+14805288227';
  const BOOK_URL = 'https://booknow.shinedesignauto.com/';

  // Mobile layouts: 'book-center' | 'book-first' | 'two-by-two'
  const MOBILE_LAYOUT = 'book-center';
  // Desktop layouts: 'book-top' | 'calc-top' | 'text-top'
  const DESKTOP_LAYOUT = 'book-top';

  // How much to sink the mobile bar into iOS safe-area (visual lower position)
  const LOWER_OFFSET_PX = 8; // try 6–12 if you want to tweak

  // ======= INIT GUARD / DOM READY =======
  function onReady(fn){ document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn(); }

  function init() {
    if (window.shineActionButtonsLoaded) return;
    window.shineActionButtonsLoaded = true;

    // ======= CSS INJECTION =======
    const css = `
      html,body{max-width:100%;overflow-x:hidden}

      @media(max-width:768px){
        body{
          padding-bottom:calc(64px + max(0px, calc(env(safe-area-inset-bottom,0px) - ${LOWER_OFFSET_PX}px)))!important;
        }

        .mobile-sticky-footer{
          position:fixed;left:0;right:0;
          bottom:max(0px, calc(env(safe-area-inset-bottom,0px) - ${LOWER_OFFSET_PX}px));
          background:#fff;box-shadow:0 -2px 14px rgba(0,0,0,.12);
          z-index:1100;display:block;animation:slideUp .25s ease-out;
          padding-bottom:max(0px, calc(env(safe-area-inset-bottom,0px) - ${LOWER_OFFSET_PX}px));
        }
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}

        .footer-grid{
          display:grid;gap:0;background:#fff;max-width:100%;
          border-top:1px solid #e2e8f0
        }
        .footer-item{
          background:#fff;padding:10px 6px;text-align:center;cursor:pointer;transition:all .2s ease;
          text-decoration:none;color:#0f172a;border:none;font-family:inherit;font-size:11px;position:relative;
          border-right:1px solid #f1f5f9;-webkit-tap-highlight-color:transparent
        }
        .footer-item:last-child{border-right:none}
        .footer-item:active{transform:scale(.97);background:#f8fafc}
        .footer-item svg{width:22px;height:22px;margin-bottom:4px;color:#0ea5e9}
        .footer-item span{display:block;font-size:11px;font-weight:700;color:#475569;line-height:1.2}
        .footer-item--emph{font-size:12px}
        .footer-item--emph svg{width:26px;height:26px}

        /* Mobile layout variants */
        .footer-grid--book-center{ grid-template-columns:1fr 1.2fr 1fr 1fr }
        .footer-grid--book-center .footer-item[data-key="book"]{
          background:linear-gradient(135deg,#0ea5e9,#0284c7); color:#fff;border-right:1px solid rgba(255,255,255,.15)
        }
        .footer-grid--book-center .footer-item[data-key="book"] svg{ color:#fff }

        .footer-grid--book-first{ grid-template-columns:repeat(4,1fr) }
        .footer-grid--book-first .footer-item{ order:2 }
        .footer-grid--book-first .footer-item[data-key="book"]{ order:1 }
        .footer-grid--book-first .footer-item[data-key="calc"]{ order:3 }
        .footer-grid--book-first .footer-item[data-key="call"]{ order:4 }
        .footer-grid--book-first .footer-item[data-key="text"]{ order:5 }

        .footer-grid--two-by-two{ grid-template-columns:repeat(2,1fr) }
        .footer-grid--two-by-two .footer-item{ border-right:1px solid #f1f5f9 }
        .footer-grid--two-by-two .footer-item:nth-child(2n){ border-right:none }
        .footer-grid--two-by-two .footer-item[data-key="book"]{
          background:linear-gradient(135deg,#0ea5e9,#0284c7); color:#fff
        }
        .footer-grid--two-by-two .footer-item[data-key="book"] svg{ color:#fff }

        .desktop-floating-buttons{display:none!important}
      }

      @media(min-width:769px){
        .mobile-sticky-footer{display:none!important}

        .desktop-floating-buttons{
          position:fixed;bottom:24px;right:16px;z-index:1100;
          display:flex;flex-direction:column-reverse;gap:12px;animation:fadeInUp .4s ease-out
        }
        @keyframes fadeInUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

        .floating-btn{
          width:60px;height:60px;border-radius:50%;background:#fff;
          box-shadow:0 6px 22px rgba(0,0,0,.16);
          display:flex;align-items:center;justify-content:center;cursor:pointer;
          transition:all .25s;text-decoration:none;border:2px solid transparent
        }
        .floating-btn:hover{transform:scale(1.08);box-shadow:0 10px 30px rgba(0,0,0,.22);border-color:#0ea5e9}
        .floating-btn svg{width:28px;height:28px;color:#0ea5e9}
        .floating-btn.primary{width:70px;height:70px;background:linear-gradient(135deg,#0ea5e9,#0284c7);animation:pulse 2s infinite}
        @keyframes pulse{0%,100%{box-shadow:0 6px 24px rgba(14,165,233,.45)}50%{box-shadow:0 6px 34px rgba(14,165,233,.65)}}
        .floating-btn.primary svg{color:#fff;width:32px;height:32px}

        /* Desktop order variants */
        .desktop-floating-buttons.variant--book-top .btn--book{ order:1 }
        .desktop-floating-buttons.variant--book-top .btn--calc{ order:2 }
        .desktop-floating-buttons.variant--book-top .btn--call{ order:3 }
        .desktop-floating-buttons.variant--book-top .btn--text{ order:4 }

        .desktop-floating-buttons.variant--calc-top .btn--calc{ order:1 }
        .desktop-floating-buttons.variant--calc-top .btn--book{ order:2 }
        .desktop-floating-buttons.variant--calc-top .btn--call{ order:3 }
        .desktop-floating-buttons.variant--calc-top .btn--text{ order:4 }

        .desktop-floating-buttons.variant--text-top .btn--text{ order:1 }
        .desktop-floating-buttons.variant--text-top .btn--book{ order:2 }
        .desktop-floating-buttons.variant--text-top .btn--calc{ order:3 }
        .desktop-floating-buttons.variant--text-top .btn--call{ order:4 }
      }

      /* Calculator modal */
      .calculator-modal{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);z-index:2000}
      .calculator-modal.active{display:flex;align-items:center;justify-content:center;padding:20px}
      .calculator-content{background:#fff;border-radius:20px;padding:24px;width:100%;max-width:400px;max-height:90vh;overflow-y:auto}
      .calculator-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
      .calculator-header h3{color:#0f172a;font-size:20px;margin:0}
      .close-btn{background:none;border:none;font-size:28px;color:#64748b;cursor:pointer;padding:0;width:32px;height:32px;border-radius:50%;transition:background .2s}
      .close-btn:hover{background:#f1f5f9}
      .service-option{padding:12px;margin-bottom:10px;border:2px solid #e2e8f0;border-radius:12px;cursor:pointer;transition:all .2s}
      .service-option:hover{border-color:#0ea5e9;background:#f0f9ff}
      .service-option.selected{border-color:#0ea5e9;background:#f0f9ff}
      .service-option label{display:flex;align-items:center;cursor:pointer;font-size:14px;color:#0f172a;margin:0;gap:10px}
      .service-option input[type="checkbox"]{margin:0}
      .service-price{margin-left:auto;color:#0ea5e9;font-weight:600}
      .vehicle-select{width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:12px;margin-bottom:20px;font-size:14px;background:#fff}
      .calculator-content h4{margin:16px 0 8px;color:#475569;font-size:13px;text-transform:uppercase;letter-spacing:.5px;font-weight:600}
      .total-section{margin-top:20px;padding-top:20px;border-top:2px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;font-size:18px;font-weight:700;color:#0f172a}
      .total-price{color:#0ea5e9;font-size:24px}
      .cta-button{width:100%;padding:14px;background:linear-gradient(135deg,#0ea5e9,#0284c7);color:#fff;border:none;border-radius:999px;font-size:16px;font-weight:700;cursor:pointer;margin-top:20px;transition:all .2s}
      .cta-button:hover{background:linear-gradient(135deg,#0284c7,#0369a1);transform:translateY(-2px);box-shadow:0 4px 20px rgba(14,165,233,.3)}
      .cta-button:active{transform:scale(.98)}
      .sms-notice{font-size:12px;color:#64748b;text-align:center;margin-top:10px;display:flex;align-items:center;justify-content:center;gap:6px}
      .sms-notice svg{width:16px;height:16px}
    `;
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

    // ======= TEMPLATES =======
    function mobileFooterTemplate(variant){
      const calc = `
        <button class="footer-item" data-key="calc" onclick="window.openCalculator()" aria-label="Service Calculator">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg><span>Calculator</span>
        </button>`;
      const book = `
        <a class="footer-item footer-item--emph" data-key="book" href="${BOOK_URL}" aria-label="Book Online">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg><span>Book</span>
        </a>`;
      const call = `
        <a class="footer-item" data-key="call" href="tel:${PHONE_NUMBER}" aria-label="Call">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg><span>Call</span>
        </a>`;
      const text = `
        <a class="footer-item" data-key="text" href="sms:${PHONE_NUMBER}" aria-label="Text Us">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg><span>Text</span>
        </a>`;

      if (variant === 'book-first') {
        return `
          <div class="mobile-sticky-footer">
            <div class="footer-grid footer-grid--book-first">
              ${book}${call}${text}${calc}
            </div>
          </div>`;
      }
      if (variant === 'two-by-two') {
        return `
          <div class="mobile-sticky-footer">
            <div class="footer-grid footer-grid--two-by-two">
              ${book}${call}${text}${calc}
            </div>
          </div>`;
      }
      // default: book-center
      return `
        <div class="mobile-sticky-footer">
          <div class="footer-grid footer-grid--book-center">
            ${calc}${book}${call}${text}
          </div>
        </div>`;
    }

    function desktopButtonsTemplate(variant){
      const btnText = `
        <a href="sms:${PHONE_NUMBER}" class="floating-btn btn--text" aria-label="Text Us">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        </a>`;
      const btnCall = `
        <a href="tel:${PHONE_NUMBER}" class="floating-btn btn--call" aria-label="Call">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
        </a>`;
      const btnCalc = `
        <button class="floating-btn btn--calc" onclick="window.openCalculator()" aria-label="Open Calculator">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
        </button>`;
      const btnBook = `
        <a href="${BOOK_URL}" class="floating-btn primary btn--book" aria-label="Book Online">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </a>`;

      const cl = variant === 'calc-top' ? 'variant--calc-top'
               : variant === 'text-top' ? 'variant--text-top'
               : 'variant--book-top';

      return `
        <div class="desktop-floating-buttons ${cl}">
          ${btnText}${btnCall}${btnCalc}${btnBook}
        </div>`;
    }

    const calculatorModal = `
      <div class="calculator-modal" id="calculatorModal">
        <div class="calculator-content">
          <div class="calculator-header">
            <h3>Service Calculator</h3>
            <button class="close-btn" onclick="window.closeCalculator()">&times;</button>
          </div>

          <label style="display:block;margin-bottom:6px;color:#475569;font-size:14px;font-weight:600;">Vehicle Size:</label>
          <select class="vehicle-select" id="vehicleType" onchange="window.updatePrices()">
            <option value="small">Small (Sedan/Coupe/Hatchback)</option>
            <option value="medium">Medium (Small SUV/Crossover)</option>
            <option value="large">Large (Full-Size Truck/Large Sedan)</option>
            <option value="xl">XL (Full-Size SUV/Minivan)</option>
            <option value="xxl">XXL (Extended Van/RV)</option>
          </select>

          <h4 style="color:#22c55e;">💰 Bundle Packages (Save up to 40%)</h4>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="179" data-price-medium="209" data-price-large="249" data-price-xl="299" data-price-xxl="369" data-service="bundle" onchange="window.calculateTotal()">
              <span>Silver Package (Interior L1 + Exterior L1)</span>
              <span class="service-price">$179+</span>
            </label>
          </div>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="299" data-price-medium="349" data-price-large="399" data-price-xl="469" data-price-xxl="569" data-service="bundle" onchange="window.calculateTotal()">
              <span>Gold Package (Interior L2 + Exterior L2)</span>
              <span class="service-price">$299+</span>
            </label>
          </div>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="449" data-price-medium="519" data-price-large="599" data-price-xl="699" data-price-xxl="829" data-service="bundle" onchange="window.calculateTotal()">
              <span>Platinum Package (Interior L3 + Exterior L2)</span>
              <span class="service-price">$449+</span>
            </label>
          </div>

          <h4>Interior Services</h4>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="149" data-price-medium="169" data-price-large="199" data-price-xl="229" data-price-xxl="279" data-service="interior" onchange="window.calculateTotal()">
              <span>Level 1: Refresh & Clean</span>
              <span class="service-price">$149+</span>
            </label>
          </div>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="249" data-price-medium="279" data-price-large="319" data-price-xl="369" data-price-xxl="429" data-service="interior" onchange="window.calculateTotal()">
              <span>Level 2: Deep Clean & Restore</span>
              <span class="service-price">$249+</span>
            </label>
          </div>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="399" data-price-medium="449" data-price-large="509" data-price-xl="579" data-price-xxl="659" data-service="interior" onchange="window.calculateTotal()">
              <span>Level 3: Elite Transformation</span>
              <span class="service-price">$399+</span>
            </label>
          </div>

          <h4>Exterior Services</h4>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="99" data-price-medium="119" data-price-large="139" data-price-xl="159" data-price-xxl="189" data-service="exterior" onchange="window.calculateTotal()">
              <span>Level 1: Maintenance Wash</span>
              <span class="service-price">$99+</span>
            </label>
          </div>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="249" data-price-medium="279" data-price-large="319" data-price-xl="369" data-price-xxl="429" data-service="exterior" onchange="window.calculateTotal()">
              <span>Level 2: Deep Clean & Seal</span>
              <span class="service-price">$249+</span>
            </label>
          </div>

          <h4>🛠 Paint Correction</h4>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="499" data-price-medium="599" data-price-large="699" data-price-xl="849" data-price-xxl="999" onchange="window.calculateTotal()">
              <span>Enhancement Polish (70% correction)</span>
              <span class="service-price">$499+</span>
            </label>
          </div>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="799" data-price-medium="999" data-price-large="1199" data-price-xl="1399" data-price-xxl="1649" onchange="window.calculateTotal()">
              <span>Paint Correction (85% correction)</span>
              <span class="service-price">$799+</span>
            </label>
          </div>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="1199" data-price-medium="1499" data-price-large="1799" data-price-xl="2099" data-price-xxl="2499" onchange="window.calculateTotal()">
              <span>Show Car Finish (95% perfection)</span>
              <span class="service-price">$1199+</span>
            </label>
          </div>

          <h4>🛡️ Ceramic Coating</h4>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="899" data-price-medium="1099" data-price-large="1299" data-price-xl="1499" data-price-xxl="1799" onchange="window.calculateTotal()">
              <span>Essential - 3 Year Protection</span>
              <span class="service-price">$899+</span>
            </label>
          </div>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="1399" data-price-medium="1599" data-price-large="1899" data-price-xl="2199" data-price-xxl="2599" onchange="window.calculateTotal()">
              <span>Premium - 5+ Year Protection</span>
              <span class="service-price">$1399+</span>
            </label>
          </div>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="1999" data-price-medium="2299" data-price-large="2599" data-price-xl="2999" data-price-xxl="3499" onchange="window.calculateTotal()">
              <span>Elite - 7+ Year/Lifetime</span>
              <span class="service-price">$1999+</span>
            </label>
          </div>

          <h4>Window Tint</h4>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price="489" onchange="window.calculateTotal()">
              <span>4 Door Sedan - Ceramic Tint</span>
              <span class="service-price">$489</span>
            </label>
          </div>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price="589" onchange="window.calculateTotal()">
              <span>Truck - Ceramic Tint</span>
              <span class="service-price">$589</span>
            </label>
          </div>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price="689" onchange="window.calculateTotal()">
              <span>SUV - Ceramic Tint</span>
              <span class="service-price">$689</span>
            </label>
          </div>

          <h4>Add-Ons</h4>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price="59" onchange="window.calculateTotal()">
              <span>Engine Bay Detail</span>
              <span class="service-price">$59</span>
            </label>
          </div>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price="69" onchange="window.calculateTotal()">
              <span>Headlight Restoration</span>
              <span class="service-price">$69/pair</span>
            </label>
          </div>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price="39" onchange="window.calculateTotal()">
              <span>Pet Hair Removal</span>
              <span class="service-price">$39+</span>
            </label>
          </div>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price="99" onchange="window.calculateTotal()">
              <span>Carpet & Seat Shampoo</span>
              <span class="service-price">$99+</span>
            </label>
          </div>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price="89" onchange="window.calculateTotal()">
              <span>Ozone Odor Elimination</span>
              <span class="service-price">$89</span>
            </label>
          </div>

          <div class="total-section">
            <span>Estimated Total:</span>
            <span class="total-price" id="totalPrice">$0</span>
          </div>

          <p style="font-size:12px;color:#64748b;margin:12px 0;text-align:center;line-height:1.4;">
            *Prices shown for Small vehicles. Updates based on your selection.<br>
            PPF & specialty services available - call for quote.
          </p>

          <button class="cta-button" onclick="window.bookWithTotal()">📱 Text Me for Exact Quote</button>

          <div class="sms-notice">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Opens your text app with your selections</span>
          </div>
        </div>
      </div>
    `;

    // ======= INJECT MARKUP (once) =======
    document.body.insertAdjacentHTML('beforeend', mobileFooterTemplate(MOBILE_LAYOUT));
    document.body.insertAdjacentHTML('beforeend', desktopButtonsTemplate(DESKTOP_LAYOUT));
    document.body.insertAdjacentHTML('beforeend', calculatorModal);

    // ======= CALCULATOR LOGIC =======
    window.openCalculator = function () {
      const modal = document.getElementById('calculatorModal');
      if (!modal) return;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      window.updatePrices();
      // bind selection highlighting once
      document.querySelectorAll('.service-option input[type="checkbox"]').forEach(cb => {
        if (cb._shineBound) return;
        cb.addEventListener('change', function () {
          this.closest('.service-option')?.classList.toggle('selected', this.checked);
        });
        cb._shineBound = true;
      });
    };

    window.closeCalculator = function () {
      const modal = document.getElementById('calculatorModal');
      if (!modal) return;
      modal.classList.remove('active');
      document.body.style.overflow = '';
      // Reset selections
      document.querySelectorAll('.service-option input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
        cb.closest('.service-option').classList.remove('selected');
      });
      const totalEl = document.getElementById('totalPrice');
      if (totalEl) totalEl.textContent = '$0';
    };

    window.updatePrices = function () {
      const vehicleSize = document.getElementById('vehicleType')?.value || 'small';
      document.querySelectorAll('.service-option input[type="checkbox"]').forEach(cb => {
        const priceAttr = `data-price-${vehicleSize}`;
        const basePrice = cb.getAttribute(priceAttr) || cb.getAttribute('data-price');
        const priceSpan = cb.parentElement.querySelector('.service-price');
        if (!priceSpan || !basePrice) return;
        const labelText = cb.parentElement.textContent;
        if (cb.hasAttribute(priceAttr)) {
          priceSpan.textContent = '$' + basePrice + '+';
        } else if (labelText.includes('/pair')) {
          priceSpan.textContent = '$' + basePrice + '/pair';
        } else if (labelText.includes('+')) {
          priceSpan.textContent = '$' + basePrice + '+';
        } else {
          priceSpan.textContent = '$' + basePrice;
        }
      });
      window.calculateTotal();
    };

    window.calculateTotal = function () {
      const checked = document.querySelectorAll('.service-option input[type="checkbox"]:checked');
      const vehicleSize = document.getElementById('vehicleType')?.value || 'small';

      let total = 0;
      let hasBundle = false, hasInterior = false, hasExterior = false;

      checked.forEach(cb => {
        const type = cb.getAttribute('data-service');
        if (type === 'bundle') hasBundle = true;
        else if (type === 'interior') hasInterior = true;
        else if (type === 'exterior') hasExterior = true;
      });

      // Avoid double-counting interior/exterior when bundle chosen
      if (hasBundle && (hasInterior || hasExterior)) {
        document.querySelectorAll('.service-option input[data-service="interior"], .service-option input[data-service="exterior"]').forEach(cb => {
          cb.checked = false;
          cb.closest('.service-option').classList.remove('selected');
        });
      }

      document.querySelectorAll('.service-option input[type="checkbox"]:checked').forEach(cb => {
        const priceAttr = `data-price-${vehicleSize}`;
        const price = cb.getAttribute(priceAttr) || cb.getAttribute('data-price');
        if (price) total += parseFloat(price);
      });

      const discountMessage = total > 1000 ? ' (Ask about 15% multi-vehicle discount!)' : '';
      total = Math.round(total);
      const totalEl = document.getElementById('totalPrice');
      if (totalEl) totalEl.textContent = '$' + total.toLocaleString() + discountMessage;
    };

    window.bookWithTotal = function () {
      const total = document.getElementById('totalPrice')?.textContent || '$0';
      const vehicleTypeSelect = document.getElementById('vehicleType');
      const vehicleType = vehicleTypeSelect ? vehicleTypeSelect.options[vehicleTypeSelect.selectedIndex].text : 'Small (Sedan/Coupe/Hatchback)';
      const services = [];
      document.querySelectorAll('.service-option input[type="checkbox"]:checked').forEach(cb => {
        const serviceName = cb.parentElement.querySelector('span').textContent;
        services.push(serviceName);
      });

      if (!services.length) {
        alert('Please select at least one service');
        return;
      }

      let smsBody = '🚗 Quote Request from Website Calculator\n\n';
      smsBody += `Vehicle: ${vehicleType}\n\n`;
      smsBody += 'Services Selected:\n';
      services.forEach(s => { smsBody += `• ${s}\n`; });
      smsBody += `\nEstimated Total: ${total}\n\n`;
      smsBody += 'Please send me an exact quote for these services. Thanks!';

      const encodedBody = encodeURIComponent(smsBody);
      const ua = navigator.userAgent;
      const isiOS = /iPhone|iPad|iPod/i.test(ua);
      const isAndroid = /Android/i.test(ua);
      const isMobile = isiOS || isAndroid;

      if (isMobile) {
        // iOS uses ;body= — many Android devices accept ?body=
        const href = isiOS
          ? `sms:${PHONE_NUMBER};body=${encodedBody}`
          : `sms:${PHONE_NUMBER}?body=${encodedBody}`;
        window.location.href = href;
      } else {
        // Desktop fallback: copy to clipboard & prompt
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(smsBody).then(() => {
            alert('Your quote request has been copied to clipboard!\n\nPlease text it to: (480) 528-8227\n\nOr call us directly for immediate assistance.');
          }).catch(() => {
            prompt('Copy this message and text it to (480) 528-8227:', smsBody);
          });
        } else {
          prompt('Copy this message and text it to (480) 528-8227:', smsBody);
        }
      }
    };

    // Close modal on outside click
    document.getElementById('calculatorModal').addEventListener('click', function (e) {
      if (e.target === this) window.closeCalculator();
    });
    // ESC key closes modal
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.getElementById('calculatorModal').classList.contains('active')) {
        window.closeCalculator();
      }
    });
  }

  onReady(init);
})();
