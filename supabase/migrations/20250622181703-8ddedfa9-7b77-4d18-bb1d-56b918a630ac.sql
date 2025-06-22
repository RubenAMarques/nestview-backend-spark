
-- 🔹  Function: save the very first price of every new listing
create or replace function public.insert_initial_price()
returns trigger
language plpgsql
as $$
begin
  insert into public.listing_prices (listing_id, price_eur)
  values (new.id, new.price_eur);
  return new;
end;
$$;

-- 🔹  Trigger: fire AFTER INSERT on listings
do $$
begin
  -- drop any stale version first
  if exists (
    select 1 from pg_trigger
    where tgname = 'insert_price_history'
      and tgrelid = 'public.listings'::regclass
  ) then
    drop trigger insert_price_history on public.listings;
  end if;

  create trigger insert_price_history
    after insert on public.listings
    for each row execute function public.insert_initial_price();
end$$;
