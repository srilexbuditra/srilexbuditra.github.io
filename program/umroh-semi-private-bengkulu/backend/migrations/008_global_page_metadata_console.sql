-- V3.9.0 Step 2 — Global Page Metadata Foundation
-- Additive migration only; safe to run after migration 007.
CREATE TABLE IF NOT EXISTS umroh_page_meta (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_key TEXT NOT NULL UNIQUE,
  page_type TEXT NOT NULL DEFAULT 'webpage',
  page_path TEXT NOT NULL UNIQUE,
  seo_title TEXT NOT NULL DEFAULT '',
  meta_description TEXT NOT NULL DEFAULT '',
  canonical_url TEXT,
  robots TEXT NOT NULL DEFAULT 'index,follow',
  theme_color TEXT NOT NULL DEFAULT '#0b2830',
  og_type TEXT NOT NULL DEFAULT 'website',
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image_url TEXT,
  banner_url TEXT,
  banner_object_key TEXT,
  thumbnail_url TEXT,
  thumbnail_object_key TEXT,
  image_alt TEXT,
  image_caption TEXT,
  schema_type TEXT NOT NULL DEFAULT 'WebPage',
  schema_json TEXT,
  author_name TEXT,
  publisher_name TEXT,
  locale TEXT NOT NULL DEFAULT 'id_ID',
  analytics_enabled INTEGER NOT NULL DEFAULT 1 CHECK (analytics_enabled IN (0,1)),
  analytics_scroll_enabled INTEGER NOT NULL DEFAULT 1 CHECK (analytics_scroll_enabled IN (0,1)),
  analytics_cta_enabled INTEGER NOT NULL DEFAULT 1 CHECK (analytics_cta_enabled IN (0,1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_umroh_page_meta_management
ON umroh_page_meta(page_type, analytics_enabled, updated_at);
