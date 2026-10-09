// 메인 (/) — 아카데믹 스타일
import { profile as P } from "../profile";
import { courses } from "../courses";
import { esc, md, page, type PublicNote } from "./shared";

const CSS = `
:root{--bg:#FFFFFF;--soft:#F5F8F8;--ink:#16222C;--muted:#4B5963;--faint:#6B7A82;--rule:#E1E6E8;--rule2:#D5E0DE;--acc:#0B5D57;--acc2:#063B37}
body{background:var(--bg);color:var(--ink);font:16px/1.7 "IBM Plex Sans KR",system-ui,sans-serif}
a{color:var(--acc)}a:hover{color:var(--acc2)}
.serif{font-family:"Noto Serif KR",serif}
.w{max-width:1040px;margin:0 auto;padding:0 24px}
header.top{border-bottom:1px solid var(--rule)}
header.top .w{min-height:64px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}
.logo{font-family:"Noto Serif KR",serif;font-weight:700;font-size:19px;text-decoration:none;color:var(--ink)}
nav.sec{display:flex;gap:4px;flex-wrap:wrap;font-size:15px}
nav.sec a{padding:10px 12px;text-decoration:none;color:var(--muted)}nav.sec a:hover{color:var(--ink)}
.hero{display:flex;gap:56px;align-items:center;flex-wrap:wrap;padding-top:88px;padding-bottom:72px}
.hero>div:first-child{flex:1 1 520px}
.hero h1{margin:0;font-size:60px;line-height:1.15;font-weight:700;letter-spacing:-.02em}
.hero .en{margin:8px 0 0;font-size:20px;color:var(--muted)}
.hero .intro{margin:28px 0 0;font-size:18px;max-width:34em}
.btns{display:flex;gap:12px;margin-top:32px;flex-wrap:wrap}
.btn{min-height:48px;display:inline-flex;align-items:center;padding:0 22px;border-radius:4px;font-weight:600;text-decoration:none;border:1.5px solid var(--acc)}
.btn.fill{background:var(--acc);color:#fff}.btn.fill:hover{background:var(--acc2);color:#fff}
.photo{flex:0 0 260px;height:320px;background:#EEF3F2;border:1px solid var(--rule2);display:flex;align-items:center;justify-content:center;color:var(--faint);font-size:14px;overflow:hidden}
.photo img{width:100%;height:100%;object-fit:cover}
section.s{padding-top:80px}
h2{margin:0;font-family:"Noto Serif KR",serif;font-size:32px;font-weight:700}
.head{display:flex;justify-content:space-between;align-items:baseline;gap:16px;flex-wrap:wrap}
.head a{font-weight:600;font-size:15px}
.lede{margin:8px 0 0;color:var(--muted)}
#about{background:var(--soft);border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);margin-top:0}
#about .w{padding-top:72px;padding-bottom:72px;display:flex;gap:56px;flex-wrap:wrap}
#about .w>div:first-child{flex:1 1 340px}#about .w>div:last-child{flex:1 1 420px;display:grid;gap:32px}
#about p{max-width:32em}
h3.k{margin:0 0 12px;font-size:16px;font-weight:600;color:var(--acc)}
dl.tl{margin:0;display:grid;grid-template-columns:140px minmax(0,1fr);gap:12px 20px}
dl.tl dt{color:var(--muted);font-variant-numeric:tabular-nums}dl.tl dd{margin:0}
.certs{margin:24px 0 0;font-size:15px;color:var(--muted)}
.grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));margin-top:32px;border-top:2px solid var(--ink)}
.grid3>div{padding:24px 24px 24px 0;border-bottom:1px solid var(--rule)}
.grid3 h3{margin:0;font-size:20px;font-weight:600}.grid3 p{margin:8px 0 0;color:var(--muted)}
.pub{margin-top:32px;padding:28px 32px;border:1px solid var(--rule2);border-radius:4px;display:flex;gap:32px;flex-wrap:wrap;align-items:flex-start}
.pub .yr{margin:0;font-size:32px;color:var(--acc);font-variant-numeric:tabular-nums}
.pub>div{flex:1 1 420px}
.pub h3{margin:0;font-size:20px;font-weight:600;line-height:1.5}.pub h3 a{color:var(--ink);text-decoration:none}.pub h3 a:hover{text-decoration:underline}
.pub p{margin:4px 0 0}.pub .m{color:var(--muted)}
.btn.sm{min-height:44px;padding:0 18px;font-size:15px}
.cards{margin-top:32px;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}
.cards article{padding:24px;border:1px solid var(--rule);border-radius:4px;display:flex;flex-direction:column;gap:10px}
.cards h3{margin:0;font-size:20px;font-weight:600}.cards p{margin:0;color:var(--muted)}.cards .st{font-size:14px;color:var(--acc)}
.courses{margin-top:28px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(420px,100%),1fr));border-top:2px solid var(--ink);column-gap:48px}
.courses a{display:block;padding:24px 0;border-bottom:1px solid var(--rule);text-decoration:none;color:var(--ink)}
.courses a:hover h3{text-decoration:underline}
.courses .meta{margin:0;font-size:14px;color:var(--muted)}.courses h3{margin:4px 0 0;font-size:21px;font-weight:600}
.courses .d{margin:6px 0 0;color:var(--muted)}.courses .go{margin:12px 0 0;font-size:15px;font-weight:600;color:var(--acc)}
ol.notes{list-style:none;margin:24px 0 0;padding:0;border-top:1px solid var(--rule)}
ol.notes li{display:grid;grid-template-columns:100px minmax(0,1fr);gap:20px;padding:14px 0;border-bottom:1px solid var(--rule)}
ol.notes time{color:var(--muted);font-variant-numeric:tabular-nums}ol.notes p{margin:0}ol.notes span{font-size:14px;color:var(--faint)}
.empty{margin:24px 0 0;color:var(--muted)}
#contact{padding-bottom:96px}
footer{border-top:1px solid var(--rule)}footer .w{padding-top:24px;padding-bottom:24px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-size:14px;color:var(--faint)}
footer a{color:var(--faint)}
@media (max-width:600px){.hero{padding-top:56px;gap:32px}.hero h1{font-size:44px}.photo{flex-basis:100%;height:240px}dl.tl{grid-template-columns:1fr;gap:2px 0}dl.tl dd{margin-bottom:12px}ol.notes li{grid-template-columns:1fr;gap:2px}.pub{padding:24px}}
`;

