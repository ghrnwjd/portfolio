// /projects — 개발자 스타일 (프로필 소개 없음)
import { profile as P } from "../profile";
import { esc, mdDot, page, type PublicNote } from "./shared";

const CSS = `
:root{--bg:#F2F3F5;--card:#FFFFFF;--ink:#15171C;--muted:#4A5060;--faint:#5A6070;--acc:#2448D8;--acc2:#152E99;--chip:#1D3BB8;--dark:#15171C;--dline:#2B2F38}
body{background:var(--bg);color:var(--ink);font:15px/1.65 "Gothic A1",system-ui,sans-serif}
a{color:var(--acc)}a:hover{color:var(--acc2)}
.mono{font-family:"JetBrains Mono",monospace}
main{max-width:960px;margin:0 auto;padding:48px 24px 80px;display:flex;flex-direction:column;gap:20px}
.bar{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}
.back{padding:10px 0;text-decoration:none;font-weight:600;color:var(--ink)}
.btn{min-height:44px;display:inline-flex;align-items:center;padding:0 16px;border:1.5px solid var(--ink);color:var(--ink);border-radius:8px;text-decoration:none;font-weight:600}
.btn:hover{background:var(--ink);color:var(--bg)}
h1{margin:0;font-size:40px;line-height:1.2;font-weight:800;letter-spacing:-.02em}
.skills{display:flex;flex-wrap:wrap;gap:6px;margin-top:16px;padding:0;list-style:none}
.skills li{padding:2px 10px;background:var(--card);color:var(--chip);border-radius:6px;font-size:13px}
article{background:var(--card);border-radius:12px;padding:28px}
article.feat{padding:32px;border:2px solid var(--ink)}
article h2{margin:0;font-size:20px;font-weight:800}article.feat h2{font-size:26px}
.lead{margin:8px 0 0;color:var(--muted)}article.feat .lead{font-size:17px;color:var(--ink)}
.top{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:baseline}.top span{font-size:13px;color:var(--faint)}
.flow{margin:24px 0 0;padding:0;list-style:none;display:flex;flex-wrap:wrap;align-items:center;gap:8px;font-size:13px}
.flow li{display:flex;align-items:center;gap:8px}
.flow b{font-weight:400;padding:8px 12px;border:1.5px solid var(--ink);border-radius:6px}
.flow li:nth-child(2) b{background:var(--ink);color:var(--bg)}
.flow li:last-child b{background:var(--acc);border-color:var(--acc);color:#fff}
.pa{margin-top:24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px}
.pa h3{margin:0;font-size:14px;font-weight:800}.pa p{margin:4px 0 0;color:var(--muted)}
.links{margin-top:20px;display:flex;gap:16px;flex-wrap:wrap;font-weight:600}
.stack{margin:16px 0 0;font-size:13px;color:var(--chip)}
.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}
.live{background:var(--dark);color:#E6E8EE;border-radius:12px;padding:28px}
.live h2{margin:0;font-size:18px;font-weight:800}
.live .st{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:#A9AFBF}.live .st i{width:8px;height:8px;border-radius:50%;background:#5BD08B}
.live ol{list-style:none;margin:16px 0 0;padding:0}
.live li{display:grid;grid-template-columns:84px minmax(0,1fr);gap:16px;padding:12px 0;border-top:1px solid var(--dline)}
.live time{font-size:13px;color:#A9AFBF;padding-top:2px}.live p{margin:0}.live li span{font-size:13px;color:#8C93A6}
.live a{display:inline-block;margin-top:12px;color:#9DB0FF;font-weight:600}
@media (max-width:600px){h1{font-size:32px}article,article.feat{padding:22px}.flow svg{display:none}}
`;

const ARROW = `<svg width="24" height="12" viewBox="0 0 24 12" aria-hidden="true"><path d="M0 6h20M15 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;

export function renderProjects(notes: PublicNote[]) {
  const [feat, ...rest] = [...P.projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  const links = (ls: { text: string; href: string }[]) =>
    ls.length ? `<div class="links">${ls.map((l) => `<a href="${esc(l.href)}">${esc(l.text)}</a>`).join("")}</div>` : "";

  const featHtml = feat
    ? `<article class="feat">
  <div class="top"><h2>${esc(feat.name)}</h2><span>대표 프로젝트</span></div>
  <p class="lead">${esc(feat.lead)}</p>
  ${
    feat.flow
      ? `<ol class="flow mono" aria-label="구조">${feat.flow.map((f, i) => `<li>${i ? ARROW : ""}<b>${esc(f)}</b></li>`).join("")}</ol>`
      : ""
  }
  ${
    feat.problem
      ? `<div class="pa"><div><h3>문제</h3><p>${esc(feat.problem)}</p></div><div><h3>접근</h3><p>${esc(feat.approach ?? "")}</p></div><div><h3>결과</h3><p>${esc(feat.result ?? "")}</p></div></div>`
      : ""
  }
  ${links(feat.links)}
</article>`
    : "";

  const restHtml = `<div class="two">${rest
    .map(
      (p) => `<article><h2>${esc(p.name)}</h2><p class="lead">${esc(p.lead)}</p><p class="stack mono">${p.stack.map(esc).join(" · ")}</p>${links(p.links)}</article>`
    )
    .join("")}</div>`;

  const live = `<section class="live" aria-labelledby="live">
  <div class="top"><h2 id="live">지금 하고 있는 일</h2><span class="st"><i></i>연구노트 MCP에서 실시간</span></div>
  ${
    notes.length
      ? `<ol>${notes
          .map((n) => `<li><time class="mono" datetime="${n.note_date}">${mdDot(n.note_date)}</time><p>${esc(n.content)} <span>${esc(n.project)}</span></p></li>`)
          .join("")}</ol>`
      : `<p style="margin:16px 0 0;color:#A9AFBF">공개된 기록이 아직 없습니다.</p>`
  }
  <a href="/notes">전체 기록 보기</a>
</section>`;

  const body = `<main id="main">
  <div class="bar"><a class="back" href="/">← ${esc(P.name)}</a><a class="btn" href="${esc(P.github)}">GitHub</a></div>
  <div style="padding:16px 0 8px"><h1>프로젝트</h1><ul class="skills" aria-label="기술">${P.skills.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>
  ${featHtml}
  ${restHtml}
  ${live}
</main>`;

  return page({
    title: `프로젝트 | ${P.name}`,
    desc: P.projects.map((p) => p.name).join(", "),
    fonts: "family=Gothic+A1:wght@400;600;800&family=JetBrains+Mono:wght@400;600",
    css: CSS,
    body,
  });
}
