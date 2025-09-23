// enhanced-action-buttons.js - Shine Design Mobile Detailing
// Modern floating action buttons with glassmorphic design and smooth animations
(function () {
  'use strict';

  function init() {
    // Prevent duplicate loading
    if (window.shineActionButtonsLoaded) return;
    window.shineActionButtonsLoaded = true;

    // Enhanced CSS with modern design
    const styles = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      
      * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      html, body {
        max-width: 100%;
        overflow-x: hidden;
      }

      @media(max-width:768px) {
        body {
          padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px)) !important;
        }

        .mobile-sticky-footer {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.08);
          z-index: 1100;
          display: block;
          animation: slideUpSmooth .4s cubic-bezier(0.34, 1.56, 0.64, 1);
          padding-bottom: env(safe-area-inset-bottom, 0px);
          border-top: 1px solid rgba(226, 232, 240, 0.5);
        }

        @keyframes slideUpSmooth {
          from {
            transform: translateY(120%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          padding: 8px;
        }

        .footer-item {
          position: relative;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
          padding: 12px 6px;
          text-align: center;
          cursor: pointer;
          transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          color: #0f172a;
          border: none;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          font-size: 11px;
          border-radius: 16px;
          margin: 4px;
          -webkit-tap-highlight-color: transparent;
          overflow: hidden;
        }

        .footer-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          opacity: 0;
          transition: opacity .3s ease;
          border-radius: 16px;
        }

        .footer-item.primary {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: white;
          transform: scale(1.05);
          box-shadow: 0 4px 20px rgba(14, 165, 233, 0.25);
        }

        .footer-item:active {
          transform: scale(0.95);
        }

        .footer-item.primary:active {
          transform: scale(0.98);
        }

        .footer-item svg {
          width: 24px;
          height: 24px;
          margin-bottom: 6px;
          color: #0ea5e9;
          position: relative;
          z-index: 1;
          transition: all .3s ease;
        }

        .footer-item.primary svg {
          color: white;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        .footer-item span {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #475569;
          line-height: 1.2;
          position: relative;
          z-index: 1;
          letter-spacing: -0.02em;
        }

        .footer-item.primary span {
          color: white;
          font-weight: 700;
        }

        .footer-item:hover:not(.primary)::before {
          opacity: 0.08;
        }

        .footer-item.pulse {
          animation: subtlePulse 2s infinite;
        }

        @keyframes subtlePulse {
          0%, 100% { transform: scale(1.05); }
          50% { transform: scale(1.08); }
        }

        .desktop-floating-buttons { display: none !important; }
      }

      @media(min-width:769px) {
        .mobile-sticky-footer { display: none !important; }
        
        .desktop-floating-buttons {
          position: fixed;
          bottom: 24px;
          right: 20px;
          z-index: 1100;
          display: flex;
          flex-direction: column-reverse;
          gap: 14px;
          animation: cascadeIn .6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes cascadeIn {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .floating-btn {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all .4s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          border: 1px solid rgba(226, 232, 240, 0.3);
          position: relative;
          overflow: hidden;
          animation: floatButton 3s ease-in-out infinite;
          animation-delay: calc(var(--index) * 0.1s);
        }

        .floating-btn:nth-child(1) { --index: 0; }
        .floating-btn:nth-child(2) { --index: 1; }
        .floating-btn:nth-child(3) { --index: 2; }
        .floating-btn:nth-child(4) { --index: 3; }

        @keyframes floatButton {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }

        .floating-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          opacity: 0;
          transition: opacity .3s ease;
          border-radius: 20px;
        }

        .floating-btn:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9);
          border-color: #0ea5e9;
        }

        .floating-btn:hover::before {
          opacity: 0.06;
        }

        .floating-btn svg {
          width: 28px;
          height: 28px;
          color: #0ea5e9;
          position: relative;
          z-index: 1;
          transition: all .3s ease;
        }

        .floating-btn:hover svg {
          transform: scale(1.1) rotate(5deg);
        }

        .floating-btn.primary {
          width: 76px;
          height: 76px;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          border: 2px solid rgba(255, 255, 255, 0.3);
          animation: primaryPulse 2.5s ease-in-out infinite;
        }

        @keyframes primaryPulse {
          0%, 100% {
            box-shadow: 0 8px 32px rgba(14, 165, 233, 0.4), 0 0 0 0 rgba(14, 165, 233, 0.4);
          }
          50% {
            box-shadow: 0 12px 40px rgba(14, 165, 233, 0.5), 0 0 0 12px rgba(14, 165, 233, 0);
          }
        }

        .floating-btn.primary svg {
          color: white;
          width: 34px;
          height: 34px;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
        }

        .floating-btn.primary:hover {
          transform: translateY(-6px) scale(1.08) rotate(-2deg);
          background: linear-gradient(135deg, #0284c7, #0369a1);
        }

        .tooltip {
          position: absolute;
          right: 80px;
          background: rgba(15, 23, 42, 0.95);
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity .3s ease;
          backdrop-filter: blur(12px);
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .floating-btn:hover .tooltip {
          opacity: 1;
        }
      }

      /* Enhanced Calculator Modal */
      .calculator-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 2000;
        animation: fadeIn .3s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .calculator-modal.active {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .calculator-content {
        background: white;
        border-radius: 24px;
        padding: 28px;
        width: 100%;
        max-width: 440px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUpCalc .4s cubic-bezier(0.34, 1.56, 0.64, 1);
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
      }

      @keyframes slideUpCalc {
        from {
          opacity: 0;
          transform: translateY(40px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .calculator-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 2px solid #f1f5f9;
      }

      .calculator-header h3 {
        color: #0f172a;
        font-size: 24px;
        margin: 0;
        font-weight: 700;
        background: linear-gradient(135deg, #0ea5e9, #0284c7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .close-btn {
        background: linear-gradient(145deg, #f8fafc, #e2e8f0);
        border: none;
        font-size: 24px;
        color: #64748b;
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 12px;
        transition: all .3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .close-btn:hover {
        background: linear-gradient(145deg, #e2e8f0, #cbd5e1);
        transform: rotate(90deg);
        color: #ef4444;
      }

      .vehicle-select {
        width: 100%;
        padding: 14px 16px;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        margin-bottom: 24px;
        font-size: 15px;
        background: white;
        color: #0f172a;
        font-weight: 500;
        cursor: pointer;
        transition: all .3s ease;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
      }

      .vehicle-select:hover {
        border-color: #0ea5e9;
        box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
      }

      .vehicle-select:focus {
        outline: none;
        border-color: #0ea5e9;
        box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
      }

      .calculator-content h4 {
        margin: 24px 0 12px;
        color: #475569;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: .8px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .calculator-content h4.bundle-header {
        color: #22c55e;
        font-size: 13px;
        background: linear-gradient(145deg, #f0fdf4, #dcfce7);
        padding: 8px 12px;
        border-radius: 8px;
        margin-top: 20px;
      }

      .service-option {
        padding: 0;
        margin-bottom: 8px;
        border: 2px solid transparent;
        border-radius: 12px;
        cursor: pointer;
        transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
        background: linear-gradient(145deg, #f8fafc, #f1f5f9);
        position: relative;
        overflow: hidden;
      }

      .service-option::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #0ea5e9, #0284c7);
        opacity: 0;
        transition: opacity .3s ease;
      }

      .service-option:hover {
        border-color: #0ea5e9;
        transform: translateX(4px);
        box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
      }

      .service-option.selected {
        border-color: #0ea5e9;
        background: linear-gradient(145deg, #f0f9ff, #e0f2fe);
        box-shadow: 0 4px 16px rgba(14, 165, 233, 0.2);
      }

      .service-option.selected::before {
        opacity: 0.05;
      }

      .service-option label {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 14px;
        color: #0f172a;
        margin: 0;
        padding: 14px;
        position: relative;
        z-index: 1;
        font-weight: 500;
      }

      .service-option input[type="checkbox"] {
        margin-right: 12px;
        width: 20px;
        height: 20px;
        cursor: pointer;
        accent-color: #0ea5e9;
      }

      .service-price {
        margin-left: auto;
        color: #0ea5e9;
        font-weight: 700;
        font-size: 15px;
        padding-left: 12px;
      }

      .total-section {
        margin-top: 24px;
        padding: 20px;
        background: linear-gradient(135deg, #0ea5e9, #0284c7);
        border-radius: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 8px 24px rgba(14, 165, 233, 0.25);
      }

      .total-section span:first-child {
        font-size: 16px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
      }

      .total-price {
        color: white;
        font-size: 32px;
        font-weight: 700;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }

      .cta-button {
        width: 100%;
        padding: 16px;
        background: linear-gradient(135deg, #0ea5e9, #0284c7);
        color: white;
        border: none;
        border-radius: 999px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        margin-top: 24px;
        transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 8px 24px rgba(14, 165, 233, 0.3);
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        letter-spacing: -0.02em;
        position: relative;
        overflow: hidden;
      }

      .cta-button::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        transition: width .4s ease, height .4s ease;
      }

      .cta-button:hover {
        background: linear-gradient(135deg, #0284c7, #0369a1);
        transform: translateY(-2px);
        box-shadow: 0 12px 32px rgba(14, 165, 233, 0.4);
      }

      .cta-button:hover::before {
        width: 300px;
        height: 300px;
      }

      .cta-button:active {
        transform: scale(0.98);
      }

      .sms-notice {
        font-size: 13px;
        color: #64748b;
        text-align: center;
        margin-top: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 8px;
        background: #f8fafc;
        border-radius: 8px;
      }

      .sms-notice svg {
        width: 16px;
        height: 16px;
        color: #94a3b8;
      }

      /* Smooth scrollbar for calculator */
      .calculator-content::-webkit-scrollbar {
        width: 6px;
      }

      .calculator-content::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 3px;
      }

      .calculator-content::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #0ea5e9, #0284c7);
        border-radius: 3px;
      }

      /* Loading animation for button states */
      @keyframes shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }

      .loading {
        background: linear-gradient(90deg, #0ea5e9 25%, #0284c7 50%, #0ea5e9 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Enhanced Mobile Footer
    const mobileFooter = `
      <div class="mobile-sticky-footer">
        <div class="footer-grid">
          <button class="footer-item" onclick="window.openCalculator()" aria-label="Service Calculator">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            <span>Calculator</span>
          </button>
          <a href="https://booknow.shinedesignauto.com/" class="footer-item primary pulse" aria-label="Book Online">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span>Book Now</span>
          </a>
          <a href="tel:+14805288227" class="footer-item" aria-label="Call">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            <span>Call</span>
          </a>
          <a href="sms:+14805288227" class="footer-item" aria-label="Text Us">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <span>Text</span>
          </a>
        </div>
      </div>
    `;

    // Enhanced Desktop Floating Buttons with Tooltips
    const desktopButtons = `
      <div class="desktop-floating-buttons">
        <a href="sms:+14805288227" class="floating-btn" aria-label="Text Us">
          <span class="tooltip">Text Us</span>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        </a>
        <a href="tel:+14805288227" class="floating-btn" aria-label="Call">
          <span class="tooltip">Call Now</span>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
        </a>
        <button class="floating-btn" onclick="window.openCalculator()" aria-label="Open Calculator">
          <span class="tooltip">Price Calculator</span>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
        </button>
        <a href="https://booknow.shinedesignauto.com/" class="floating-btn primary" aria-label="Book Online">
          <span class="tooltip">Book Online</span>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </a>
      </div>
    `;

    // Enhanced Calculator Modal with all services
    const calculatorModal = `
      <div class="calculator-modal" id="calculatorModal">
        <div class="calculator-content">
          <div class="calculator-header">
            <h3>✨ Service Calculator</h3>
            <button class="close-btn" onclick="window.closeCalculator()">✕</button>
          </div>

          <label style="display:block;margin-bottom:8px;color:#475569;font-size:14px;font-weight:600;">Vehicle Size:</label>
          <select class="vehicle-select" id="vehicleType" onchange="window.updatePrices()">
            <option value="small">🚗 Small (Sedan/Coupe/Hatchback)</option>
            <option value="medium">🚙 Medium (Small SUV/Crossover)</option>
            <option value="large">🚚 Large (Full-Size Truck/Large Sedan)</option>
            <option value="xl">🚐 XL (Full-Size SUV/Minivan)</option>
            <option value="xxl">🚌 XXL (Extended Van/RV)</option>
          </select>

          <h4 class="bundle-header">💰 Bundle Packages (Save up to 40%)</h4>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="179" data-price-medium="209" data-price-large="249" data-price-xl="299" data-price-xxl="369" data-service="bundle" onchange="window.calculateTotal()">
              <span>Silver Package (Interior L1 + Exterior L1)</span>
              <span class="service-price">$179</span>
            </label>
          </div>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="299" data-price-medium="349" data-price-large="399" data-price-xl="469" data-price-xxl="569" data-service="bundle" onchange="window.calculateTotal()">
              <span>Gold Package (Interior L2 + Exterior L2)</span>
              <span class="service-price">$299</span>
            </label>
          </div>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="449" data-price-medium="519" data-price-large="599" data-price-xl="699" data-price-xxl="829" data-service="bundle" onchange="window.calculateTotal()">
              <span>Platinum Package (Interior L3 + Exterior L2)</span>
              <span class="service-price">$449</span>
            </label>
          </div>

          <h4>🧹 Interior Services</h4>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="149" data-price-medium="169" data-price-large="199" data-price-xl="229" data-price-xxl="279" data-service="interior" onchange="window.calculateTotal()">
              <span>Level 1: Refresh & Clean</span>
              <span class="service-price">$149</span>
            </label>
          </div>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="249" data-price-medium="279" data-price-large="319" data-price-xl="369" data-price-xxl="429" data-service="interior" onchange="window.calculateTotal()">
              <span>Level 2: Deep Clean & Restore</span>
              <span class="service-price">$249</span>
            </label>
          </div>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="399" data-price-medium="449" data-price-large="509" data-price-xl="579" data-price-xxl="659" data-service="interior" onchange="window.calculateTotal()">
              <span>Level 3: Elite Transformation</span>
              <span class="service-price">$399</span>
            </label>
          </div>

          <h4>✨ Exterior Services</h4>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="99" data-price-medium="119" data-price-large="139" data-price-xl="159" data-price-xxl="189" data-service="exterior" onchange="window.calculateTotal()">
              <span>Level 1: Maintenance Wash</span>
              <span class="service-price">$99</span>
            </label>
          </div>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="249" data-price-medium="279" data-price-large="319" data-price-xl="369" data-price-xxl="429" data-service="exterior" onchange="window.calculateTotal()">
              <span>Level 2: Deep Clean & Seal</span>
              <span class="service-price">$249</span>
            </label>
          </div>

          <h4>🛠 Paint Correction</h4>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="499" data-price-medium="599" data-price-large="699" data-price-xl="849" data-price-xxl="999" onchange="window.calculateTotal()">
              <span>Enhancement Polish (70% correction)</span>
              <span class="service-price">$499</span>
            </label>
          </div>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="799" data-price-medium="999" data-price-large="1199" data-price-xl="1399" data-price-xxl="1649" onchange="window.calculateTotal()">
              <span>Paint Correction (85% correction)</span>
              <span class="service-price">$799</span>
            </label>
          </div>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="1199" data-price-medium="1499" data-price-large="1799" data-price-xl="2099" data-price-xxl="2499" onchange="window.calculateTotal()">
              <span>Show Car Finish (95% perfection)</span>
              <span class="service-price">$1199</span>
            </label>
          </div>

          <h4>🛡️ Ceramic Coating</h4>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="899" data-price-medium="1099" data-price-large="1299" data-price-xl="1499" data-price-xxl="1799" onchange="window.calculateTotal()">
              <span>Essential - 3 Year Protection</span>
              <span class="service-price">$899</span>
            </label>
          </div>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="1399" data-price-medium="1599" data-price-large="1899" data-price-xl="2199" data-price-xxl="2599" onchange="window.calculateTotal()">
              <span>Premium - 5+ Year Protection</span>
              <span class="service-price">$1399</span>
            </label>
          </div>
          <div class="service-option">
            <label>
              <input type="checkbox" data-price-small="1999" data-price-medium="2299" data-price-large="2599" data-price-xl="2999" data-price-xxl="3499" onchange="window.calculateTotal()">
              <span>Elite - 7+ Year/Lifetime</span>
              <span class="service-price">$1999</span>
            </label>
          </div>

          <h4>🎨 Window Tint</h4>
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

          <h4>➕ Add-Ons</h4>
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
            📱 Get Exact Quote via Text
          </button>

          <div class="sms-notice">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Opens your messages with selections</span>
          </div>
        </div>
      </div>
    `;

    // Add elements to page
    document.body.insertAdjacentHTML('beforeend', mobileFooter);
    document.body.insertAdjacentHTML('beforeend', desktopButtons);
    document.body.insertAdjacentHTML('beforeend', calculatorModal);

    // Enhanced Calculator Functions
    window.openCalculator = function () {
      const modal = document.getElementById('calculatorModal');
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      window.updatePrices();
    };

    window.closeCalculator = function () {
      const modal = document.getElementById('calculatorModal');
      modal.classList.remove('active');
      document.body.style.overflow = '';
      // Clear selections with animation
      document.querySelectorAll('.service-option').forEach((option, index) => {
        setTimeout(() => {
          const checkbox = option.querySelector('input[type="checkbox"]');
          if (checkbox) {
            checkbox.checked = false;
            option.classList.remove('selected');
          }
        }, index * 30);
      });
      setTimeout(() => {
        document.getElementById('totalPrice').textContent = '$0';
      }, 300);
    };

    window.updatePrices = function () {
      const vehicleSize = document.getElementById('vehicleType').value;

      document.querySelectorAll('.service-option input[type="checkbox"]').forEach(checkbox => {
        const priceAttr = `data-price-${vehicleSize}`;
        const basePrice = checkbox.getAttribute(priceAttr) || checkbox.getAttribute('data-price');
        if (!basePrice) return;

        const priceSpan = checkbox.parentElement.querySelector('.service-price');
        if (!priceSpan) return;

        // Animate price change
        priceSpan.style.transition = 'all .3s ease';
        priceSpan.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
          const labelText = checkbox.parentElement.textContent;
          if (checkbox.hasAttribute(priceAttr)) {
            priceSpan.textContent = '$' + basePrice;
          } else if (labelText.includes('/pair')) {
            priceSpan.textContent = '$' + basePrice + '/pair';
          } else if (labelText.includes('+')) {
            priceSpan.textContent = '$' + basePrice + '+';
          } else {
            priceSpan.textContent = '$' + basePrice;
          }
          priceSpan.style.transform = 'scale(1)';
        }, 150);
      });

      window.calculateTotal();
    };

    window.calculateTotal = function () {
      const checked = document.querySelectorAll('.service-option input[type="checkbox"]:checked');
      const vehicleSize = document.getElementById('vehicleType').value;

      let total = 0;
      let hasBundle = false, hasInterior = false, hasExterior = false;

      checked.forEach(cb => {
        const type = cb.getAttribute('data-service');
        if (type === 'bundle') hasBundle = true;
        else if (type === 'interior') hasInterior = true;
        else if (type === 'exterior') hasExterior = true;
      });

      // Auto-uncheck conflicting options with animation
      if (hasBundle && (hasInterior || hasExterior)) {
        document.querySelectorAll('.service-option input[data-service="interior"], .service-option input[data-service="exterior"]').forEach(cb => {
          if (cb.checked) {
            cb.checked = false;
            cb.closest('.service-option').classList.remove('selected');
          }
        });
      }

      document.querySelectorAll('.service-option input[type="checkbox"]:checked').forEach(cb => {
        const priceAttr = `data-price-${vehicleSize}`;
        const price = cb.getAttribute(priceAttr) || cb.getAttribute('data-price');
        if (price) total += parseFloat(price);
      });

      // Animate total update
      const totalElement = document.getElementById('totalPrice');
      totalElement.style.transition = 'all .3s ease';
      totalElement.style.transform = 'scale(1.1)';
      
      const discountMessage = total > 1000 ? ' ✨' : '';
      totalElement.textContent = '$' + total.toLocaleString() + discountMessage;
      
      setTimeout(() => {
        totalElement.style.transform = 'scale(1)';
      }, 200);
    };

    window.bookWithTotal = function () {
      const vehicleTypeEl = document.getElementById('vehicleType');
      const vehicleKey = vehicleTypeEl.value;
      const vehicleLabel = vehicleTypeEl.options[vehicleTypeEl.selectedIndex].text;

      const checked = Array.from(document.querySelectorAll('.service-option input[type="checkbox"]:checked'));
      if (checked.length === 0) {
        alert('Please select at least one service');
        return;
      }

      let subtotal = 0;
      const lines = checked.map(cb => {
        const priceAttr = `data-price-${vehicleKey}`;
        const raw = cb.getAttribute(priceAttr) || cb.getAttribute('data-price') || '0';
        const priceNum = parseFloat(raw);
        subtotal += isNaN(priceNum) ? 0 : priceNum;

        const lbl = cb.parentElement.querySelector('span');
        const name = lbl ? lbl.textContent.trim() : 'Service';

        return `• ${name} — $${priceNum.toLocaleString()}`;
      });

      const discountHint = subtotal > 1000 ? ' (Ask about 15% multi-vehicle discount!)' : '';
      const totalStr = `$${Math.round(subtotal).toLocaleString()}${discountHint}`;

      let smsBody = [
        '🚗 Shine Design — Quote Request',
        '',
        `Vehicle: ${vehicleLabel}`,
        '',
        'Services Selected:',
        ...lines,
        '',
        `Estimated Total: ${totalStr}`,
        '',
        'Please text me an exact quote for these selections. Thanks!'
      ].join('\n');

      const encoded = encodeURIComponent(smsBody);
      const phoneNumber = '+14805288227';
      const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      const smsHref = isiOS ? `sms:${phoneNumber}&body=${encoded}` : `sms:${phoneNumber}?body=${encoded}`;

      window.location.href = smsHref;

      // Fallback for desktop
      setTimeout(() => {
        if (!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(smsBody).then(() => {
              alert('Message copied to clipboard! Please text it to 480-528-8227');
            }).catch(() => {
              prompt('Copy this message and text it to 480-528-8227:', smsBody);
            });
          } else {
            prompt('Copy this message and text it to 480-528-8227:', smsBody);
          }
        }
      }, 500);
    };

    // Enhanced checkbox selection
    document.querySelectorAll('.service-option input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', function () {
        const option = this.closest('.service-option');
        if (this.checked) {
          option.classList.add('selected');
          // Animate selection
          option.style.transform = 'scale(1.02)';
          setTimeout(() => {
            option.style.transform = '';
          }, 200);
        } else {
          option.classList.remove('selected');
        }
      });
    });

    // Close modal on outside click
    document.getElementById('calculatorModal').addEventListener('click', function (e) {
      if (e.target === this) window.closeCalculator();
    });

    // ESC key to close
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.getElementById('calculatorModal').classList.contains('active')) {
        window.closeCalculator();
      }
    });

    // Add subtle animation to primary CTA on desktop
    if (window.innerWidth > 768) {
      setInterval(() => {
        const primaryBtn = document.querySelector('.floating-btn.primary');
        if (primaryBtn) {
          primaryBtn.style.transform = 'scale(1.05)';
          setTimeout(() => {
            primaryBtn.style.transform = '';
          }, 300);
        }
      }, 5000);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();