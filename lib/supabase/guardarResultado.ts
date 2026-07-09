import { crearClienteSupabase } from './client';
import type { Respuestas, ResultadoPerfil } from '../scoring/tipos';

export async function guardarResultado(
  respuestas: Respuestas,
  resultado: ResultadoPerfil,
  reporte_texto: string
) {
  const supabase = crearClienteSupabase();
  const { error } = await supabase.from('diagnosticos').insert({
    nombre: respuestas.nombre,
    email: respuestas.email,
    respuestas,
    resultado,
    reporte_texto,
  });

  if (error) throw error;
}
