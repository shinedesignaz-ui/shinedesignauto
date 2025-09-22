// action-buttons.js - Shine Design Mobile Detailing
// Floating buttons for desktop, sticky footer for mobile, with service calculator
(function() {
  'use strict';
  
  // Prevent duplicate loading
  if (window.shineActionButtonsLoaded) return;
  window.shineActionButtonsLoaded = true;

  // Inject minified CSS (original, with ONLY the safe-area additions)
  const styles = `
    @media(max-width:768px){
      body{padding-bottom:calc(80px + env(safe-area-inset-bottom, 0px))!important}
      .mobile-sticky-footer{
        position:fixed;bottom:0;left:0;right:0;background:#fff;box-shadow:0 -4px 20px rgba(0,0,0,.1);z-index:1000;display:block;animation:slideUp .3s ease-out;
        padding-bottom:env(safe-area-inset-bottom, 8px);
      }
    }
    @media(max-width:768px){
      @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
      .footer-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#e2e8f0}
      .footer-item{background:#fff;padding:10px 5px;text-align:center;cursor:pointer;transition:all .3s;text-decoration:none;color:#0f172a;border:none;font-family:inherit;font-size:11px}
      .footer-item:active{transform:scale(.95);background:#f1f5f9}
      .footer-item svg{width:24px;height:24px;margin-bottom:4px;color:#0ea5e9}
      .footer-item span{display:block;font-size:11px;font-weight:600;color:#475569;line-height:1.2}
      .desktop-floating-buttons{display:none!important}
    }
    @media(min-width:769px){.mobile-sticky-footer{display:none!important}.desktop-floating-buttons{position:fixed;bottom:30px;right:30px;z-index:1000;display:flex;flex-direction:column-reverse;gap:12px;animation:fadeInUp .5s ease-out}@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.floating-btn{width:60px;height:60px;border-radius:50%;background:#fff;box-shadow:0 4px 20px rgba(0,0,0,.15);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .3s;text-decoration:none;border:2px solid transparent}.floating-btn:hover{transform:scale(1.1);box-shadow:0 6px 30px rgba(0,0,0,.2);border-color:#0ea5e9}.floating-btn svg{width:28px;height:28px;color:#0ea5e9}.floating-btn.primary{width:70px;height:70px;background:linear-gradient(135deg,#0ea5e9,#0284c7);animation:pulse 2s infinite}@keyframes pulse{0%,100%{box-shadow:0 4px 20px rgba(14,165,233,.4)}50%{box-shadow:0 4px 30px rgba(14,165,233,.6)}}.floating-btn.primary svg{color:#fff;width:32px;height:32px}}
    .calculator-modal{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);z-index:2000}.calculator-modal.active{display:flex;align-items:center;justify-content:center;padding:20px}.calculator-content{background:#fff;border-radius:20px;padding:24px;width:100%;max-width:400px;max-height:90vh;overflow-y:auto}.calculator-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}.calculator-header h3{color:#0f172a;font-size:20px;margin:0}.close-btn{background:none;border:none;font-size:28px;color:#64748b;cursor:pointer;padding:0;width:32px;height:32px;border-radius:50%;transition:background .2s}.close-btn:hover{background:#f1f5f9}.service-option{padding:12px;margin-bottom:10px;border:2px solid #e2e8f0;border-radius:12px;cursor:pointer;transition:all .2s}.service-option:hover{border-color:#0ea5e9;background:#f0f9ff}.service-option.selected{border-color:#0ea5e9;background:#f0f9ff}.service-option label{display:flex;align-items:center;cursor:pointer;font-size:14px;color:#0f172a;margin:0}.service-option input[type="checkbox"]{margin-right:10px}.service-price{margin-left:auto;color:#0ea5e9;font-weight:600}.vehicle-select{width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:12px;margin-bottom:20px;font-size:14px;background:#fff}.calculator-content h4{margin:16px 0 8px;color:#475569;font-size:13px;text-transform:uppercase;letter-spacing:.5px;font-weight:600}.total-section{margin-top:20px;padding-top:20px;border-top:2px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;font-size:18px;font-weight:700;color:#0f172a}.total-price{color:#0ea5e9;font-size:24px}.cta-button{width:100%;padding:14px;background:linear-gradient(135deg,#0ea5e9,#0284c7);color:#fff;border:none;border-radius:999px;font-size:16px;font-weight:700;cursor:pointer;margin-top:20px;transition:all .2s}.cta-button:hover{background:linear-gradient(135deg,#0284c7,#0369a1);transform:translateY(-2px);box-shadow:0 4px 20px rgba(14,165,233,.3)}.cta-button:active{transform:scale(.98)}
    .sms-notice{font-size:12px;color:#64748b;text-align:center;margin-top:10px;display:flex;align-items:center;justify-content:center;gap:6px}.sms-notice svg{width:16px;height:16px}
  `;

  // Add styles to page
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // Mobile Footer HTML
  const mobileFooter = `
    <div class="mobile-sticky-footer">
      <div class="footer-grid">
        <button class="footer-item" onclick="window.openCalculator()" aria-label="Service Calculator">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
          <span>Calculator</span>
        </button>
        <a href="https://booknow.shinedesignaz.com/" class="footer-item">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <span>Book</span>
        </a>
        <a href="tel:+14805288227" class="footer-item">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
          <span>Call</span>
        </a>
        <a href="sms:+14805288227" class="footer-item">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          <span>Text</span>
        </a>
      </div>
    </div>
  `;

  // Desktop Floating Buttons HTML
  const desktopButtons = `
    <div class="desktop-floating-buttons">
      <a href="sms:+14805288227" class="floating-btn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
      </a>
      <a href="tel:+14805288227" class="floating-btn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
        </svg>
      </a>
      <button class="floating-btn" onclick="window.openCalculator()">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
      </button>
      <a href="https://booknow.shinedesignaz.com/" class="floating-btn primary">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      </a>
    </div>
  `;

  // Calculator Modal HTML with your exact pricing
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

        <button class="cta-button" onclick="window.bookWithTotal()">
          📱 Text Me for Exact Quote
        </button>
        
        <div class="sms-notice">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 0 0118 0z"></path>
          </svg>
          <span>Opens your text app with your selections</span>
        </div>
      </div>
    </div>
  `;

  // Add elements to page
  document.body.insertAdjacentHTML('beforeend', mobileFooter);
  document.body.insertAdjacentHTML('beforeend', desktopButtons);
  document.body.insertAdjacentHTML('beforeend', calculatorModal);

  // Calculator Functions
  window.openCalculator = function() {
    document.getElementById('calculatorModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    window.updatePrices();
  };

  window.closeCalculator = function() {
    document.getElementById('calculatorModal').classList.remove('active');
    document.body.style.overflow = '';
    // Clear selections
    document.querySelectorAll('.service-option input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = false;
      checkbox.closest('.service-option').classList.remove('selected');
    });
    document.getElementById('totalPrice').textContent = '$0';
  };

  window.updatePrices = function() {
    const vehicleSize = document.getElementById('vehicleType').value;
    
    document.querySelectorAll('.service-option input[type="checkbox"]').forEach(checkbox => {
      const priceAttr = `data-price-${vehicleSize}`;
      const basePrice = checkbox.getAttribute(priceAttr) || checkbox.getAttribute('data-price');
      
      if (basePrice) {
        const priceSpan = checkbox.parentElement.querySelector('.service-price');
        if (priceSpan) {
          if (checkbox.hasAttribute(priceAttr)) {
            priceSpan.textContent = '$' + basePrice + '+';
          } else {
            const originalText = checkbox.parentElement.textContent;
            if (originalText.includes('/pair')) {
              priceSpan.textContent = '$' + basePrice + '/pair';
            } else if (originalText.includes('+')) {
              priceSpan.textContent = '$' + basePrice + '+';
            } else {
              priceSpan.textContent = '$' + basePrice;
            }
          }
        }
      }
    });
    
    window.calculateTotal();
  };

  window.calculateTotal = function() {
    const checkboxes = document.querySelectorAll('.service-option input[type="checkbox"]:checked');
    const vehicleSize = document.getElementById('vehicleType').value;
    
    let total = 0;
    let hasBundle = false;
    let hasInterior = false;
    let hasExterior = false;
    
    checkboxes.forEach(checkbox => {
      const serviceType = checkbox.getAttribute('data-service');
      if (serviceType === 'bundle') hasBundle = true;
      else if (serviceType === 'interior') hasInterior = true;
      else if (serviceType === 'exterior') hasExterior = true;
    });
    
    if (hasBundle && (hasInterior || hasExterior)) {
      document.querySelectorAll('.service-option input[data-service="interior"], .service-option input[data-service="exterior"]').forEach(cb => {
        cb.checked = false;
        cb.closest('.service-option').classList.remove('selected');
      });
    }
    
    document.querySelectorAll('.service-option input[type="checkbox"]:checked').forEach(checkbox => {
      const priceAttr = `data-price-${vehicleSize}`;
      const price = checkbox.getAttribute(priceAttr) || checkbox.getAttribute('data-price');
      if (price) total += parseFloat(price);
    });
    
    let discountMessage = total > 1000 ? ' (Ask about 15% multi-vehicle discount!)' : '';
    total = Math.round(total);
    document.getElementById('totalPrice').textContent = '$' + total.toLocaleString() + discountMessage;
  };

  window.bookWithTotal = function() {
    const total = document.getElementById('totalPrice').textContent;
    const services = [];
    const vehicleTypeSelect = document.getElementById('vehicleType');
    const vehicleType = vehicleTypeSelect.options[vehicleTypeSelect.selectedIndex].text;
    
    // Collect all selected services
    document.querySelectorAll('.service-option input[type="checkbox"]:checked').forEach(checkbox => {
      const serviceName = checkbox.parentElement.querySelector('span').textContent;
      services.push(serviceName);
    });
    
    if (services.length === 0) {
      alert('Please select at least one service');
      return;
    }
    
    // Create the SMS message
    let smsBody = '🚗 Quote Request from Website Calculator\n\n';
    smsBody += `Vehicle: ${vehicleType}\n\n`;
    smsBody += 'Services Selected:\n';
    services.forEach(service => {
      smsBody += `• ${service}\n`;
    });
    smsBody += `\nEstimated Total: ${total}\n\n`;
    smsBody += 'Please send me an exact quote for these services. Thanks!';
    
    // Encode the message for SMS URL (using encodeURIComponent to handle special characters)
    const encodedBody = encodeURIComponent(smsBody);
    
    // Create the SMS URL - format varies by device
    // For iOS: sms:+14805288227&body=...
    // For Android: sms:+14805288227?body=...
    // Using the iOS format with fallback handling
    const phoneNumber = '+14805288227';
    
    // Detect if mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // For mobile devices, use the sms: protocol
      // Try iOS format first, Android will handle it correctly too
      window.location.href = `sms:${phoneNumber}&body=${encodedBody}`;
    } else {
      // For desktop, we'll create a copyable text message
      const message = `To: ${phoneNumber}\n\n${smsBody}`;
      
      // Try to copy to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(smsBody).then(() => {
          alert(`Your quote request has been copied to clipboard!\n\nPlease text it to: (480) 528-8227\n\nOr call us directly for immediate assistance.`);
        }).catch(() => {
          // Fallback if clipboard fails
          prompt('Copy this message and text it to (480) 528-8227:', smsBody);
        });
      } else {
        // Fallback for older browsers
        prompt('Copy this message and text it to (480) 528-8227:', smsBody);
      }
    }
  };

  // Handle checkbox selection highlighting
  document.querySelectorAll('.service-option input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        this.closest('.service-option').classList.add('selected');
      } else {
        this.closest('.service-option').classList.remove('selected');
      }
    });
  });

  // Close modal on outside click
  document.getElementById('calculatorModal').addEventListener('click', function(e) {
    if (e.target === this) {
      window.closeCalculator();
    }
  });

  // ESC key to close calculator
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('calculatorModal').classList.contains('active')) {
      window.closeCalculator();
    }
  });

})();
