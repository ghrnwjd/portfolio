import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { profile } from "./profile";
import { courses } from "./courses";
import { renderHome } from "./pages/home";
import { renderProjects } from "./pages/projects";
import { renderCourse } from "./pages/course";
import { renderIndex as renderNotes, renderLock, STAGES as RAIL } from "./pages/notes";
import type { PublicNote } from "./pages/shared";

export interface Env {
  DB: D1Database;
  MCP_OBJECT: DurableObjectNamespace;
  MCP_TOKEN: string; // `wrangler secret put MCP_TOKEN`
}

const STAGES = [...RAIL, "etc"] as [string, ...string[]];
const text = (t: string) => ({ content: [{ type: "text" as const, text: t }] });
const today = () => new Date().toISOString().slice(0, 10);

// ───────────────────────── MCP 서버 ─────────────────────────
export class ResearchMCP extends McpAgent<Env> {
  server = new McpServer({ name: "research-note", version: "0.2.0" });

  async init() {
    this.server.tool(
      "add_note",
      "연구/수업/프로젝트 진행 기록을 추가한다. public=true면 포트폴리오 메인에도 노출된다(기본 비공개).",
      {
        project: z.string().describe("프로젝트 이름 (예: thesis, on-device-ai, capstone)"),
        content: z.string().describe("기록 내용"),
        stage: z.enum(STAGES).default("etc").describe("진행 단계"),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("YYYY-MM-DD, 생략 시 오늘"),
        public: z.boolean().default(false).describe("포트폴리오에 공개할지"),
      },
      async ({ project, content, stage, date, public: pub }) => {
        const r = await this.env.DB.prepare(
          "INSERT INTO notes (project, stage, content, note_date, public) VALUES (?, ?, ?, ?, ?)"
        )
          .bind(project, stage, content, date ?? today(), pub ? 1 : 0)
          .run();
        return text(`기록 완료 (id=${r.meta.last_row_id}${pub ? ", 공개" : ""})`);
      }
    );

    this.server.tool(
      "list_notes",
      "진행 기록을 최신순으로 조회한다.",
      {
        project: z.string().optional().describe("특정 프로젝트만"),
        limit: z.number().int().min(1).max(100).default(20),
      },
      async ({ project, limit }) => {
        const stmt = project
          ? this.env.DB.prepare("SELECT * FROM notes WHERE project = ? ORDER BY note_date DESC, id DESC LIMIT ?").bind(project, limit)
          : this.env.DB.prepare("SELECT * FROM notes ORDER BY note_date DESC, id DESC LIMIT ?").bind(limit);
        const { results } = await stmt.all<any>();
        if (!results.length) return text("기록이 없습니다.");
        return text(
          results
            .map((r) => `#${r.id} [${r.note_date}] (${r.project}/${r.stage})${r.public ? " [공개]" : ""} ${r.content}`)
            .join("\n")
        );
      }
    );

    this.server.tool(
      "set_public",
      "기록의 공개 여부를 바꾼다.",
      { id: z.number().int(), public: z.boolean() },
      async ({ id, public: pub }) => {
        const r = await this.env.DB.prepare("UPDATE notes SET public = ? WHERE id = ?").bind(pub ? 1 : 0, id).run();
        return text(r.meta.changes ? `#${id} ${pub ? "공개" : "비공개"}로 변경` : `#${id} 없음`);
      }
    );

    this.server.tool("delete_note", "id로 기록을 삭제한다.", { id: z.number().int() }, async ({ id }) => {
      const r = await this.env.DB.prepare("DELETE FROM notes WHERE id = ?").bind(id).run();
      return text(r.meta.changes ? `#${id} 삭제됨` : `#${id} 없음`);
    });
  }
}

// ───────────────────────── 웹 페이지 ─────────────────────────
const html = (body: string, status = 200, extra: HeadersInit = {}) =>
  new Response(body, { status, headers: { "content-type": "text/html; charset=utf-8", ...extra } });

