-- Ejecutar en el SQL Editor del dashboard de Supabase (proyecto wqzuvkqutmumwpeuqfyr).

create table if not exists public.diagnosticos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nombre text not null,
  email text not null,
  respuestas jsonb not null,
  resultado jsonb not null,
  reporte_texto text not null
);

alter table public.diagnosticos enable row level security;

-- Permite que el formulario público inserte resultados (rol "anon", el que usa la publishable key).
create policy "Cualquiera puede insertar un diagnostico"
  on public.diagnosticos
  for insert
  to anon
  with check (true);

-- No se crea policy de SELECT/UPDATE/DELETE para "anon": nadie puede leer ni modificar
-- diagnósticos ajenos desde el cliente. Para consultarlos, usa el dashboard de Supabase
-- (Table Editor) o una service role key desde un entorno de confianza.
