import { NextRequest, NextResponse } from 'next/server';
import { crearClienteSupabase } from '@/lib/supabase/client';

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

  return NextResponse.json({
    encontrado: true,
    reporte_texto: fila.reporte_texto,
    requiere_derivacion: fila.requiere_derivacion,
  });
}
