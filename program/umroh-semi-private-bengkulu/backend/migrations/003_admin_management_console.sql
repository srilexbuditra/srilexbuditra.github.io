ALTER TABLE umroh_accounts ADD COLUMN display_name TEXT;
ALTER TABLE umroh_accounts ADD COLUMN job_title TEXT;
UPDATE umroh_accounts SET display_name = 'Srilex Buditra', job_title = 'Senior Full Stack Developer · Platform Architect', updated_at = CURRENT_TIMESTAMP WHERE username = 'srilexbuditra' AND role = 'super_admin';
CREATE TABLE IF NOT EXISTS umroh_admin_audit_log (id INTEGER PRIMARY KEY AUTOINCREMENT, actor_account_id INTEGER, action TEXT NOT NULL, target_account_id INTEGER, details_json TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (actor_account_id) REFERENCES umroh_accounts(id) ON DELETE SET NULL, FOREIGN KEY (target_account_id) REFERENCES umroh_accounts(id) ON DELETE SET NULL);
CREATE INDEX IF NOT EXISTS idx_umroh_admin_audit_actor ON umroh_admin_audit_log(actor_account_id, created_at);
CREATE INDEX IF NOT EXISTS idx_umroh_admin_audit_target ON umroh_admin_audit_log(target_account_id, created_at);
