// 인덱스 페이지 (서버 렌더링 HTML). 외부 JS 없음.

export const STAGES = ["기획", "리서치", "기법", "실험", "작성", "투고"] as const;

type Note = {
  id: number;
  project: string;
  stage: string;
  content: string;
  note_date: string;
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const WEEK = ["일", "월", "화", "수", "목", "금", "토"];
function fmtDate(d: string) {
  const dt = new Date(d + "T00:00:00Z");
  return { md: `${dt.getUTCMonth() + 1}월 ${dt.getUTCDate()}일`, wd: WEEK[dt.getUTCDay()] + "요일", y: dt.getUTCFullYear() };
}

const CSS = /* css */ `
:root{
  --paper:#EDF1F4; --sheet:#F7F9FB; --ink:#17283A; --muted:#5E6C7B; --rule:#C8D4DF;
  --hl:#F3D54E; --hl-ink:#17283A; --done:#17283A; --todo:#C8D4DF;
  color-scheme: light;
}
@media (prefers-color-scheme: dark){
  :root{ --paper:#121D27; --sheet:#172430; --ink:#E2E9EF; --muted:#8B9AA8; --rule:#2B3B4A;
         --hl:#E9C93A; --hl-ink:#121D27; --done:#E2E9EF; --todo:#2B3B4A; color-scheme: dark; }
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--paper);color:var(--ink);
  font:16px/1.65 "IBM Plex Sans KR",system-ui,sans-serif;font-variant-numeric:tabular-nums}
a{color:inherit}
:focus-visible{outline:2px solid var(--ink);outline-offset:3px;border-radius:2px}
.wrap{max-width:860px;margin:0 auto;padding:48px 24px 80px}

header{display:flex;justify-content:space-between;align-items:baseline;gap:16px;flex-wrap:wrap}
h1{font-size:2.25rem;line-height:1.2;font-weight:700;margin:0;letter-spacing:-0.02em}
.sub{color:var(--muted);margin:4px 0 0;font-size:.95rem}

nav.projects{display:flex;gap:4px;margin:32px 0 0;border-bottom:1px solid var(--rule);overflow-x:auto}
nav.projects a{padding:8px 14px;text-decoration:none;color:var(--muted);border-bottom:3px solid transparent;margin-bottom:-1px;white-space:nowrap}
nav.projects a[aria-current]{color:var(--ink);font-weight:600;border-color:var(--ink)}
nav.projects small{font-size:.8em;margin-left:4px}

/* 단계 레일 — 이 페이지의 주인공 */
.railbox{position:relative;margin:36px 0 8px}
.rail{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(6,1fr)}
.railbox::before{content:"";position:absolute;left:calc(100%/12);right:calc(100%/12);top:15px;height:2px;background:var(--todo)}
.railbox .fill{position:absolute;left:calc(100%/12);top:15px;height:2px;background:var(--done)}
.rail li{position:relative;text-align:center;padding-top:40px}
.rail .dot{position:absolute;top:6px;left:50%;width:20px;height:20px;margin-left:-10px;border-radius:50%;
  background:var(--paper);border:2px solid var(--todo)}
.rail li.done .dot{background:var(--done);border-color:var(--done)}
.rail li.now .dot{width:32px;height:32px;margin-left:-16px;top:0;background:var(--hl);border:2px solid var(--ink)}
.rail .name{display:block;font-weight:600}
.rail li.todo .name{color:var(--muted);font-weight:400}
.rail li.now .name{background:linear-gradient(transparent 55%,var(--hl) 55%);padding:0 2px}
.rail .cnt{display:block;font-size:.8rem;color:var(--muted)}
.status{margin:20px 0 0;font-size:1.05rem}
.status b{font-weight:600}

/* 타임라인 — 노트 여백처럼 날짜를 왼쪽에 */
.log{margin:48px 0 0;border-top:1px solid var(--rule)}
.day{display:grid;grid-template-columns:120px 1fr;gap:24px;padding:20px 0;border-bottom:1px solid var(--rule)}
.day time{color:var(--muted);font-size:.9rem;line-height:1.5}
.day time b{display:block;color:var(--ink);font-size:1.05rem;font-weight:600}
.entries{list-style:none;margin:0;padding:0;display:grid;gap:12px}
.entries li{max-width:62ch}
.tag{display:inline-block;font-size:.78rem;padding:0 8px;border:1px solid var(--rule);border-radius:999px;color:var(--muted);margin-right:8px;vertical-align:1px}
.entries .pj{font-size:.8rem;color:var(--muted)}
.empty{padding:40px 0;color:var(--muted)}
.empty b{color:var(--ink)}

/* 연결 안내 */
.connect{margin:64px 0 0;padding:24px;background:var(--sheet);border:1px solid var(--rule);border-radius:8px}
.connect h2{font-size:1.1rem;margin:0 0 4px}
.connect p{margin:0 0 16px;color:var(--muted);font-size:.95rem}
.cmd{display:flex;gap:8px;align-items:stretch}
.cmd code{flex:1;overflow-x:auto;white-space:nowrap;padding:10px 12px;background:var(--paper);border:1px solid var(--rule);border-radius:6px;font-size:.85rem}
.cmd button{font:inherit;font-size:.85rem;padding:0 14px;border:1px solid var(--ink);background:var(--ink);color:var(--paper);border-radius:6px;cursor:pointer}
.tools{margin:16px 0 0;padding:0;list-style:none;display:flex;gap:8px;flex-wrap:wrap;font-size:.85rem;color:var(--muted)}

/* 잠금 화면 */
.lock{max-width:420px;margin:15vh auto 0;padding:0 24px}
.lock form{display:flex;gap:8px;margin-top:20px}
.lock input{flex:1;font:inherit;padding:10px 12px;border:1px solid var(--rule);border-radius:6px;background:var(--sheet);color:var(--ink)}
.lock button{font:inherit;padding:0 16px;border:0;border-radius:6px;background:var(--ink);color:var(--paper);cursor:pointer}
.lock .err{color:#B3261E;margin-top:12px}

@media (max-width:600px){
  .wrap{padding:32px 16px 64px}
  h1{font-size:1.75rem}
  .rail .name{font-size:.8rem}
  .rail .cnt{display:none}
  .day{grid-template-columns:1fr;gap:8px}
  .day time b{display:inline;margin-right:6px}
}
@media (prefers-reduced-motion:no-preference){
  .rail li.now .dot{animation:pop .5s ease-out .15s both}
  @keyframes pop{from{transform:scale(.4)}to{transform:scale(1)}}
}
`;

const shell = (title: string, body: string) => `<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;600;700&display=swap" rel="stylesheet">
<style>${CSS}</style></head><body>${body}</body></html>`;

export function renderLock(owner: string, failed: boolean) {
  return shell("연구노트", `<main class="lock">
  <h1>${esc(owner)}의 연구노트</h1>
  <p class="sub">기록을 보려면 접근 키를 입력하세요.</p>
  <form method="get" action="/notes"><label for="k" class="sr" hidden>접근 키</label>
    <input id="k" name="key" type="password" autocomplete="current-password" placeholder="접근 키" required>
    <button>열기</button></form>
  ${failed ? `<p class="err">키가 맞지 않습니다. 배포할 때 설정한 MCP_TOKEN 값을 입력하세요.</p>` : ""}
</main>`);
}

export function renderIndex(opts: {
  owner: string;
  origin: string;
  notes: Note[];
  projects: { project: string; n: number }[];
  current: string | null;
  stageCounts: Record<string, number>;
}) {
  const { owner, origin, notes, projects, current, stageCounts } = opts;

  // 현재 단계 = 가장 최근 기록의 단계 (etc 제외)
  const latest = notes.find((n) => (STAGES as readonly string[]).includes(n.stage));
  const nowIdx = latest ? STAGES.indexOf(latest.stage as any) : -1;

  const tabs = projects.length > 1
    ? `<nav class="projects" aria-label="프로젝트">
        <a href="/notes" ${current ? "" : 'aria-current="page"'}>전체</a>
        ${projects.map((p) => `<a href="/notes?project=${encodeURIComponent(p.project)}" ${p.project === current ? 'aria-current="page"' : ""}>${esc(p.project)}<small>${p.n}</small></a>`).join("")}
      </nav>`
    : "";

  const fillPct = nowIdx > 0 ? `calc(${(nowIdx / 6) * 100}%)` : "0";
  const rail = `<div class="railbox"><span class="fill" style="width:${fillPct}" aria-hidden="true"></span><ol class="rail" aria-label="진행 단계">
    ${STAGES.map((s, i) => {
      const cls = i < nowIdx ? "done" : i === nowIdx ? "now" : "todo";
      const n = stageCounts[s] ?? 0;
      return `<li class="${cls}" ${i === nowIdx ? 'aria-current="step"' : ""}><span class="dot" aria-hidden="true"></span><span class="name">${s}</span><span class="cnt">${n ? `기록 ${n}` : "–"}</span></li>`;
    }).join("")}
  </ol></div>`;

  const status = latest
    ? `<p class="status">지금은 <b>${latest.stage}</b> 단계 · 마지막 기록 ${fmtDate(latest.note_date).md}</p>`
    : "";

  // 날짜별 묶기
  const byDay = new Map<string, Note[]>();
  for (const n of notes) (byDay.get(n.note_date) ?? byDay.set(n.note_date, []).get(n.note_date)!).push(n);

  const log = notes.length
    ? `<section class="log" aria-label="기록">${[...byDay].map(([d, ns]) => {
        const f = fmtDate(d);
        return `<article class="day"><time datetime="${d}"><b>${f.md}</b>${f.wd}</time>
          <ul class="entries">${ns.map((n) => `<li><span class="tag">${esc(n.stage)}</span>${esc(n.content)}${current ? "" : ` <span class="pj">${esc(n.project)}</span>`}</li>`).join("")}</ul></article>`;
      }).join("")}</section>`
    : `<p class="empty"><b>아직 기록이 없습니다.</b><br>Claude에 아래 서버를 연결하고 "오늘 한 일 연구노트에 기록해줘"라고 말해보세요.</p>`;

  const endpoint = `${origin}/mcp`;
  const cmd = `claude mcp add --transport http research ${endpoint} --header "Authorization: Bearer &lt;MCP_TOKEN&gt;"`;

  return shell(`${owner}의 연구노트`, `<div class="wrap">
  <header><div><p class="sub"><a href="/">← 포트폴리오</a></p><h1>${esc(owner)}의 연구노트</h1>
    <p class="sub">${current ? esc(current) + " · " : ""}기록 ${notes.length}개</p></div></header>
  ${tabs}
  ${rail}
  ${status}
  ${log}
  <section class="connect" aria-labelledby="cx">
    <h2 id="cx">Claude에 연결하기</h2>
    <p>Claude Code에서 아래 명령을 실행하면 대화 중에 바로 기록을 남길 수 있습니다.</p>
    <div class="cmd"><code id="c">${cmd}</code><button type="button" onclick="navigator.clipboard.writeText(document.getElementById('c').innerText).then(()=>{this.textContent='복사됨'})">복사</button></div>
    <ul class="tools"><li>add_note</li><li>list_notes</li><li>delete_note</li></ul>
  </section>
</div>`);
}
