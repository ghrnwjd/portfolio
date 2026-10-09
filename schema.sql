-- 연구 진행 기록 테이블
CREATE TABLE IF NOT EXISTS notes (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  project    TEXT    NOT NULL,                 -- 예: thesis, on-device-ai, capstone
  stage      TEXT    NOT NULL DEFAULT 'etc',   -- 기획/리서치/기법/실험/작성/투고/etc
  content    TEXT    NOT NULL,
  note_date  TEXT    NOT NULL,                 -- YYYY-MM-DD
  public     INTEGER NOT NULL DEFAULT 0,       -- 1이면 포트폴리오 메인에 노출
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_notes_project_date ON notes (project, note_date DESC);
CREATE INDEX IF NOT EXISTS idx_notes_public_date  ON notes (public, note_date DESC);
