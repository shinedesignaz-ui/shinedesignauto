// action-buttons.js — Shine Design Mobile Detailing
// Floating buttons for desktop + sticky action footer for mobile, with a lightweight quote calculator.
// IMPORTANT: class names are fully namespaced to avoid colliding with page styles.

(function () {
  'use strict';

  // Prevent duplicate loading
  if (window.shineActionButtonsLoaded) return;
  window.shineActionButtonsLoaded = true;

  // ======= Config (edit as needed) =======
  var BRAND = '#0ea5e9';
  var PHONE = '+14805288227';
  var SMS = '+14805288227';
  var BOOK_URL = 'https://booknow.shinedesignaz.com/';

  // ======= Styles (scoped, namespaced) =======
  var styles = `
  :root{--sd-brand:${BRAND};--sd-brand-dark:#0284c7}
  @media(max-width:768px){
    body{padding-bottom:80px!important}
    .mobile-sticky-footer.sd-mobile-bar{
      position:fixed;left:0;right:0;bottom:0;
      background:#fff;
      box-shadow:0 -4px 20px rgba(0,0,0,.1);
      z-index:1100;
      display:block;
      animation:sd-slideUp .25s ease-out;
      padding-bottom:env(safe-area-inset-bottom,0px);
      -webkit-transform:translateZ(0);transform:translateZ(0);
    }
    @keyframes sd-slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
    .sd-footer-grid{
      display:grid;
      grid-template-columns:repeat(4,1fr);
      gap:1px;
      background:#e2e8f0; /* separator lines */
    }
    .sd-footer-item{
      background:#fff;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      gap:4px;
      padding:10px 6px 12px;
      font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
      font-size:12px;
      font-weight:700;
      color:#0f172a;
      text-align:center;
      text-decoration:none;
      cursor:pointer;
      transition:all .25s ease;
      border:none;
      -webkit-tap-highlight-color:transparent;
    }
    .sd-footer-item:active{transform:scale(.96);background:#f8fafc}
    .sd-footer-item svg{width:24px;height:24px;margin-bottom:2px;color:var(--sd-brand)}
    .sd-footer-item .sd-label{line-height:1.1}
  }

  /* Desktop FABs */
  @media(min-width:769px){
    .sd-desktop-floating-buttons{
      position:fixed;bottom:30px;right:30px;z-index:1100;
      display:flex;flex-direction:column-reverse;gap:12px;
      animation:sd-fadeInUp .3s ease-out;
    }
    @keyframes sd-fadeInUp{from{opacity:.001;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    .sd-fab{
      display:inline-flex;align-items:center;gap:10px;
      padding:12px 14px;border-radius:999px;border:1px solid #e2e8f0;
      background:#fff;color:#0f172a;text-decoration:none;font-weight:700;
      box-shadow:0 10px 30px rgba(0,0,0,.06);
      transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease;
    }
    .sd-fab:hover{transform:translateY(-2px);box-shadow:0 14px 38px rgba(0,0,0,.12);border-color:var(--sd-brand)}
    .sd-fab svg{width:20px;height:20px;color:var(--sd-brand)}
  }

  /* Calculator Modal */
  .sd-calc-modal{
    position:fixed;inset:0;z-index:1200;display:none;
    background:rgba(15,23,42,.6);backdrop-filter:saturate(140%) blur(6px);
  }
  .sd-calc-modal.active{display:block;animation:sd-fadeIn .2s ease}
  @keyframes sd-fadeIn{from{opacity:0}to{opacity:1}}
  .sd-calc-dialog{
    position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
    width:min(720px,92vw);max-height:86vh;overflow:auto;
    background:#fff;border-radius:16px;box-shadow:0 24px 80px rgba(0,0,0,.2);
    padding:18px;
  }
  .sd-calc-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
  .sd-calc-title{font-weight:800;font-size:18px;color:#0f172a}
  .sd-calc-close{border:none;background:transparent;font-size:22px;cursor:pointer}
  .sd-calc-body{display:grid;gap:12px}
  .sd-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  @media(max-width:520px){.sd-row{grid-template-columns:1fr}}
  .sd-field{display:grid;gap:6px}
  .sd-field label{font-size:12px;color:#475569;font-weight:700}
  .sd-field select,.sd-field input{
    padding:10px 12px;border:1px solid #e2e8f0;border-radius:10px;font:inherit
  }
  .sd-total{display:flex;align-items:center;justify-content:space-between;border-top:1px solid #e2e8f0;margin-top:8px;padding-top:12px}
  .sd-total .price{font-weight:800;font-size:22px;color:var(--sd-brand)}
  .sd-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:8px}
  .sd-btn{
    appearance:none;border:none;border-radius:999px;padding:12px 16px;font-weight:800;cursor:pointer;
  }
  .sd-btn.primary{background:var(--sd-brand);color:#fff}
  .sd-btn.alt{background:#e2e8f0}
  `;

  var styleEl = document.createElement('style');
  styleEl.id = 'sd-action-buttons-styles';
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // ======= Helpers =======
  function svg(pathD) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('stroke-linecap', 'round');
    p.setAttribute('stroke-linejoin', 'round');
    p.setAttribute('d', pathD);
    svg.appendChild(p);
    return svg;
  }
  function el(tag, cls, html){
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  // ======= Mobile Sticky Footer =======
  var mobile = el('div', 'mobile-sticky-footer sd-mobile-bar');
  var grid = el('div', 'sd-footer-grid');

  function item(type, href, label, iconD){
    var node = (type === 'a') ? el('a', 'sd-footer-item') : el('button', 'sd-footer-item');
    if (type === 'a') node.href = href;
    if (type === 'a' && href && href.indexOf('http') === 0) { node.rel = 'noopener'; node.target = '_blank'; }
    node.appendChild(svg(iconD));
    var span = el('span', 'sd-label', label);
    node.appendChild(span);
    return node;
  }

  // Icons (Heroicons)
  var calcD = 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 7v.01M9 7h.01M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z';
  var bookD = 'M4 19.5A2.5 2.5 0 016.5 17H20M4 4v15.5M6.5 17A2.5 2.5 0 014 19.5M6.5 17H20V4H6.5A2.5 2.5 0 004 6.5';
  var phoneD = 'M2 5a2 2 0 012-2h1.28a2 2 0 011.94 1.516l.548 2.192a2 2 0 01-.45 1.86l-.95.95a16 16 0 006.364 6.364l.95-.95a2 2 0 011.86-.45l2.192.548A2 2 0 0120 17.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z';
  var chatD = 'M8 10h8m-8 4h5m-9 5l3.5-3.5h9A2.5 2.5 0 0021 13.5v-6A2.5 2.5 0 0018.5 5h-13A2.5 2.5 0 003 7.5v6A2.5 2.5 0 005.5 16H7v3z';

  var calcBtn = item('button', null, 'Calculator', calcD);
  var bookBtn = item('a', BOOK_URL, 'Book', bookD);
  var callBtn = item('a', 'tel:'+PHONE, 'Call', phoneD);
  var textBtn = item('a', 'sms:'+SMS, 'Text', chatD);

  calcBtn.addEventListener('click', function(){ window.openCalculator(); });
  grid.appendChild(calcBtn);
  grid.appendChild(bookBtn);
  grid.appendChild(callBtn);
  grid.appendChild(textBtn);
  mobile.appendChild(grid);
  document.body.appendChild(mobile);

  // ======= Desktop Floating Buttons =======
  var fabWrap = el('div', 'sd-desktop-floating-buttons');
  var fabCalc = el('button', 'sd-fab');
  fabCalc.appendChild(svg(calcD)); fabCalc.appendChild(el('span','', 'Calculator'));
  fabCalc.addEventListener('click', function(){ window.openCalculator(); });

  var fabCall = el('a', 'sd-fab'); fabCall.href = 'tel:'+PHONE;
  fabCall.appendChild(svg(phoneD)); fabCall.appendChild(el('span','', 'Call'));

  var fabText = el('a', 'sd-fab'); fabText.href = 'sms:'+SMS;
  fabText.appendChild(svg(chatD)); fabText.appendChild(el('span','', 'Text'));

  fabWrap.appendChild(fabText);
  fabWrap.appendChild(fabCall);
  fabWrap.appendChild(fabCalc);
  document.body.appendChild(fabWrap);

  // ======= Quote Calculator (lightweight) =======
  var modal = el('div','sd-calc-modal'); modal.id='calculatorModal';
  var dialog = el('div','sd-calc-dialog');
  dialog.innerHTML = `
    <div class="sd-calc-header">
      <div class="sd-calc-title">Instant Quote (Estimate)</div>
      <button class="sd-calc-close" aria-label="Close">&times;</button>
    </div>
    <div class="sd-calc-body">
      <div class="sd-row">
        <div class="sd-field">
          <label for="sdService">Service</label>
          <select id="sdService">
            <option value="detail" data-base="179">Detail — Silver</option>
            <option value="detail-gold" data-base="299" selected>Detail — Gold</option>
            <option value="detail-plat" data-base="449">Detail — Platinum</option>
            <option value="ceramic" data-base="899">Ceramic Coating</option>
            <option value="tint" data-base="399">Window Tint</option>
            <option value="ppf" data-base="999">PPF (Partial Front)</option>
          </select>
        </div>
        <div class="sd-field">
          <label for="sdSize">Vehicle Size</label>
          <select id="sdSize">
            <option value="1.00" selected>Sedan / Coupe</option>
            <option value="1.15">Small SUV</option>
            <option value="1.25">Truck</option>
            <option value="1.35">Large SUV</option>
          </select>
        </div>
      </div>

      <div class="sd-row">
        <div class="sd-field">
          <label><input type="checkbox" id="sdPetHair" value="60"> Pet hair</label>
          <label><input type="checkbox" id="sdOdor" value="80"> Odor / Ozone</label>
          <label><input type="checkbox" id="sdEngine" value="40"> Engine bay</label>
        </div>
        <div class="sd-field">
          <label><input type="checkbox" id="sdClay" value="50"> Clay bar</label>
          <label><input type="checkbox" id="sdPolish" value="120"> 1-Step polish</label>
          <label><input type="checkbox" id="sdHeadlights" value="70"> Headlight restore</label>
        </div>
      </div>

      <div class="sd-total">
        <div>Estimated total</div>
        <div class="price" id="sdTotal">$0</div>
      </div>
      <div class="sd-actions">
        <a class="sd-btn primary" href="${BOOK_URL}" target="_blank" rel="noopener">Book Online</a>
        <a class="sd-btn alt" href="tel:${PHONE}">Call</a>
        <a class="sd-btn alt" href="sms:${SMS}">Text</a>
      </div>
    </div>
  `;
  modal.appendChild(dialog);
  document.body.appendChild(modal);

  function calcTotal(){
    var service = document.getElementById('sdService');
    var size = document.getElementById('sdSize');
    if (!service || !size) return;

    var base = Number(service.options[service.selectedIndex].dataset.base || 0);
    var multiplier = Number(size.value || 1);
    var add = 0;
    ['sdPetHair','sdOdor','sdEngine','sdClay','sdPolish','sdHeadlights'].forEach(function(id){
      var el = document.getElementById(id);
      if (el && el.checked) add += Number(el.value || 0);
    });
    var total = Math.round((base * multiplier + add)/1)*1; // simple round
    var elTotal = document.getElementById('sdTotal');
    if (elTotal) elTotal.textContent = '$' + total.toLocaleString();
  }

  dialog.addEventListener('change', calcTotal);
  calcTotal();

  // ======= Public API =======
  window.openCalculator = function(){
    modal.classList.add('active');
    try { document.body.style.overflow = 'hidden'; } catch(e){}
  };
  window.closeCalculator = function(){
    modal.classList.remove('active');
    try { document.body.style.overflow = ''; } catch(e){}
  };

  dialog.querySelector('.sd-calc-close').addEventListener('click', window.closeCalculator);
  modal.addEventListener('click', function(e){ if (e.target === modal) window.closeCalculator(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && modal.classList.contains('active')) window.closeCalculator(); });

  // ======= iOS visualViewport nudge to avoid "floating" when URL bar shows/hides =======
  (function(){
    var bar = mobile;
    if (!('visualViewport' in window) || !bar) return;
    function sync(){
      var vv = window.visualViewport;
      var offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      bar.style.transform = 'translateY(' + offset + 'px)';
    }
    window.visualViewport.addEventListener('resize', sync);
    window.visualViewport.addEventListener('scroll', sync);
    sync();
  })();

})();
