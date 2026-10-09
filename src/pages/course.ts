// /courses/<slug> — 과목별 흐름 (타임라인 스토리 스타일)
import { profile as P } from "../profile";
import { courses, type Course, type Kind } from "../courses";
import { esc, page } from "./shared";

const KIND: Record<Kind, { label: string; color: string }> = {
  learn: { label: "학습", color: "#9AA6E8" },
  work: { label: "발표 · 과제", color: "#4E5BC9" },
  research: { label: "연구로 이어진 것", color: "#1A1F4A" },
};

const CSS = `
:root{--bg:#EAEEF6;--card:#FFFFFF;--ink:#1A1F4A;--muted:#4A5085;--line:#C3CAE8;--rule:#E3E7F3;--tab:#B8C0E0}
body{background:var(--bg);color:var(--ink);font:16px/1.7 "Noto Sans KR",system-ui,sans-serif}
a{color:#2B3280}a:hover{color:var(--ink)}
.serif{font-family:"Nanum Myeongjo",serif;font-weight:800}
.w{max-width:960px;margin:0 auto;padding:48px 24px 96px}
.bar{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}
.back{padding:10px 0;text-decoration:none;font-weight:700}
.bar span{font-size:14px;color:var(--muted)}
nav.tabs{display:flex;gap:8px;flex-wrap:wrap;margin-top:32px}
nav.tabs a{min-height:44px;display:inline-flex;align-items:center;padding:0 18px;border-radius:999px;font-size:15px;text-decoration:none;color:var(--ink);border:1.5px solid var(--tab)}
nav.tabs a:hover{border-color:var(--ink)}
nav.tabs a[aria-current]{background:var(--ink);color:var(--bg);border-color:var(--ink);font-weight:700}
.hero{padding:56px 0 48px}
.hero .meta{margin:0;font-size:15px;color:var(--muted)}
.hero h1{margin:8px 0 0;font-size:48px;line-height:1.3;letter-spacing:-.02em}
.hero .sum{margin:20px 0 0;font-size:18px;color:var(--muted);max-width:36em}
.legend{list-style:none;margin:28px 0 0;padding:0;display:flex;gap:10px;flex-wrap:wrap;font-size:14px}
.legend li{display:inline-flex;align-items:center;gap:8px;padding:4px 12px;background:var(--card);border-radius:999px}
.legend i{width:10px;height:10px;border-radius:50%}
ol.tl{list-style:none;margin:0;padding:0}
ol.tl>li{display:grid;grid-template-columns:96px 28px minmax(0,1fr);gap:0 20px}
.when{margin:0;padding-top:22px;font-size:18px;text-align:right}
.rail{display:flex;flex-direction:column;align-items:center}
.rail span{width:2px;background:var(--line)}.rail span:first-child{height:26px}.rail span:last-child{flex:1}
ol.tl>li:last-child .rail span:last-child{background:transparent}
.dot{width:20px;height:20px;border-radius:50%;border:4px solid var(--bg);box-sizing:border-box}
.step{margin:8px 0 16px;padding:20px 24px;background:var(--card);border-radius:12px}
.step .k{margin:0;font-size:13px;color:var(--muted)}
.step h2{margin:2px 0 0;font-size:20px;font-weight:700}
.step .d{margin:6px 0 0;color:var(--muted)}
.step .o{margin:12px 0 0;padding-top:12px;border-top:1px solid var(--rule);font-size:14px}.step .o span{color:var(--muted);margin-right:8px}
.take{margin-top:48px;padding:32px;background:var(--ink);color:#E4E7F7;border-radius:16px}
.take h2{margin:0;font-size:24px}.take p{margin:12px 0 0;max-width:40em}
.pn{margin-top:32px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-weight:500}
@media (max-width:600px){.hero h1{font-size:34px}ol.tl>li{grid-template-columns:20px minmax(0,1fr);gap:0 14px}.when{display:none}.step .k::before{content:attr(data-when) " · "}}
`;

export function renderCourse(c: Course) {
  const i = courses.indexOf(c);
  const prev = courses[i - 1];
  const next = courses[i + 1];

  const body = `<main id="main" class="w">
  <div class="bar"><a class="back" href="/#courses">← ${esc(P.name)}</a><span>수강 과목</span></div>
  <nav class="tabs" aria-label="과목">${courses
    .map((x) => `<a href="/courses/${x.slug}"${x === c ? ' aria-current="page"' : ""}>${esc(x.name)}</a>`)
    .join("")}</nav>

  <section class="hero">
    <p class="meta">${esc(c.meta)}</p>
    <h1 class="serif">${esc(c.name)}</h1>
    <p class="sum">${esc(c.summary)}</p>
    <ul class="legend" aria-label="기록 종류">${(Object.keys(KIND) as Kind[])
      .map((k) => `<li><i style="background:${KIND[k].color}"></i>${KIND[k].label}</li>`)
      .join("")}</ul>
  </section>

  <ol class="tl" aria-label="진행 흐름">${c.steps
    .map((s) => {
      const k = KIND[s.kind];
      return `<li>
    <p class="when serif">${esc(s.when)}</p>
    <div class="rail" aria-hidden="true"><span></span><i class="dot" style="background:${k.color};box-shadow:0 0 0 2px ${k.color}"></i><span></span></div>
    <article class="step">
      <p class="k" data-when="${esc(s.when)}">${k.label}</p>
      <h2>${esc(s.title)}</h2>
      <p class="d">${esc(s.desc)}</p>
      ${s.out ? `<p class="o"><span>산출물</span>${esc(s.out)}</p>` : ""}
    </article>
  </li>`;
    })
    .join("")}</ol>

  <section class="take" aria-labelledby="tk"><h2 id="tk" class="serif">이 과목에서 가져간 것</h2><p>${esc(c.takeaway)}</p></section>

  <nav class="pn" aria-label="다른 과목">
    ${prev ? `<a href="/courses/${prev.slug}">← ${esc(prev.name)}</a>` : "<span></span>"}
    ${next ? `<a href="/courses/${next.slug}">${esc(next.name)} →</a>` : ""}
  </nav>
</main>`;

  return page({
    title: `${c.name} | ${P.name}`,
    desc: c.summary,
    fonts: "family=Nanum+Myeongjo:wght@700;800&family=Noto+Sans+KR:wght@400;500;700",
    css: CSS,
    body,
  });
}