export function renderHome(notes: PublicNote[]) {
  const pub = P.publications
    .map(
      (p) => `<article class="pub">
  <p class="yr serif">${esc(p.year)}</p>
  <div>
    <h3><a href="${esc(p.href)}">${esc(p.title)}</a></h3>
    <p>${p.authors.map((a) => (a === P.name ? `<b>${esc(a)}</b>` : esc(a))).join(", ")}</p>
    <p class="m"><i>${esc(p.venue)}</i>, ${esc(p.detail)}</p>
    ${p.note ? `<p class="m" style="margin-top:12px;font-size:15px">${esc(p.note)}</p>` : ""}
  </div>
  <a class="btn sm" href="${esc(p.href)}">논문 보기</a>
</article>`
    )
    .join("");

  const body = `
<header class="top"><div class="w">
  <a class="logo" href="/">${esc(P.name)}</a>
  <nav class="sec" aria-label="섹션">
    <a href="#about">소개</a><a href="#research">연구</a><a href="#pubs">논문</a><a href="#projects">프로젝트</a><a href="#courses">수강 과목</a><a href="#notes">연구노트</a><a href="#contact">연락처</a>
  </nav>
</div></header>

<main id="main">
<section class="w hero">
  <div>
    <h1 class="serif">${esc(P.name)}</h1>
    <p class="en">${esc(P.nameEn)}</p>
    <p class="intro">${esc(P.intro)}</p>
    <div class="btns"><a class="btn fill" href="/projects">프로젝트 보기</a><a class="btn" href="mailto:${esc(P.email)}">이메일 보내기</a></div>
  </div>
  <div class="photo">${P.photo ? `<img src="${esc(P.photo)}" alt="${esc(P.name)} 사진">` : "[프로필 사진]"}</div>
</section>

<section id="about"><div class="w">
  <div><h2>소개</h2><p style="margin-top:20px">${esc(P.about)}</p><p class="certs">자격 · ${P.certs.map(esc).join(", ")}</p></div>
  <div>
    <div><h3 class="k">학력</h3><dl class="tl">${P.education.map((e) => `<dt>${esc(e.period)}</dt><dd>${esc(e.text)}</dd>`).join("")}</dl></div>
    <div><h3 class="k">경력</h3><dl class="tl">${P.career.map((e) => `<dt>${esc(e.period)}</dt><dd>${esc(e.text)}</dd>`).join("")}</dl></div>
  </div>
</div></section>

<section id="research" class="w s">
  <h2>연구 관심사</h2>
  <div class="grid3">${P.interests.map((i) => `<div><h3>${esc(i.title)}</h3><p>${esc(i.desc)}</p></div>`).join("")}</div>
</section>

<section id="pubs" class="w s"><h2>논문</h2>${pub}</section>

<section id="projects" class="w s">
  <div class="head"><h2>프로젝트</h2><a href="/projects">개발 상세 보기</a></div>
  <div class="cards">${P.projects
    .map((p) => `<article><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p><p class="st">${p.stack.map(esc).join(" · ")}</p></article>`)
    .join("")}</div>
</section>

<section id="courses" class="w s">
  <h2>수강 과목</h2>
  <p class="lede">과목마다 무엇을 배우고 발표했는지, 그게 어떤 연구 질문으로 이어졌는지를 흐름으로 정리했습니다.</p>
  <div class="courses">${courses
    .map(
      (c) => `<a href="/courses/${c.slug}"><p class="meta">${esc(c.meta)}</p><h3>${esc(c.name)}</h3><p class="d">${esc(c.card)}</p><p class="go">흐름 보기</p></a>`
    )
    .join("")}</div>
</section>

<section id="notes" class="w s">
  <div class="head"><h2>연구노트</h2><a href="/notes">전체 기록 보기</a></div>
  <p class="lede">Claude와 대화하며 MCP로 자동 기록되는 최근 진행 상황</p>
  ${
    notes.length
      ? `<ol class="notes">${notes
          .map((n) => `<li><time datetime="${n.note_date}">${md(n.note_date)}</time><p>${esc(n.content)} <span>${esc(n.project)} · ${esc(n.stage)}</span></p></li>`)
          .join("")}</ol>`
      : `<p class="empty">공개된 기록이 아직 없습니다.</p>`
  }
</section>

<section id="contact" class="w s">
  <h2>연락처</h2>
  <dl class="tl" style="margin-top:24px;grid-template-columns:120px minmax(0,1fr)">
    <dt>이메일</dt><dd><a href="mailto:${esc(P.email)}">${esc(P.email)}</a></dd>
    <dt>GitHub</dt><dd><a href="${esc(P.github)}">${esc(P.github.replace(/^https?:\/\//, ""))}</a></dd>
    <dt>소속</dt><dd>한국외국어대학교 대학원 국제경영학과</dd>
  </dl>
</section>
</main>

<footer><div class="w"><span>© ${new Date().getUTCFullYear()} ${esc(P.name)}</span><a href="#main">맨 위로</a></div></footer>`;

  return page({
    title: `${P.name} | ${P.nameEn}`,
    desc: P.intro,
    fonts: "family=Noto+Serif+KR:wght@600;700&family=IBM+Plex+Sans+KR:wght@400;500;600",
    css: CSS,
    body,
  });
}
