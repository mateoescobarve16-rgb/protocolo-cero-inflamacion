import { PESOS, UMBRAL_MINIMO, DIFERENCIA_HIBRIDO } from './pesos';
import { etiquetaOpcion } from '../quiz/preguntas';
import type { PerfilLetra, Puntajes, Respuestas, ResultadoPerfil } from './tipos';

/** Une una lista en español natural: "X", "X y Y", o "X, Y y Z". */
function unirNatural(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
}

/** Normaliza texto libre escrito por la usuaria: sin espacios de más ni mayúsculas al azar (ej. "MaNi" -> "mani"). */
function normalizarTextoLibre(texto: string): string {
  return texto.trim().replace(/\s+/g, ' ').toLowerCase();
}

/** Traduce un disparador de p9 a texto: si es "otro_disparador", usa lo que la usuaria escribió. */
function etiquetaDisparador(id: string, p9Otro: string | undefined): string {
  if (id === 'otro_disparador') {
    const normalizado = p9Otro ? normalizarTextoLibre(p9Otro) : '';
    return normalizado || 'un alimento específico';
  }
  return etiquetaOpcion('p9', id);
}

function puntajeP9(p9: string[], p10: string): Partial<Record<'A' | 'E', number>> {
  const scores: Partial<Record<'A' | 'E', number>> = {};
  if (p9.length === 1 && p10 !== 'no_diagnosticada') {
    scores.E = 3;
  } else if (p9.length >= 3) {
    scores.A = 2;
  }
  return scores;
}

/** Función pura y determinística: mismas respuestas siempre producen el mismo perfil. */
export function calcularPerfil(respuestas: Respuestas): ResultadoPerfil {
  const condiciones = respuestas.p21.filter((v) => v !== 'ninguna');
  const nota_condicion_previa = condiciones.length > 0 || respuestas.p22 !== 'no';

  const scores: Puntajes = { A: 0, B: 0, C: 0, D: 0, E: 0 };

  for (const [pregunta, mapa] of Object.entries(PESOS)) {
    const respuesta = respuestas[pregunta as keyof Respuestas];
    const valores = Array.isArray(respuesta) ? respuesta : [respuesta];
    valores.forEach((v) => {
      const pesos = mapa[v as string];
      if (pesos) {
        (Object.entries(pesos) as [PerfilLetra, number][]).forEach(([perfil, pts]) => {
          scores[perfil] += pts;
        });
      }
    });
  }

  const p9Scores = puntajeP9(respuestas.p9, respuestas.p10);
  scores.A += p9Scores.A ?? 0;
  scores.E += p9Scores.E ?? 0;

  const maxScore = Math.max(...Object.values(scores));
  const ganadores = (Object.entries(scores) as [PerfilLetra, number][])
    .filter(([, v]) => v === maxScore)
    .map(([k]) => k);

  const segundoMax = Math.max(...Object.values(scores).filter((v) => v !== maxScore), 0);

  let perfilFinal: string;
  let esHibrido = false;
  let perfilSecundario: string | null = null;

  if (maxScore < UMBRAL_MINIMO) {
    perfilFinal = 'A';
  } else if (ganadores.length > 1) {
    perfilFinal = ganadores.join('+');
    esHibrido = true;
  } else if (maxScore - segundoMax <= DIFERENCIA_HIBRIDO) {
    perfilFinal = ganadores[0];
    perfilSecundario = (Object.entries(scores) as [PerfilLetra, number][])
      .filter(([k]) => k !== ganadores[0])
      .sort((a, b) => b[1] - a[1])[0][0];
    esHibrido = true;
  } else {
    perfilFinal = ganadores[0];
  }

  return {
    perfil: perfilFinal,
    perfil_secundario: perfilSecundario,
    es_hibrido: esHibrido,
    puntajes: scores,
    nota_condicion_previa,
    condiciones_marcadas: condiciones,
    embarazo_lactancia: respuestas.p22,
    contexto: {
      nombre: respuestas.nombre,
      sintomaPrincipal: unirNatural(respuestas.p3.map((s) => etiquetaOpcion('p3', s))),
      tiempoSintoma: etiquetaOpcion('p4', respuestas.p4),
      evolucion: respuestas.p5,
      disparadores: respuestas.p9.map((d) => etiquetaDisparador(d, respuestas.p9_otro)),
      agua: respuestas.p12,
      alcohol: respuestas.p13,
    },
  };
}
