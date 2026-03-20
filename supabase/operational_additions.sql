alter table properties
  add column if not exists hoa_fee numeric(12,2),
  add column if not exists taxes_yearly numeric(12,2),
  add column if not exists commission_percent numeric(5,2),
  add column if not exists weekend_rate numeric(12,2),
  add column if not exists weekly_rate numeric(12,2),
  add column if not exists monthly_rate numeric(12,2),
  add column if not exists damage_deposit numeric(12,2) default 0,
  add column if not exists extra_guest_fee numeric(12,2) default 0,
  add column if not exists max_nights integer,
  add column if not exists check_in_time text,
  add column if not exists check_out_time text,
  add column if not exists cancellation_policy text,
  add column if not exists house_rules text;

create table if not exists seasonal_rates (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  season_name text not null,
  start_date date not null,
  end_date date not null,
  nightly_rate numeric(12,2) not null,
  weekend_rate numeric(12,2),
  min_nights integer default 1,
  created_at timestamptz default now()
);

create table if not exists blocked_dates (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  reason text,
  source text default 'manual',
  created_at timestamptz default now()
);

create table if not exists channel_connections (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  channel_name text not null,
  external_listing_id text,
  sync_enabled boolean default false,
  last_sync_at timestamptz,
  created_at timestamptz default now()
);
