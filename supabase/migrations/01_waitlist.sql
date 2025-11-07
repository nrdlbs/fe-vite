-- Create table to store waitlist emails
create table if not exists public.waitlist_subscribers (
    id uuid primary key default gen_random_uuid(),
    email text not null unique,
    source text,
    user_agent text,
    ip inet,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Helpful index for lookup
create index if not exists idx_waitlist_email on public.waitlist_subscribers (email);

-- Enable RLS with a permissive insert function-only pattern
alter table public.waitlist_subscribers enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'waitlist_subscribers' and policyname = 'Allow read for anon'
  ) then
    create policy "Allow read for anon" on public.waitlist_subscribers for select to anon using (true);
  end if;
end $$;


