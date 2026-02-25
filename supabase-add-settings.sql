-- Run this in Supabase SQL Editor → New Query

create table if not exists settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz default now()
);

-- Enable RLS
alter table settings enable row level security;

-- Public can read settings
create policy "Public read settings" on settings for select using (true);

-- Default: bot overlay is off (empty = no overlay)
insert into settings (key, value) values ('bot_overlay', '') on conflict do nothing;
