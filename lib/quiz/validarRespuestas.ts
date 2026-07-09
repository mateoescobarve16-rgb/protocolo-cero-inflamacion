import { PREGUNTAS, TODAS_LAS_PREGUNTAS_IDS } from './preguntas';

/** Devuelve los IDs de pregunta cuya respuesta falta o está vacía. Vacío = todo presente. */
export function validarRespuestas(body: Record<string, unknown>): string[] {
  const faltantes: string[] = [];

  for (const id of TODAS_LAS_PREGUNTAS_IDS) {
    const pregunta = PREGUNTAS[id];
    const valor = body[id];

    if (pregunta.tipo === 'multi') {
      if (!Array.isArray(valor) || valor.length === 0) faltantes.push(id);
    } else {
      if (typeof valor !== 'string' || valor.trim() === '') faltantes.push(id);
    }
  }

  return faltantes;
}
