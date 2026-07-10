import { NextRequest, NextResponse } from 'next/server';
import { crearClienteSupabase } from '@/lib/supabase/client';
import { generarReporte } from '@/lib/scoring/plantillas';
import { nombreAmigablePerfil } from '@/lib/quiz/perfilLabels';
import { etiquetaResumen, etiquetaResumenMulti } from '@/lib/quiz/preguntas';
import type { Respuestas, ResultadoPerfil } from '@/lib/scoring/tipos';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = typeof body.email === 'string' ? body.email.trim() : '';

  if (!email) {
    return NextResponse.json({ error: 'Correo requerido' }, { status: 400 });
  }

  const supabase = crearClienteSupabase();
  const { data, error } = await supabase.rpc('obtener_ultimo_diagnostico', { p_email: email });

  if (error) {
    console.error('Error buscando resultado por email:', error);
    return NextResponse.json({ error: 'No se pudo buscar el resultado' }, { status: 500 });
  }

  const fila = Array.isArray(data) ? data[0] : null;

  if (!fila) {
    return NextResponse.json({ encontrado: false });
  }

  const respuestas = fila.respuestas as Respuestas | null;
  const resultado = fila.resultado as ResultadoPerfil | null;

  if (!respuestas || !resultado) {
    return NextResponse.json({ encontrado: true, reporte_texto: fila.reporte_texto });
  }

  const reporte = generarReporte(resultado);

  return NextResponse.json({
    encontrado: true,
    reporte_texto: reporte.texto,
    secciones: reporte.secciones,
    nombre: respuestas.nombre,
    perfil: resultado.perfil,
    puntajes: resultado.puntajes,
    resumen: {
      sintomaPrincipal: etiquetaResumenMulti('p3', respuestas.p3),
      tiempoSintoma: etiquetaResumen('p4', respuestas.p4),
      nivelEstres: etiquetaResumen('p17', respuestas.p17),
      horasSueno: etiquetaResumen('p18', respuestas.p18),
      patronDominante: resultado.perfil ? nombreAmigablePerfil(resultado.perfil) : '—',
    },
    aguaId: respuestas.p12,
    suenoId: respuestas.p18,
  });
}
