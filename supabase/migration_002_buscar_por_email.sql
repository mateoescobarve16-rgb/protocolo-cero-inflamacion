-- Ejecutar en el SQL Editor del dashboard de Supabase, DESPUÉS de haber corrido schema.sql.
--
-- Permite la función "Ver mi plan": buscar el último diagnóstico de una persona por su
-- correo, sin necesitar login. No se abre una policy de SELECT sobre toda la tabla —
-- en vez de eso, esta función (SECURITY DEFINER) solo devuelve, para un email exacto,
-- el reporte más reciente. Aun así, cualquiera que conozca (o adivine) un correo puede
-- ver ese reporte: es el trade-off inherente a no tener autenticación real.

create or replace function public.obtener_ultimo_diagnostico(p_email text)
returns table (
  reporte_texto text,
  requiere_derivacion boolean,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    d.reporte_texto,
    coalesce((d.resultado->>'requiere_derivacion')::boolean, false) as requiere_derivacion,
    d.created_at
  from public.diagnosticos d
  where lower(d.email) = lower(p_email)
  order by d.created_at desc
  limit 1;
$$;

revoke all on function public.obtener_ultimo_diagnostico(text) from public;
grant execute on function public.obtener_ultimo_diagnostico(text) to anon;
