-- Create table
create table public.waterings (
  uuid uuid not null default gen_random_uuid(),
  tree_uuid uuid not null,
  user_uuid uuid null,
  amount_liters numeric not null,
  watered_at date not null,
  created_at timestamp with time zone not null default now(),
  constraint waterings_pkey primary key (uuid),
  constraint waterings_tree_uuid_fkey foreign key (tree_uuid) references trees (uuid),
  constraint waterings_user_uuid_fkey foreign key (user_uuid) references auth.users (id)
);

-- Enable Row-Level Security (RLS)
alter table public.waterings enable row level security;

-- Policy: Allow read access for all users
create policy "Enable read access for all users"
  on public.waterings
  for select
  to public
  using (true);

-- Policy: Allow insert for all users
create policy "Enable insert for all users"
  on public.waterings
  for insert
  to public
  with check (true);

-- Policy: Allow delete only for owner
create policy "Enable delete only for owner"
  on public.waterings
  for delete
  to authenticated
  using (user_uuid = auth.uid());