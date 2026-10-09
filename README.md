# portfolio

정호영 포트폴리오 + 연구노트 MCP 서버. Cloudflare Workers 무료 플랜 하나로 전부 돌아갑니다.

| 주소 | 내용 |
|---|---|
| `/` | 메인 — 소개, 연구, 논문, 프로젝트, 수강 과목, 최근 연구노트, 연락처 |
| `/projects` | 개발 프로젝트 상세 |
| `/courses/<slug>` | 과목별 흐름 (타임라인) |
| `/notes` | 연구노트 전체 (접근 키 필요) |
| `/mcp` | Claude가 연결하는 MCP 엔드포인트 (토큰 필요) |

## 내용 고치기

- **`src/profile.ts`**: 소개, 학력, 경력, 논문, 프로젝트, 기술
- **`src/courses.ts`**: 수강 과목과 과목별 흐름
- `[ ]`로 표시된 곳(입학년도, 학부 학교명, GitHub 아이디 등)은 직접 채우세요.

고친 뒤 `git push` 하면 자동 배포됩니다.

---

## 처음 한 번만: 배포 순서

### 1. GitHub에 올리기
```bash
cd portfolio
git init
git add .
git commit -m "init portfolio"
git branch -M main
git remote add origin https://github.com/<아이디>/portfolio.git   # GitHub에서 빈 레포 먼저 만들기
git push -u origin main
```

### 2. Cloudflare 준비 (내 컴퓨터에서)
Node.js 20 이상이 필요합니다.
```bash
npm install
npx wrangler login                      # 브라우저에서 Cloudflare 로그인
npx wrangler d1 create research-db      # 출력된 database_id를 wrangler.jsonc에 붙여넣기
npm run db:init:remote                  # 테이블 생성
npx wrangler secret put MCP_TOKEN       # 아무 긴 문자열 (연구노트·MCP 접근 키, 따로 메모해두기)
npm run deploy                          # → https://hoyeongjung.ghrnwjd.workers.dev
```
`database_id`를 바꿨으면 커밋하고 push 해두세요. (이 id는 비밀번호가 아니라 올려도 됩니다.)

### 3. GitHub 자동 배포 연결
Cloudflare 대시보드 → **Workers & Pages** → `hoyeongjung` → **Settings** → **Builds** → **Connect** → GitHub 레포 선택
- Build command: 비워두기
- Deploy command: `npx wrangler deploy`

이후 main에 push 할 때마다 자동 배포됩니다. `MCP_TOKEN`은 2번에서 넣은 값이 그대로 유지됩니다.

### 4. Claude에 MCP 등록
**Claude Code**
```bash
claude mcp add --transport http research https://hoyeongjung.ghrnwjd.workers.dev/mcp \
  --header "Authorization: Bearer <MCP_TOKEN>"
```
**Claude 앱 (설정 → 커넥터 → 커스텀 커넥터 추가)**: 헤더를 넣을 수 없어서 URL에 키를 붙입니다.
```
https://hoyeongjung.ghrnwjd.workers.dev/mcp?key=<MCP_TOKEN>
```
> 키가 들어간 URL은 남에게 보여주지 마세요.

---

## 연구노트 쓰는 법

Claude에게 말하면 됩니다.
- "오늘 온디바이스AI 수업에서 AWQ 실습한 거 연구노트에 기록해줘" → **비공개**로 저장 (`/notes`에서만 보임)
- "이거 공개로 기록해줘" → 메인과 `/projects`에도 노출
- "어제 기록 3번 공개로 바꿔줘" → `set_public`

| MCP 툴 | 하는 일 |
|---|---|
| `add_note` | 기록 추가 (project, content, stage, date, public) |
| `list_notes` | 최신순 조회 |
| `set_public` | 공개/비공개 전환 |
| `delete_note` | 삭제 |

`/notes`는 처음 열 때 접근 키(`MCP_TOKEN`)를 물어보고, 한 번 입력하면 30일 동안 유지됩니다.

## 로컬에서 미리 보기
```bash
echo 'MCP_TOKEN=dev' > .dev.vars
npm run db:init:local
npm run dev                             # http://localhost:8787
```

## 개인 도메인 (선택)
Cloudflare에서 도메인을 사고 → Worker → **Settings → Domains & Routes → Add Custom Domain**.

## 무료 플랜 한도
- Workers: 하루 10만 요청
- D1: 5GB, 하루 500만 행 읽기
- Durable Objects(SQLite): 무료 플랜 사용 가능
# portfolio
