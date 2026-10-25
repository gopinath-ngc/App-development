/*
# Habits tracker schema (single-tenant, no auth)

1. Overview
This is a personal habit tracker. There is no sign-in screen, so data is intentionally
shared/public across the single tenant. The anon-key client reads and writes its own data.

2. New Tables

- `habits`
  - `id` (uuid, primary key)
  - `name` (text, not null) — the habit name
  - `sublabel` (text) — small gray subline
  - `icon_key` (text, not null) — identifier matching a Lucide icon
  - `accent` (text, not null) — accent color name (sage, coral, lavender, peach, sky, mint)
  - `sort_order` (int, default 0) — order in the list
  - `created_at` (timestamptz)

- `completions`
  - `id` (uuid, primary key)
  - `habit_id` (uuid, references habits, cascade delete)
  - `date` (date, not null) — the day the habit was completed
  - `created_at` (timestamptz)
  - Unique constraint on (habit_id, date) so a habit can be completed at most once per day.

3. Security
- Enable RLS on both tables.
- Grant CRUD to `anon` + `authenticated` so the anon-key frontend can read/write.
- Allow anon + authenticated full CRUD because the data is intentionally public/shared
  (single-tenant app, no sign-in).

4. Indexes
- Index on completions(habit_id) and completions(date) for fast lookups.
*/

CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sublabel text,
  icon_key text NOT NULL,
  accent text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON habits TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_habits" ON habits;
CREATE POLICY "anon_select_habits" ON habits FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_habits" ON habits;
CREATE POLICY "anon_insert_habits" ON habits FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_habits" ON habits;
CREATE POLICY "anon_update_habits" ON habits FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_habits" ON habits;
CREATE POLICY "anon_delete_habits" ON habits FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (habit_id, date)
);

ALTER TABLE completions ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON completions TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_completions" ON completions;
CREATE POLICY "anon_select_completions" ON completions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_completions" ON completions;
CREATE POLICY "anon_insert_completions" ON completions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_completions" ON completions;
CREATE POLICY "anon_update_completions" ON completions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_completions" ON completions;
CREATE POLICY "anon_delete_completions" ON completions FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_completions_habit_id ON completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_completions_date ON completions(date);

/*
# Seed default habits

Inserts the six default habits from the design brief if the table is empty.
*/
INSERT INTO habits (name, sublabel, icon_key, accent, sort_order)
SELECT 'Drink 8 glasses of water', 'Hydration', 'Droplets', 'sage', 1
WHERE NOT EXISTS (SELECT 1 FROM habits);

INSERT INTO habits (name, sublabel, icon_key, accent, sort_order)
SELECT '30 min workout', 'Movement', 'Dumbbell', 'coral', 2
WHERE NOT EXISTS (SELECT 1 FROM habits WHERE sort_order = 2);

INSERT INTO habits (name, sublabel, icon_key, accent, sort_order)
SELECT 'Read 20 pages', 'Learning', 'BookOpen', 'lavender', 3
WHERE NOT EXISTS (SELECT 1 FROM habits WHERE sort_order = 3);

INSERT INTO habits (name, sublabel, icon_key, accent, sort_order)
SELECT 'Meditate 10 min', 'Mindfulness', 'Sparkles', 'peach', 4
WHERE NOT EXISTS (SELECT 1 FROM habits WHERE sort_order = 4);

INSERT INTO habits (name, sublabel, icon_key, accent, sort_order)
SELECT 'Journal', 'Reflection', 'PenLine', 'sky', 5
WHERE NOT EXISTS (SELECT 1 FROM habits WHERE sort_order = 5);

INSERT INTO habits (name, sublabel, icon_key, accent, sort_order)
SELECT 'Sleep before 11pm', 'Rest', 'Moon', 'mint', 6
WHERE NOT EXISTS (SELECT 1 FROM habits WHERE sort_order = 6);
