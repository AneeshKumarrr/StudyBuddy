-- StudyBuddy Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Users table
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Pets table
create table pets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  species text not null check (species in ('cat', 'dog', 'rabbit', 'bird', 'fish')),
  level int not null default 1 check (level >= 1),
  xp int not null default 0 check (xp >= 0),
  coins int not null default 0 check (coins >= 0),
  cosmetics jsonb not null default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id) -- One pet per user
);

-- Sessions table
create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  started_at timestamptz not null,
  ended_at timestamptz,
  planned_minutes int not null check (planned_minutes > 0),
  effective_minutes int default 0 check (effective_minutes >= 0),
  unfocused_seconds int default 0 check (unfocused_seconds >= 0),
  status text check (status in ('active','completed','abandoned')) default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- XP Events table
create table xp_events (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid references pets(id) on delete cascade not null,
  session_id uuid references sessions(id),
  amount int not null check (amount > 0),
  reason text not null,
  created_at timestamptz default now()
);

-- Items table (food and cosmetics)
create table items (
  id uuid primary key default gen_random_uuid(),
  sku text unique not null,
  type text check (type in ('food','cosmetic')) not null,
  name text not null,
  description text,
  cost int not null check (cost >= 0),
  meta jsonb not null default '{}',
  created_at timestamptz default now()
);

-- Inventory table
create table inventories (
  user_id uuid references users(id) on delete cascade not null,
  item_id uuid references items(id) on delete restrict not null,
  qty int not null default 0 check (qty >= 0),
  primary key (user_id, item_id)
);