async function publicNotes(env: Env, limit: number): Promise<PublicNote[]> {
  try {
    const { results } = await env.DB.prepare(
      "SELECT id, project, stage, content, note_date FROM notes WHERE public = 1 ORDER BY note_date DESC, id DESC LIMIT ?"
    )
      .bind(limit)
      .all<PublicNote>();
    return results;
  } catch {
    return []; // DB 초기화 전이어도 페이지는 뜨게
  }
}

// /notes — 전체 기록(비공개 포함). 쿠키 또는 ?key= 로 접근
async function notesPage(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  const owner = profile.name;

  if (env.MCP_TOKEN) {
    const key = url.searchParams.get("key");
    if (key !== null) {
      if (key !== env.MCP_TOKEN) return html(renderLock(owner, true), 401);
      url.searchParams.delete("key");
      return new Response(null, {
        status: 303,
        headers: {
          Location: url.pathname + url.search,
          "Set-Cookie": `rk=${encodeURIComponent(key)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`,
        },
      });
    }
    const cookie = req.headers.get("Cookie")?.match(/(?:^|;\s*)rk=([^;]+)/)?.[1];
    if (!cookie || decodeURIComponent(cookie) !== env.MCP_TOKEN) return html(renderLock(owner, false), 401);
  }

  const project = url.searchParams.get("project");
  const where = project ? "WHERE project = ?" : "";
  const bind = project ? [project] : [];
  const [notes, projects, stages] = await env.DB.batch([
    env.DB.prepare(`SELECT * FROM notes ${where} ORDER BY note_date DESC, id DESC LIMIT 200`).bind(...bind),
    env.DB.prepare("SELECT project, COUNT(*) AS n FROM notes GROUP BY project ORDER BY MAX(note_date) DESC"),
    env.DB.prepare(`SELECT stage, COUNT(*) AS n FROM notes ${where} GROUP BY stage`).bind(...bind),
  ]);

  return html(
    renderNotes({
      owner,
      origin: url.origin,
      notes: notes.results as any,
      projects: projects.results as any,
      current: project,
      stageCounts: Object.fromEntries((stages.results as any[]).map((r) => [r.stage, r.n])),
    }),
    200,
    { "Cache-Control": "no-store" }
  );
}

// MCP 엔드포인트 인증: Authorization: Bearer <token> 또는 ?key=<token>
function mcpAuthorized(req: Request, env: Env): boolean {
  if (!env.MCP_TOKEN) return true; // 로컬 개발용
  const url = new URL(req.url);
  const bearer = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  return bearer === env.MCP_TOKEN || url.searchParams.get("key") === env.MCP_TOKEN;
}

const CACHE = { "Cache-Control": "public, max-age=60" };

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const { pathname } = new URL(req.url);
    const path = pathname.replace(/\/+$/, "") || "/";

    if (path === "/") return html(renderHome(await publicNotes(env, 3)), 200, CACHE);
    if (path === "/projects") return html(renderProjects(await publicNotes(env, 4)), 200, CACHE);
    if (path === "/courses") return Response.redirect(new URL(`/courses/${courses[0].slug}`, req.url).toString(), 302);
    if (path.startsWith("/courses/")) {
      const c = courses.find((x) => x.slug === path.slice("/courses/".length));
      if (c) return html(renderCourse(c), 200, CACHE);
    }
    if (path === "/notes") return notesPage(req, env);

    if (pathname.startsWith("/mcp") || pathname.startsWith("/sse")) {
      if (!mcpAuthorized(req, env)) return new Response("Unauthorized", { status: 401 });
      return pathname.startsWith("/mcp")
        ? ResearchMCP.serve("/mcp").fetch(req, env, ctx)
        : ResearchMCP.serveSSE("/sse").fetch(req, env, ctx);
    }

    return html(
      `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>없는 페이지</title><body style="font:16px/1.6 system-ui;max-width:560px;margin:20vh auto;padding:0 24px"><h1>없는 페이지입니다</h1><p><a href="/">메인으로 가기</a></p>`,
      404
    );
  },
};
