-- Ejecutar en el SQL Editor del dashboard de Supabase, DESPUÉS de migration_002.
--
-- Actualiza obtener_ultimo_diagnostico para devolver también "respuestas" y "resultado"
-- (las columnas jsonb completas), no solo el texto plano. Esto permite que "Ver mi
-- resultado" (búsqueda por email) reconstruya la misma vista rica (secciones, gráfico
-- de puntajes, gauges de agua/sueño) que se muestra justo al terminar el cuestionario,
-- en vez de un texto plano sin formato.

-- Postgres no permite cambiar el tipo de retorno de una función existente con
-- "create or replace" (el shape de columnas de migration_002 era distinto) — hay que
-- borrarla primero.
drop function if exists public.obtener_ultimo_diagnostico(text);

create or replace function public.obtener_ultimo_diagnostico(p_email text)
returns table (
  reporte_texto text,
  respuestas jsonb,
  resultado jsonb,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    d.reporte_texto,
    d.respuestas,
    d.resultado,
    d.created_at
  from public.diagnosticos d
  where lower(d.email) = lower(p_email)
  order by d.created_at desc
  limit 1;
$$;

revoke all on function public.obtener_ultimo_diagnostico(text) from public;
grant execute on function public.obtener_ultimo_diagnostico(text) to anon;
