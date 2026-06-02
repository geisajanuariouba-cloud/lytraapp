
-- 1. user_roles: deny self-assignment; only admins (or service_role) can write
CREATE POLICY "Only admins can insert roles"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles"
ON public.user_roles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 2. relapses: allow owner update/delete
CREATE POLICY "relapses_update_own"
ON public.relapses FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "relapses_delete_own"
ON public.relapses FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- 3. support_tickets: allow owner update/delete
CREATE POLICY "tickets_update_own"
ON public.support_tickets FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tickets_delete_own"
ON public.support_tickets FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- 4. Restrict EXECUTE on has_role to server roles only
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
