
// === Sticky Action Buttons v3 (segmented style) ===
(function(){
  const PHONE = "+14805288227";
  const SMS = "+14805288227";
  const FORM_ID = "iOAJA6wWRWJ3ycF2AUKI"; // GHL form id

  function injectHTML(){
    const rail = document.createElement('div');
    rail.className = 'fab-rail';
    rail.innerHTML = `
      <div class="fab-pair">
        <a class="fab-pill fab-call" href="tel:${PHONE}" aria-label="Call Shine Design">CALL US</a>
        <a class="fab-pill fab-text" href="sms:${SMS}" aria-label="Text Shine Design">Text Us</a>
      </div>
      <button class="fab-pill fab-book" type="button" id="ab-book-btn" aria-haspopup="dialog" aria-controls="ab-modal">Book</button>
    `;
    const bar = document.createElement('div');
    bar.className = 'fab-bar';
    bar.innerHTML = `
      <div class="wrap">
        <a class="fab-pill fab-call" href="tel:${PHONE}" aria-label="Call Shine Design">Call</a>
        <a class="fab-pill fab-text" href="sms:${SMS}" aria-label="Text Shine Design">Text</a>
        <button class="fab-pill fab-book" type="button" id="ab-book-btn-m" aria-haspopup="dialog" aria-controls="ab-modal">Book</button>
      </div>
    `;
    document.body.append(rail, bar);

    const overlay = document.createElement('div');
    overlay.id = 'ab-overlay';
    const modal = document.createElement('div');
    modal.id = 'ab-modal';
    modal.setAttribute('role','dialog');
    modal.setAttribute('aria-modal','true');
    modal.innerHTML = `
      <button id="ab-close" aria-label="Close booking">✕</button>
      <iframe id="ab-iframe" title="Book with Shine Design" loading="lazy"
        srcdoc="<!DOCTYPE html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>
          <style>html,body{height:100%;margin:0}</style></head><body>
          <iframe src='https://api.leadconnectorhq.com/widget/form/${FORM_ID}' style='width:100%;height:100%;border:0' title='Booking'></iframe>
          <script src='https://link.msgsndr.com/js/form_embed.js'></script>
        </body></html>">
      </iframe>
    `;
    document.body.append(overlay, modal);

    function openModal(){
      overlay.style.display='block';
      modal.style.display='block';
      document.body.classList.add('noscroll');
    }
    function closeModal(){
      overlay.style.display='none';
      modal.style.display='none';
      document.body.classList.remove('noscroll');
    }
    document.getElementById('ab-book-btn').addEventListener('click', openModal);
    document.getElementById('ab-book-btn-m').addEventListener('click', openModal);
    document.getElementById('ab-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHTML);
  } else {
    injectHTML();
  }
})();
