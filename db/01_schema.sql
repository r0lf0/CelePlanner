CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS events (
  event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gcal_id TEXT UNIQUE,
  event_date DATE NOT NULL,
  title TEXT NOT NULL,
  location TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed',
  notes TEXT,
  created_utc TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_utc TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS ix_events_date   ON events(event_date);
CREATE INDEX IF NOT EXISTS ix_events_status ON events(status);

CREATE TABLE IF NOT EXISTS event_showtimes (
  event_id UUID REFERENCES events(event_id) ON DELETE CASCADE,
  idx SMALLINT NOT NULL,
  show_time TIME NOT NULL,
  PRIMARY KEY (event_id, idx)
);

CREATE TABLE IF NOT EXISTS event_show_stage_managers (
  event_id UUID REFERENCES events(event_id) ON DELETE CASCADE,
  idx SMALLINT NOT NULL,
  person_id UUID REFERENCES persons(person_id),
  PRIMARY KEY (event_id, idx)
);

CREATE TABLE IF NOT EXISTS event_phase_times (
  event_id UUID REFERENCES events(event_id) ON DELETE CASCADE,
  phase TEXT NOT NULL CHECK (phase IN ('setup','show','teardown')),
  tech_call_time TIME,
  loaders_call_time TIME,
  loaders_quantity INT NOT NULL DEFAULT 0,
  PRIMARY KEY (event_id, phase)
);

CREATE TABLE IF NOT EXISTS persons (
  person_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  internal BOOLEAN NOT NULL DEFAULT FALSE,
  note TEXT
);
CREATE INDEX IF NOT EXISTS ix_persons_name ON persons(name);

CREATE TABLE IF NOT EXISTS event_staff_assignments (
  event_id UUID REFERENCES events(event_id) ON DELETE CASCADE,
  phase TEXT NOT NULL CHECK (phase IN ('setup','show','teardown')),
  role  TEXT NOT NULL CHECK (role IN ('stagehand','electrician','sound')),
  person_id UUID REFERENCES persons(person_id) ON DELETE CASCADE,
  is_stage_manager BOOLEAN NOT NULL DEFAULT FALSE,
  note TEXT,
  PRIMARY KEY (event_id, phase, role, person_id)
);
CREATE INDEX IF NOT EXISTS ix_assign_sm ON event_staff_assignments(event_id) WHERE is_stage_manager = true;

CREATE TABLE IF NOT EXISTS attachments (
  attachment_id BIGSERIAL PRIMARY KEY,
  event_id UUID REFERENCES events(event_id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('image','video','doc','other')),
  file_name TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  path_rel TEXT NOT NULL,
  uploaded_utc TIMESTAMPTZ NOT NULL DEFAULT now(),
  uploader_user_id UUID
);

CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('viewer','editor','admin')),
  PRIMARY KEY (user_id, role)
);

CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  expires_utc TIMESTAMPTZ NOT NULL
);
