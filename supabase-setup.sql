-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- 1. Announcements table
create table if not exists announcements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  body text not null,
  tag text not null default 'general',
  deadline date,
  form_url text,
  pinned boolean default false,
  created_at timestamptz default now()
);

-- 2. Attendance Posters table
create table if not exists attendance_posters (
  id uuid default gen_random_uuid() primary key,
  month_label text not null,
  image_url text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- 3. Gallery Photos table
create table if not exists gallery_photos (
  id uuid default gen_random_uuid() primary key,
  image_url text not null,
  caption text,
  uploader_name text,
  approved boolean default false,
  created_at timestamptz default now()
);

-- 4. Timetable table
create table if not exists timetable (
  id uuid default gen_random_uuid() primary key,
  image_url text not null,
  updated_at timestamptz default now()
);

-- 5. Enable Row Level Security (RLS) on all tables
alter table announcements enable row level security;
alter table attendance_posters enable row level security;
alter table gallery_photos enable row level security;
alter table timetable enable row level security;

-- 6. Public READ policies (anyone can read)
create policy "Public read announcements" on announcements for select using (true);
create policy "Public read attendance" on attendance_posters for select using (true);
create policy "Public read approved gallery" on gallery_photos for select using (approved = true);
create policy "Public read timetable" on timetable for select using (true);

-- 7. Storage Buckets
-- Run these one by one in SQL Editor:
insert into storage.buckets (id, name, public) values ('attendance-posters', 'attendance-posters', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('gallery-photos', 'gallery-photos', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('timetable', 'timetable', true) on conflict do nothing;

-- 8. Storage public read policies
create policy "Public read attendance-posters" on storage.objects for select using (bucket_id = 'attendance-posters');
create policy "Public read gallery-photos" on storage.objects for select using (bucket_id = 'gallery-photos');
create policy "Public read timetable" on storage.objects for select using (bucket_id = 'timetable');
