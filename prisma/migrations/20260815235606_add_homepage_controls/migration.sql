-- Add image_fit and image_position columns to services
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_fit TEXT NOT NULL DEFAULT 'cover';
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_position TEXT NOT NULL DEFAULT 'center';

-- Create media_library table
CREATE TABLE IF NOT EXISTS media_library (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  url TEXT NOT NULL,
  alt_text TEXT,
  filename TEXT,
  file_size INTEGER,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_media_library_filename ON media_library(filename);

-- Add homepage image settings to site_settings if not present
INSERT INTO site_settings (key, value) VALUES
  ('hero_image_url', ''),
  ('about_image_url', ''),
  ('featured_work_heading', '')
ON CONFLICT (key) DO NOTHING;
