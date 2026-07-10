import { NextRequest, NextResponse } from 'next/server';
import { calcularPerfil } from '@/lib/scoring/calcularPerfil';
import { generarReporte } from '@/lib/scoring/plantillas';
import { guardarResultado } from '@/lib/supabase/guardarResultado';
import { validarRespuestas } from '@/lib/quiz/validarRespuestas';
import type { Respuestas } from '@/lib/scoring/tipos';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const faltantes = validarRespuestas(body);
  if (faltantes.length > 0) {
    return NextResponse.json(
      { error: 'Faltan respuestas requeridas', campos: faltantes },
      { status: 400 }
    );
  }

  const respuestas = body as Respuestas;
  const resultado = calcularPerfil(respuestas);
  const reporte = generarReporte(resultado);

  try {
    await guardarResultado(respuestas, resultado, reporte.texto);
  } catch (error) {
    console.error('No se pudo guardar el diagnóstico en Supabase:', error);
  }

  return NextResponse.json({
    reporte_texto: reporte.texto,
    secciones: reporte.secciones,
    nota_condicion_previa: resultado.nota_condicion_previa,
    perfil: resultado.perfil,
    puntajes: resultado.puntajes,
  });
}
