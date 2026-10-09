export const esc = (s: string) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export type PublicNote = { id: number; project: string; stage: string; content: string; note_date: string };

const WEEK = ["일", "월", "화", "수", "목", "금", "토"];
export function md(d: string) {
  const dt = new Date(d + "T00:00:00Z");
  return `${dt.getUTCMonth() + 1}월 ${dt.getUTCDate()}일`;
}
export function mdDot(d: string) {
  return d.slice(5).replace("-", ".");
}
export function weekday(d: string) {
  return WEEK[new Date(d + "T00:00:00Z").getUTCDay()] + "요일";
}

export function page(opts: { title: string; desc: string; fonts: string; css: string; body: string }) {
  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(opts.title)}</title>
<meta name="description" content="${esc(opts.desc)}">
<meta property="og:title" content="${esc(opts.title)}">
<meta property="og:description" content="${esc(opts.desc)}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?${opts.fonts}&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{margin:0}img{max-width:100%}
:focus-visible{outline:2px solid currentColor;outline-offset:3px;border-radius:2px}
.skip{position:absolute;left:-9999px}.skip:focus{left:16px;top:16px;z-index:9;background:#fff;color:#000;padding:8px 12px}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
${opts.css}
</style></head><body><a class="skip" href="#main">본문으로 건너뛰기</a>${opts.body}</body></html>`;
}
