import { obtenerBloqueDePregunta } from './preguntas';

export type Paso =
  | { tipo: 'pregunta'; preguntaId: string }
  | { tipo: 'datos-personales' }
  | { tipo: 'habitos-generales' };

/**
 * Secuencia de pantallas del wizard. La mayoría son 1 pregunta = 1 pantalla,
 * pero "datos-personales" (nombre+email) y "habitos-generales"
 * (p12, p13, p18, p19) se muestran agrupadas en una sola pantalla.
 */
export const PASOS: Paso[] = [
  { tipo: 'datos-personales' },
  { tipo: 'pregunta', preguntaId: 'p3' },
  { tipo: 'pregunta', preguntaId: 'p4' },
  { tipo: 'pregunta', preguntaId: 'p5' },
  { tipo: 'pregunta', preguntaId: 'p6' },
  { tipo: 'pregunta', preguntaId: 'p7' },
  { tipo: 'pregunta', preguntaId: 'p8' },
  { tipo: 'pregunta', preguntaId: 'p9' },
  { tipo: 'pregunta', preguntaId: 'p10' },
  { tipo: 'pregunta', preguntaId: 'p11' },
  { tipo: 'habitos-generales' },
  { tipo: 'pregunta', preguntaId: 'p14' },
  { tipo: 'pregunta', preguntaId: 'p15' },
  { tipo: 'pregunta', preguntaId: 'p16' },
  { tipo: 'pregunta', preguntaId: 'p17' },
  { tipo: 'pregunta', preguntaId: 'p20' },
  { tipo: 'pregunta', preguntaId: 'p21' },
  { tipo: 'pregunta', preguntaId: 'p22' },
];

export const IDS_HABITOS_GENERALES = ['p12', 'p13', 'p18', 'p19'] as const;

export function tituloDePaso(paso: Paso): string {
  if (paso.tipo === 'datos-personales') return 'Datos personales';
  if (paso.tipo === 'habitos-generales') return 'Hábitos generales';
  return obtenerBloqueDePregunta(paso.preguntaId).titulo;
}
