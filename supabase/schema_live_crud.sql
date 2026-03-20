create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  display_name text,
  role text not null default 'guest' check (role in ('guest','owner','realtor','admin')),
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  listing_type text not null check (listing_type in ('rental','sale')),
  status text not null default 'draft',
  title text not null,
  subtitle text,
  description text,
  location text,
  view_type text,
  bedrooms numeric(4,1) default 0,
  bathrooms numeric(4,1) default 0,
  sqm integer default 0,
  sqft integer default 0,
  parking integer default 0,
  level_label text,
  price_sale numeric(12,2),
  nightly_rate numeric(12,2),
  cleaning_fee numeric(12,2) default 0,
  min_nights integer default 1,
  max_guests integer default 1,
  instant_book boolean default false,
  image_url text,
  image_path text,
  featured boolean default false,
  created_by uuid references profiles(id),
  assigned_owner_id uuid references profiles(id),
  assigned_realtor_id uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists property_amenities (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  amenity text not null
);

create table if not exists property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  image_url text not null,
  image_path text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  guest_profile_id uuid references profiles(id),
  guest_name text not null,
  guest_email text,
  guest_phone text,
  check_in date not null,
  check_out date not null,
  nights integer not null default 1,
  guests integer not null default 1,
  include_cleaning boolean default true,
  include_insurance boolean default false,
  include_transfer boolean default false,
  subtotal numeric(12,2) default 0,
  total_amount numeric(12,2) default 0,
  source text default 'direct',
  status text default 'pending',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists sales_leads (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete set null,
  lead_name text not null,
  lead_email text,
  lead_phone text,
  budget_text text,
  source text default 'website',
  status text default 'new',
  notes text,
  assigned_realtor_id uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists owner_statements (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  property_id uuid references properties(id) on delete cascade,
  statement_month date not null,
  gross_revenue numeric(12,2) default 0,
  fees numeric(12,2) default 0,
  payout_amount numeric(12,2) default 0,
  notes text,
  created_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'guest')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table profiles enable row level security;
alter table properties enable row level security;
alter table property_amenities enable row level security;
alter table property_images enable row level security;
alter table bookings enable row level security;
alter table sales_leads enable row level security;
alter table owner_statements enable row level security;

drop policy if exists "profiles_select_self_or_admin" on profiles;
create policy "profiles_select_self_or_admin" on profiles
for select using (
  auth.uid() = id
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

drop policy if exists "profiles_update_self_or_admin" on profiles;
create policy "profiles_update_self_or_admin" on profiles
for update using (
  auth.uid() = id
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

drop policy if exists "properties_public_read" on properties;
create policy "properties_public_read" on properties
for select using (status <> 'archived');

drop policy if exists "properties_admin_realtor_owner_write" on properties;
create policy "properties_admin_realtor_owner_write" on properties
for all using (
  exists (
    select 1 from profiles p
    where p.id = auth.uid()
      and (
        p.role = 'admin'
        or p.role = 'realtor'
        or properties.assigned_owner_id = auth.uid()
      )
  )
)
with check (
  exists (
    select 1 from profiles p
    where p.id = auth.uid()
      and (
        p.role = 'admin'
        or p.role = 'realtor'
        or assigned_owner_id = auth.uid()
      )
  )
);

drop policy if exists "amenities_admin_realtor_owner" on property_amenities;
create policy "amenities_admin_realtor_owner" on property_amenities
for all using (
  exists (
    select 1
    from properties pr
    join profiles p on p.id = auth.uid()
    where pr.id = property_amenities.property_id
      and (p.role = 'admin' or p.role = 'realtor' or pr.assigned_owner_id = auth.uid())
  )
)
with check (
  exists (
    select 1
    from properties pr
    join profiles p on p.id = auth.uid()
    where pr.id = property_amenities.property_id
      and (p.role = 'admin' or p.role = 'realtor' or pr.assigned_owner_id = auth.uid())
  )
);

drop policy if exists "images_admin_realtor_owner" on property_images;
create policy "images_admin_realtor_owner" on property_images
for all using (
  exists (
    select 1
    from properties pr
    join profiles p on p.id = auth.uid()
    where pr.id = property_images.property_id
      and (p.role = 'admin' or p.role = 'realtor' or pr.assigned_owner_id = auth.uid())
  )
)
with check (
  exists (
    select 1
    from properties pr
    join profiles p on p.id = auth.uid()
    where pr.id = property_images.property_id
      and (p.role = 'admin' or p.role = 'realtor' or pr.assigned_owner_id = auth.uid())
  )
);

drop policy if exists "bookings_guest_insert_public" on bookings;
create policy "bookings_guest_insert_public" on bookings
for insert with check (true);

drop policy if exists "bookings_guest_or_staff_read" on bookings;
create policy "bookings_guest_or_staff_read" on bookings
for select using (
  guest_profile_id = auth.uid()
  or exists (
    select 1
    from properties pr
    join profiles p on p.id = auth.uid()
    where pr.id = bookings.property_id
      and (p.role = 'admin' or p.role = 'realtor' or pr.assigned_owner_id = auth.uid())
  )
);

drop policy if exists "bookings_staff_update" on bookings;
create policy "bookings_staff_update" on bookings
for update using (
  exists (
    select 1
    from properties pr
    join profiles p on p.id = auth.uid()
    where pr.id = bookings.property_id
      and (p.role = 'admin' or p.role = 'realtor' or pr.assigned_owner_id = auth.uid())
  )
);

drop policy if exists "sales_leads_public_insert" on sales_leads;
create policy "sales_leads_public_insert" on sales_leads
for insert with check (true);

drop policy if exists "sales_leads_staff_read_write" on sales_leads;
create policy "sales_leads_staff_read_write" on sales_leads
for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','realtor'))
)
with check (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','realtor'))
);

drop policy if exists "owner_statements_owner_or_admin" on owner_statements;
create policy "owner_statements_owner_or_admin" on owner_statements
for select using (
  owner_id = auth.uid()
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

drop policy if exists "owner_statements_admin_write" on owner_statements;
create policy "owner_statements_admin_write" on owner_statements
for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
)
with check (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
