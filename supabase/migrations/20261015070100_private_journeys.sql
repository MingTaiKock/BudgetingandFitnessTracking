create table public.journeys (
 user_id uuid primary key references auth.users(id) on delete cascade,
 state jsonb not null check (jsonb_typeof(state) = 'object' and coalesce(state->>'version' = '2',false) and coalesce(state->>'demo' = 'false',false)),
 revision integer not null check (revision > 0),
 updated_at timestamptz not null default now()
);
alter table public.journeys enable row level security;
revoke all on public.journeys from anon, authenticated;
grant select, insert, update on public.journeys to authenticated;
create policy "Read own journey" on public.journeys for select to authenticated using ((select auth.uid()) = user_id);
create policy "Create own journey" on public.journeys for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own journey" on public.journeys for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create function public.save_journey(p_owner uuid, p_state jsonb, p_expected_revision integer)
returns setof public.journeys language plpgsql security invoker set search_path = '' as $$
begin
 if auth.uid() is null or auth.uid() is distinct from p_owner then raise exception 'Account mismatch' using errcode = '42501'; end if;
 if p_expected_revision is null or p_expected_revision < 0
 or jsonb_typeof(p_state) is distinct from 'object'
 or p_state->>'version' is distinct from '2'
 or p_state->>'demo' is distinct from 'false'
 or octet_length(p_state::text) > 2097152 then raise exception 'Invalid journey'; end if;
 if p_expected_revision = 0 then
  return query insert into public.journeys(user_id,state,revision) values (auth.uid(),p_state,1) on conflict(user_id) do nothing returning *;
 else
  return query update public.journeys set state=p_state,revision=revision+1,updated_at=now()
   where user_id=auth.uid() and revision=p_expected_revision returning *;
 end if;
end;
$$;
revoke all on function public.save_journey(uuid,jsonb,integer) from public, anon;
grant execute on function public.save_journey(uuid,jsonb,integer) to authenticated;