-- User streaks table
create table user_streaks (
  user_id uuid references users(id) on delete cascade primary key,
  current_streak int not null default 0 check (current_streak >= 0),
  longest_streak int not null default 0 check (longest_streak >= 0),
  last_activity_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for better performance
create index idx_pets_user_id on pets(user_id);
create index idx_sessions_user_id on sessions(user_id);
create index idx_sessions_started_at on sessions(started_at);
create index idx_xp_events_pet_id on xp_events(pet_id);
create index idx_xp_events_created_at on xp_events(created_at);
create index idx_inventories_user_id on inventories(user_id);

-- Row Level Security (RLS) policies
alter table users enable row level security;
alter table pets enable row level security;
alter table sessions enable row level security;
alter table xp_events enable row level security;
alter table inventories enable row level security;
alter table user_streaks enable row level security;

-- Users can only see their own data
create policy "Users can view own profile" on users
  for select using (auth.uid() = id);

create policy "Users can update own profile" on users
  for update using (auth.uid() = id);

-- Pets policies
create policy "Users can view own pets" on pets
  for select using (auth.uid() = user_id);

create policy "Users can update own pets" on pets
  for update using (auth.uid() = user_id);

create policy "Users can insert own pets" on pets
  for insert with check (auth.uid() = user_id);

-- Sessions policies
create policy "Users can view own sessions" on sessions
  for select using (auth.uid() = user_id);

create policy "Users can insert own sessions" on sessions
  for insert with check (auth.uid() = user_id);

create policy "Users can update own sessions" on sessions
  for update using (auth.uid() = user_id);

-- XP Events policies
create policy "Users can view own xp events" on xp_events
  for select using (
    exists (
      select 1 from pets 
      where pets.id = xp_events.pet_id 
      and pets.user_id = auth.uid()
    )
  );

create policy "Users can insert own xp events" on xp_events
  for insert with check (
    exists (
      select 1 from pets 
      where pets.id = xp_events.pet_id 
      and pets.user_id = auth.uid()
    )
  );

-- Inventory policies
create policy "Users can view own inventory" on inventories
  for select using (auth.uid() = user_id);

create policy "Users can update own inventory" on inventories
  for update using (auth.uid() = user_id);

create policy "Users can insert own inventory" on inventories
  for insert with check (auth.uid() = user_id);

-- User streaks policies
create policy "Users can view own streaks" on user_streaks
  for select using (auth.uid() = user_id);

create policy "Users can update own streaks" on user_streaks
  for update using (auth.uid() = user_id);

create policy "Users can insert own streaks" on user_streaks
  for insert with check (auth.uid() = user_id);

-- Functions for common operations

-- Function to calculate level from XP
create or replace function calculate_level_from_xp(xp_amount int)
returns int as $$
begin
  -- Level requirement: req(level) = round(50 * level^1.6)
  return (
    select coalesce(max(level), 1)
    from (
      select level, round(50 * power(level, 1.6)) as required_xp
      from generate_series(1, 100) as level
    ) as levels
    where required_xp <= xp_amount
  );
end;
$$ language plpgsql;

-- Function to calculate XP required for a level
create or replace function calculate_xp_required_for_level(level_num int)
returns int as $$
begin
  return round(50 * power(level_num, 1.6));
end;
$$ language plpgsql;

-- Function to add XP to a pet
create or replace function add_xp_to_pet(
  pet_uuid uuid,
  xp_amount int,
  reason_text text,
  session_uuid uuid default null
)
returns void as $$
declare
  old_level int;
  new_level int;
  new_xp int;
begin
  -- Get current pet data
  select level, xp into old_level, new_xp
  from pets
  where id = pet_uuid;
  
  -- Add XP
  new_xp := new_xp + xp_amount;
  
  -- Calculate new level
  new_level := calculate_level_from_xp(new_xp);
  
  -- Update pet
  update pets
  set xp = new_xp, level = new_level, updated_at = now()
  where id = pet_uuid;
  
  -- Add coins for level up
  if new_level > old_level then
    update pets
    set coins = coins + (10 * (new_level - old_level))
    where id = pet_uuid;
  end if;
  
  -- Log XP event
  insert into xp_events (pet_id, session_id, amount, reason)
  values (pet_uuid, session_uuid, xp_amount, reason_text);
end;
$$ language plpgsql;

-- Function to update user streak
create or replace function update_user_streak(user_uuid uuid)
returns void as $$
declare
  today date := current_date;
  yesterday date := current_date - interval '1 day';
  current_streak int;
  last_activity date;
begin
  -- Get current streak data
  select current_streak, last_activity_date
  into current_streak, last_activity
  from user_streaks
  where user_id = user_uuid;
  
  -- If no streak record exists, create one
  if not found then
    insert into user_streaks (user_id, current_streak, longest_streak, last_activity_date)
    values (user_uuid, 1, 1, today);
    return;
  end if;
  
  -- Update streak logic
  if last_activity = yesterday then
    -- Consecutive day, increment streak
    update user_streaks
    set current_streak = current_streak + 1,
        longest_streak = greatest(longest_streak, current_streak + 1),
        last_activity_date = today,
        updated_at = now()
    where user_id = user_uuid;
  elsif last_activity = today then
    -- Already updated today, do nothing
    return;
  else
    -- Streak broken, reset to 1
    update user_streaks
    set current_streak = 1,
        last_activity_date = today,
        updated_at = now()
    where user_id = user_uuid;
  end if;
end;
$$ language plpgsql;

-- Insert default items
insert into items (sku, type, name, description, cost, meta) values
('food_basic', 'food', 'Basic Food', 'Simple pet food that gives 5 XP', 10, '{"xp_gain": 5}'),
('food_premium', 'food', 'Premium Food', 'High-quality food that gives 15 XP', 25, '{"xp_gain": 15}'),
('food_special', 'food', 'Special Treat', 'Rare treat that gives 30 XP', 50, '{"xp_gain": 30}'),
('hat_red', 'cosmetic', 'Red Hat', 'A stylish red hat for your pet', 20, '{"slot": "hat", "color": "red"}'),
('hat_blue', 'cosmetic', 'Blue Hat', 'A cool blue hat for your pet', 20, '{"slot": "hat", "color": "blue"}'),
('collar_gold', 'cosmetic', 'Gold Collar', 'A fancy gold collar', 30, '{"slot": "collar", "color": "gold"}'),
('toy_ball', 'cosmetic', 'Ball Toy', 'A fun ball for your pet to play with', 15, '{"slot": "toy", "type": "ball"}');

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger update_users_updated_at before update on users
  for each row execute function update_updated_at_column();

create trigger update_pets_updated_at before update on pets
  for each row execute function update_updated_at_column();

create trigger update_sessions_updated_at before update on sessions
  for each row execute function update_updated_at_column();

create trigger update_user_streaks_updated_at before update on user_streaks
  for each row execute function update_updated_at_column();
