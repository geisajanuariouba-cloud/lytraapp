
-- Cria usuário de demonstração teste@lytra.app com assinatura ativa vitalícia.
-- Idempotente: faz upsert se já existir.
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'teste@lytra.app';

  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email,
      encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token,
      email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_user_id, 'authenticated', 'authenticated', 'teste@lytra.app',
      crypt('Lytra123!', gen_salt('bf')),
      now(),
      jsonb_build_object('provider','email','providers', jsonb_build_array('email')),
      jsonb_build_object('full_name','Usuário Demo Lytra'),
      now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, identity_data, provider, provider_id,
      last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id,
      jsonb_build_object('sub', v_user_id::text, 'email', 'teste@lytra.app', 'email_verified', true),
      'email', v_user_id::text,
      now(), now(), now()
    );
  ELSE
    UPDATE auth.users
       SET encrypted_password = crypt('Lytra123!', gen_salt('bf')),
           email_confirmed_at = COALESCE(email_confirmed_at, now()),
           updated_at = now()
     WHERE id = v_user_id;
  END IF;

  INSERT INTO public.profiles (id, full_name, active, onboarded)
    VALUES (v_user_id, 'Usuário Demo Lytra', true, false)
    ON CONFLICT (id) DO UPDATE SET active = true, full_name = EXCLUDED.full_name;

  INSERT INTO public.progress (user_id)
    VALUES (v_user_id)
    ON CONFLICT DO NOTHING;

  INSERT INTO public.subscriptions (user_id, email, status, plan, started_at, expires_at)
    VALUES (v_user_id, 'teste@lytra.app', 'active', 'lifetime', now(), NULL)
    ON CONFLICT (user_id) DO UPDATE
      SET status = 'active', plan = 'lifetime', expires_at = NULL, updated_at = now();
END
$$;
