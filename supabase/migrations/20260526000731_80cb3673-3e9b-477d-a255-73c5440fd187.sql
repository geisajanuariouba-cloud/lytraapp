revoke execute on function public.handle_new_user() from anon, authenticated, public;

create policy "kiwify_orders_no_access" on public.kiwify_orders
  for all to authenticated using (false) with check (false);