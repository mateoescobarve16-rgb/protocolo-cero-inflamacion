import type { DatosReporte, ResultadoPerfil } from './tipos';

type PlantillaFn = (d: DatosReporte) => string;

// Reglas de redacción (checklist):
// - Nunca prometer resultados con fecha específica.
// - Usar "muchas mujeres con este patrón" en vez de "tú vas a".
// - Nunca usar la palabra "diagnóstico" — usar "patrón" o "perfil funcional".
// - Siempre cerrar reforzando que el protocolo (Fase 1-4) es el mismo para todas.
const PLANTILLAS: Record<string, PlantillaFn> = {
  A: (d) => `Hola ${d.nombre},

Con base en tus respuestas, tu patrón principal es de **inflamación intestinal por desequilibrio bacteriano** (disbiosis).

Notamos que llevas ${d.tiempoSintoma} con ${d.sintomaPrincipal}, y que ${d.disparadores.join(', ')} parecen estar entre los principales detonantes de tu hinchazón.

Muchas mujeres con este patrón encuentran que la Fase 1 (Descarga digestiva) es donde más notan el cambio, así que te recomendamos prestarle especial atención ahí.

Recuerda: el protocolo completo de 4 fases es tu punto de partida ideal — este perfil solo te ayuda a saber en qué enfocar tu atención dentro de cada fase.`,

  B: (d) => `Hola ${d.nombre},

Tu patrón principal apunta a una conexión fuerte entre tu **sistema nervioso y tu digestión** (eje intestino-cerebro).

Además de la alimentación, el estrés y la calidad de tu sueño parecen estar jugando un papel importante en cómo reacciona tu cuerpo.

Te recomendamos combinar el protocolo con los hábitos de regulación del sistema nervioso que encontrarás en la Clase 3 — respiración antes de comer, comer sin pantallas, y mantener horarios de sueño más consistentes.`,

  C: (d) => `Hola ${d.nombre},

Tu patrón principal tiene un componente **metabólico** notorio — la dificultad para bajar de peso y las caídas de energía durante el día suelen ir de la mano con este perfil.

El protocolo te va a ayudar con la base inflamatoria, y es un excelente punto de partida antes de trabajar el componente metabólico con mayor profundidad.`,

  D: (d) => `Hola ${d.nombre},

Notamos que tus síntomas cambian con tu ciclo — esto sugiere un componente **hormonal** en tu patrón.

El protocolo va a trabajar tu base inflamatoria igual que para cualquier perfil. Adicionalmente, te recomendamos comentar este patrón con tu médico para descartar o confirmar un componente hormonal de fondo, y trabajarlo en paralelo.`,

  E: (d) => `Hola ${d.nombre},

Tu patrón apunta más a una **intolerancia específica** que a un desequilibrio general — especialmente relacionado con ${d.disparadores.join(', ')}.

Te recomendamos prestar especial atención a la eliminación dirigida de ese alimento durante el protocolo, y observar cómo responde tu cuerpo al reintroducirlo poco a poco después del día 5.`,

  F: () => `Gracias por completar el cuestionario.

Algunas de tus respuestas indican que sería importante que consultes con un médico antes de iniciar cualquier protocolo nutricional. Esto no significa que algo esté necesariamente mal — es simplemente la recomendación responsable dado lo que nos compartiste.

Por favor prioriza esa consulta antes de continuar.`,
};

function construirNotaCondicionPrevia(condiciones: string[], embarazoLactancia: string): string {
  if (condiciones.length === 0 && embarazoLactancia === 'no') return '';
  const items = [...condiciones];
  if (embarazoLactancia !== 'no') items.push(embarazoLactancia);
  return `\n\nComo nos compartiste que tienes ${items.join(', ')}, te recomendamos aplicar este protocolo en conjunto con tu médico, para asegurarnos de que todo se maneje de forma segura y coordinada.`;
}

function construirNotaHibrido(perfilSecundario: string | null): string {
  if (!perfilSecundario) return '';
  return `\n\nTambién notamos un componente secundario relacionado con el perfil ${perfilSecundario} — vale la pena tenerlo presente mientras avanzas.`;
}

export function generarReporte(resultado: ResultadoPerfil): string {
  if (!resultado.calculado) {
    return PLANTILLAS.F(undefined as unknown as DatosReporte);
  }

  const perfilBase = resultado.perfil.includes('+') ? resultado.perfil.split('+')[0] : resultado.perfil;

  let texto = PLANTILLAS[perfilBase](resultado.contexto);
  texto += construirNotaHibrido(resultado.perfil_secundario);
  texto += construirNotaCondicionPrevia(resultado.condiciones_marcadas, resultado.embarazo_lactancia);

  return texto;
}
