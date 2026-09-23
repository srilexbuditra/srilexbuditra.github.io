PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,

  client_id TEXT NOT NULL,
  project_id TEXT,

  document_code TEXT NOT NULL UNIQUE,

  title TEXT NOT NULL,
  description TEXT,

  file_name TEXT NOT NULL,
  object_key TEXT NOT NULL UNIQUE,
  content_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL
    CHECK (size_bytes >= 0),

  status TEXT NOT NULL DEFAULT 'published'
    CHECK (status IN ('published', 'archived')),

  uploaded_by_user_id TEXT NOT NULL,

  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,

  FOREIGN KEY (client_id)
    REFERENCES clients(id)
    ON DELETE CASCADE,

  FOREIGN KEY (project_id)
    REFERENCES projects(id)
    ON DELETE SET NULL,

  FOREIGN KEY (uploaded_by_user_id)
    REFERENCES users(id)
    ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_documents_client
  ON documents(client_id, status, created_at);

CREATE INDEX IF NOT EXISTS idx_documents_project
  ON documents(project_id, status, created_at);

CREATE INDEX IF NOT EXISTS idx_documents_created
  ON documents(created_at);

CREATE INDEX IF NOT EXISTS idx_documents_status
  ON documents(status);