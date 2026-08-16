CREATE TABLE IF NOT EXISTS portfolio_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  display_title TEXT,
  category TEXT,
  description TEXT,
  alt_text TEXT,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  nsfw BOOLEAN NOT NULL DEFAULT false,
  visible BOOLEAN NOT NULL DEFAULT true,
  homepage_visible BOOLEAN NOT NULL DEFAULT true,
  focal_point_x FLOAT DEFAULT 0.5,
  focal_point_y FLOAT DEFAULT 0.5,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  display_name TEXT NOT NULL,
  rating INTEGER NOT NULL,
  review_text TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  hidden BOOLEAN NOT NULL DEFAULT false,
  rejection_reason TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS commission_submissions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT NOT NULL,
  description TEXT,
  additional TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  nsfw BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS support_requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  content_type TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  admin_id TEXT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  image_fit TEXT NOT NULL DEFAULT 'cover',
  image_position TEXT NOT NULL DEFAULT 'center',
  features TEXT,
  spare_parts BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'spare_parts') THEN
    ALTER TABLE services ADD COLUMN spare_parts BOOLEAN NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'image_fit') THEN
    ALTER TABLE services ADD COLUMN image_fit TEXT NOT NULL DEFAULT 'cover';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'image_position') THEN
    ALTER TABLE services ADD COLUMN image_position TEXT NOT NULL DEFAULT 'center';
  END IF;
END $$;

INSERT INTO services (name, description, sort_order, visible, spare_parts)
VALUES
  ('Clothing Add-ons', 'Custom clothing, accessories and outfit additions for existing avatars.', 0, true, false),
  ('Complete Avatars', 'Full avatar assemblies from premade assets, tailored to your needs.', 1, true, false),
  ('Toggles', 'Avatar toggles and options for switching between different looks or states.', 2, true, true),
  ('Custom Textures', 'Custom texture work for your avatar, from subtle tweaks to full repaints.', 3, true, false),
  ('Models', '3D modelling work for avatars, accessories, and custom parts.', 4, true, true)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS site_photos (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT NOT NULL UNIQUE,
  url TEXT,
  alt_text TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

INSERT INTO site_photos (slug, alt_text) VALUES
  ('hero', 'Main hero background'),
  ('clothing-addons', 'Clothing Add-ons service image'),
  ('complete-avatars', 'Complete Avatars service image'),
  ('toggles', 'Toggles service image'),
  ('custom-textures', 'Custom Textures service image'),
  ('models', 'Models service image')
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS pricing (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  min_price DOUBLE PRECISION,
  max_price DOUBLE PRECISION,
  description TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'sfw',
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  url TEXT NOT NULL,
  alt_text TEXT,
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  mime_type TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  portfolio_item_id TEXT REFERENCES portfolio_items(id) ON DELETE CASCADE,
  service_id TEXT REFERENCES services(id) ON DELETE CASCADE,
  review_id TEXT REFERENCES reviews(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_photos_portfolio_item ON photos(portfolio_item_id);
CREATE INDEX IF NOT EXISTS idx_photos_service ON photos(service_id);
CREATE INDEX IF NOT EXISTS idx_photos_review ON photos(review_id);

ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'photos_public_select') THEN
    CREATE POLICY "photos_public_select" ON storage.objects FOR SELECT TO public USING (bucket_id = 'pannecomissions');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolio_items' AND column_name = 'alt_text') THEN
    ALTER TABLE portfolio_items ADD COLUMN alt_text TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolio_items' AND column_name = 'visible') THEN
    ALTER TABLE portfolio_items ADD COLUMN visible BOOLEAN NOT NULL DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolio_items' AND column_name = 'display_title') THEN
    ALTER TABLE portfolio_items ADD COLUMN display_title TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolio_items' AND column_name = 'category') THEN
    ALTER TABLE portfolio_items ADD COLUMN category TEXT;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolio_items' AND column_name = 'title') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolio_items' AND column_name = 'display_title') THEN
      UPDATE portfolio_items SET display_title = COALESCE(display_title, title) WHERE display_title IS NULL;
      ALTER TABLE portfolio_items DROP COLUMN title;
    ELSE
      ALTER TABLE portfolio_items RENAME COLUMN title TO display_title;
    END IF;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'rejection_reason') THEN
    ALTER TABLE reviews ADD COLUMN rejection_reason TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'hidden') THEN
    ALTER TABLE reviews ADD COLUMN hidden BOOLEAN NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'image_url') THEN
    ALTER TABLE reviews ADD COLUMN image_url TEXT;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'client_name') THEN
    ALTER TABLE reviews RENAME COLUMN client_name TO display_name;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'message') THEN
    ALTER TABLE reviews RENAME COLUMN message TO review_text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'support_requests' AND column_name = 'subject') THEN
    ALTER TABLE support_requests ADD COLUMN subject TEXT;
  END IF;
END $$;
