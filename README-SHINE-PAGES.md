# Shine Design Pages – Shipping README

This is the minimal, repeatable setup to ship new service/location pages with the shared header, sticky action buttons, footer, and SEO.

## 1) Required global includes (order matters)

Put this **in `<head>`**, as early as possible:
```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-P4LZ4N28');</script>
<!-- End Google Tag Manager -->

<link rel="stylesheet" href="/action-buttons.v3.css">
<script defer src="/action-buttons.v3.js"></script>

<link rel="stylesheet" href="/header-styles.css">
<script defer src="/site-chrome.js" data-chrome-version="v3"></script>

<script src="https://cdn.tailwindcss.com"></script>
```

Put this **immediately after `<body>`**:
```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P4LZ4N28"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

## 2) Page skeleton to copy

Use this as a starter for any new page.
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{PAGE_TITLE}</title>
  <meta name="description" content="{ONE_SENTENCE_VALUE_PROP}" />
  <link rel="canonical" href="https://shinedesignauto.com/{slug}" />

  <!-- Required shared assets -->
  <!-- GTM + includes from section 1 go here -->
</head>
<body>
  <!-- GTM noscript goes here -->

  <!-- Hero should NOT be <header>. Use <section>. -->
  <section class="hero" role="region">
    <!-- page-specific hero -->
  </section>

  <main id="content">
    <!-- page content -->
  </main>

  <!-- Do not hard-code header/footer; site-chrome.js injects them -->
</body>
</html>
```

## 3) Header + mobile menu

- The shared header is injected by `/site-chrome.js` at the top of `<body>`.
- Sticky works if no ancestor of the header has `overflow` or `transform`. Keep hero as `<section>`, not `<header>`.
- To increase logo size, add at end of `/header-styles.css`:
```css
.brand img { height: 56px; }
```
- Brand tagline source of truth: inside the injected header template (`ShineDesign` + `DETAILING • TINT • PPF • CERAMIC`).

## 4) Sticky action buttons (CALL / Text / Book)

Already enabled by the includes. To customize:
- Phone and SMS are defined in `/action-buttons.v3.js` (`PHONE`, `SMS`).
- Booking modal uses your GHL form id `FORM_ID`.
- Style tokens live at top of `/action-buttons.v3.css`:
```css
:root{ --ab-brand:#0ea5e9; --ab-dark:#0b1220; --ab-text:#0f172a; }
```
- Font override (optional):
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&display=swap" rel="stylesheet">
```
```css
/* add to end of action-buttons.v3.css */
.fab-pill{ font-family:'Poppins', ui-sans-serif, system-ui; font-weight:800; font-size:16px; }
.fab-call{ text-transform:uppercase; letter-spacing:.12em; }
```

## 5) Footer

- Footer is injected by `/site-chrome.js` and matches the provided LocalBusiness + Contact links.
- Copyright year auto-updates in the injected template.

## 6) SEO checklist per page

Minimum:
- Unique `<title>` (≤ 60 chars) and `<meta name="description">` (≤ 160 chars).
- `<link rel="canonical">` with absolute URL.
- Social: `og:title`, `og:description`, `og:url`, `og:image` (1200×630), `twitter:card=summary_large_image`.
- JSON-LD:
  - `Service` schema with `serviceType`, `areaServed`, and `offers` where applicable.
  - For the home page, include `WebSite`, `Organization`, and `LocalBusiness` graphs.
- One H1 per page.
- Internal links to core services.
- No duplicate inline headers/footers to avoid DOM duplicates and CLS.

## 7) Accessibility

- Landmarks: `<main>`, `<nav>`, `<footer>` are injected automatically.
- Buttons and links have `aria-label`s in shared chrome and action buttons.
- Keep alt text meaningful for all images.
- Maintain focus styles; do not remove `:focus-visible` rules.

## 8) Performance hygiene

- Use WebP/AVIF for images. Add width/height to `<img>` to prevent layout shift.
- Preconnect where needed: `fonts.googleapis.com`, `cdn.tailwindcss.com`, `api.leadconnectorhq.com` for booking.
- Avoid extra copies of Tailwind and shared assets; keep a single include each.

## 9) Common pitfalls

- **Sticky header not working**: a parent has `overflow` or `transform`. Keep hero as `<section>`. Ensure the rule targets the injected header class and not page hero.
- **Two menus**: remove any page-specific mobile nav; the shared header has its own.
- **Footer duplication**: do not paste a static footer in the page body.

## 10) Ship checklist

- [ ] Title + Description + Canonical set
- [ ] GTM in `<head>` and noscript after `<body>`
- [ ] Shared includes added once
- [ ] No inline header/footer in page body
- [ ] Sticky action buttons render on desktop and mobile
- [ ] Booking modal opens and loads GHL
- [ ] Header sticky across scroll, mobile drawer opens/closes
- [ ] Open Graph image reachable
- [ ] JSON-LD validates (Google Rich Results Test)
- [ ] Lighthouse pass on Mobile (≥ 90 for Perf/SEO/Best Practices/Accessibility)

## 11) Snippets

### Service schema template
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "{Service Name}",
  "provider": { "@type": "LocalBusiness", "name": "Shine Design Mobile Detailing", "telephone": "+14805288227",
    "address": { "@type": "PostalAddress", "addressLocality": "Gilbert", "addressRegion": "AZ" } },
  "areaServed": ["Gilbert","Mesa","Chandler","Queen Creek","Scottsdale","Phoenix"],
  "offers": [{ "@type": "Offer", "name": "{Package}", "price": "{Price}", "priceCurrency": "USD" }]
}
</script>
```

### Open Graph
```html
<meta property="og:type" content="website" />
<meta property="og:title" content="{OG Title}" />
<meta property="og:description" content="{OG Description}" />
<meta property="og:url" content="https://shinedesignauto.com/{slug}" />
<meta property="og:image" content="https://shinedesignauto.com/assets/images/{image}.jpg" />
<meta name="twitter:card" content="summary_large_image" />
```

---

Place shared assets at site root:
- `/header-styles.css`
- `/site-chrome.js`
- `/action-buttons.v3.css`
- `/action-buttons.v3.js`

Versioning: bump `data-chrome-version` when you change header/footer to bust caches quickly.
