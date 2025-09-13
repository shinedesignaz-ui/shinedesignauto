export async function onRequestGet(context) {
  const { request, params } = context;
  const url = new URL(request.url);
  const path = params.path || ""; // e.g. "services/ceramic-coating.jpg"

  // Basic safety
  if (!path || path.includes("..")) {
    return new Response("Bad path", { status: 400 });
  }

  // Map /img/* -> /assets/images/*
  const originPath = "/assets/images/" + path;
  const originURL = new URL(originPath, url.origin);

  // Query params: ?w=800&q=75&fmt=auto
  const w = parseInt(url.searchParams.get("w") || "0", 10);
  const q = parseInt(url.searchParams.get("q") || "75", 10);
  const fmt = url.searchParams.get("fmt") || "auto";

  // Limit widths for better cache hit rates
  const ALLOWED = [72, 140, 400, 800, 960, 1280, 1600, 2000];
  const width = ALLOWED.includes(w) ? w : undefined;

  const options = {
    cf: {
      image: {
        width,                                // undefined = original width
        quality: Number.isFinite(q) ? q : 75, // sane default
        format: fmt                           // 'auto'|'webp'|'avif'|'jpeg'
      }
    }
  };

  const res = await fetch(originURL.toString(), options);

  // Long cache for transformed bytes
  const headers = new Headers(res.headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}
