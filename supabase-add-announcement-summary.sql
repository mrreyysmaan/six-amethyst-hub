-- Run in Supabase SQL Editor (New Query)
-- Adds a short summary/description for announcement cards (AI-generated or manual).

alter table announcements
add column if not exists summary text default '';

comment on column announcements.summary is 'Short description shown on card (collapsed). Full text remains in body.';
