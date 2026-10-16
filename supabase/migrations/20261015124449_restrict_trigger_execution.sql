-- Internal DDL event trigger: application roles never need direct execution.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
