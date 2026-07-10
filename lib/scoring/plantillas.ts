import { etiquetaOpcion } from '../quiz/preguntas';
import { nombreAmigablePerfil } from '../quiz/perfilLabels';
import type { DatosReporte, ResultadoPerfil } from './tipos';

type PlantillaFn = (d: DatosReporte) => string;

// Reglas de redacción (checklist):
// - Nunca prometer resultados con fecha específica.
// - Usar "muchas mujeres con este patrón" en vez de "tú vas a".
// - Nunca usar la palabra "diagnóstico" — usar "patrón" o "perfil funcional".
// - Siempre cerrar reforzando que el protocolo (Fase 1-4) es el mismo para todas.

function notaEvolucion(evolucion: string): string {
  const mapa: Record<string, string> = {
    empeora:
      'ha ido empeorando con el tiempo, lo que sugiere que el desequilibrio de fondo sigue activo y no se está resolviendo solo',
    se_mantiene_igual:
      'se ha mantenido bastante estable, lo que apunta a un patrón sostenido más que a un episodio pasajero',
    mejora_y_empeora:
      'tiene altibajos, mejorando y empeorando sin un patrón claro — algo típico de un sistema que reacciona de forma inconsistente a lo que comes o al estrés del día',
  };
  return mapa[evolucion] ?? 'lleva un tiempo presente';
}

function notaHidratacion(agua: string): string {
  if (agua === 'menos_1L' || agua === '1_a_1.5L') {
    return ' Además, tu consumo de agua está por debajo de lo recomendado — esto puede estar dificultando que tu cuerpo procese y elimine parte de lo que te está inflamando.';
  }
  return '';
}

function notaAlcohol(alcohol: string): string {
  if (alcohol === '1_a_2_semana' || alcohol === '3_mas_semana') {
    return ' El alcohol que reportaste también suma carga a un sistema que ya está trabajando de más.';
  }
  return '';
}

const SIN_DISPARADOR_CLARO = 'No identifico un disparador claro';

/** Devuelve la lista de disparadores en texto natural, o '' si la usuaria no identificó ninguno. */
function listaDisparadores(disparadores: string[]): string {
  return disparadores.filter((d) => d !== SIN_DISPARADOR_CLARO).join(', ');
}

const PLANTILLAS: Record<string, PlantillaFn> = {
  A: (d) => {
    const disparadoresTexto = listaDisparadores(d.disparadores);
    return `Hola ${d.nombre},

Con base en el cruce de tus respuestas, tu patrón principal es de **inflamación intestinal por desequilibrio bacteriano** (disbiosis).

No es un síntoma aislado: llevas ${d.tiempoSintoma} con ${d.sintomaPrincipal}, tu situación ${notaEvolucion(d.evolucion)}${
      disparadoresTexto ? `, y ${disparadoresTexto} aparecen entre los principales detonantes` : ''
    }. Cuando el tiempo prolongado${
      disparadoresTexto
        ? ', la forma en que ha evolucionado el síntoma y un disparador alimentario claro coinciden así'
        : ' y la forma en que ha evolucionado el síntoma coinciden así'
    }, suele indicar que la microbiota intestinal necesita un reinicio más que un ajuste puntual.${notaHidratacion(d.agua)}${notaAlcohol(d.alcohol)}

Muchas mujeres con este patrón encuentran que la Fase 1 (Descarga digestiva) es donde más notan el cambio, así que te recomendamos prestarle especial atención ahí.

Recuerda: el protocolo completo de 4 fases es tu punto de partida ideal — este perfil solo te ayuda a saber en qué enfocar tu atención dentro de cada fase.`;
  },

  B: (d) => `Hola ${d.nombre},

Tu patrón principal apunta a una conexión fuerte entre tu **sistema nervioso y tu digestión** (eje intestino-cerebro).

Llevas ${d.tiempoSintoma} con ${d.sintomaPrincipal}, y tu situación ${notaEvolucion(d.evolucion)}. Cuando el estrés se mantiene alto y el sueño no alcanza a ser reparador, el sistema nervioso le manda señales constantes de alerta al intestino — y el intestino responde inflamándose, incluso si lo que comes es razonable.${notaAlcohol(d.alcohol)}

Te recomendamos combinar el protocolo con los hábitos de regulación del sistema nervioso que encontrarás en la Clase 3 — respiración antes de comer, comer sin pantallas, y mantener horarios de sueño más consistentes.

El protocolo completo de 4 fases es el mismo para todas; en tu caso, la clave extra está en trabajar el estrés en paralelo a la alimentación.`,

  C: (d) => `Hola ${d.nombre},

Tu patrón principal tiene un componente **metabólico** notorio — las caídas de energía durante el día y la sensación de hinchazón o retención suelen ir de la mano con este perfil.

Llevas ${d.tiempoSintoma} con ${d.sintomaPrincipal}, y tu situación ${notaEvolucion(d.evolucion)}. Cuando la energía baja de forma predecible en el día y además notas hinchazón o retención sin que cambie mucho lo que comes, generalmente hay una base inflamatoria afectando cómo tu cuerpo procesa y elimina lo que consumes.${notaHidratacion(d.agua)}${notaAlcohol(d.alcohol)}

El protocolo te va a ayudar con esa base inflamatoria, que es el punto de partida antes de trabajar cualquier objetivo adicional con mayor profundidad.

El protocolo completo de 4 fases es el mismo para todas — este perfil solo te ayuda a priorizar en qué fijarte primero.`,

  D: (d) => `Hola ${d.nombre},

Notamos que tus síntomas cambian con tu ciclo — esto sugiere un componente **hormonal** en tu patrón.

Llevas ${d.tiempoSintoma} con ${d.sintomaPrincipal}, y el hecho de que empeore específicamente antes o durante tu periodo — y no de forma constante — es una pista importante: apunta a que las fluctuaciones hormonales del ciclo están amplificando la inflamación de base, más que a un problema puramente digestivo.${notaHidratacion(d.agua)}

El protocolo va a trabajar tu base inflamatoria igual que para cualquier perfil. Adicionalmente, te recomendamos comentar este patrón con tu médico para descartar o confirmar un componente hormonal de fondo, y trabajarlo en paralelo.`,

  E: (d) => {
    const disparadoresTexto = listaDisparadores(d.disparadores) || 'un alimento puntual';
    return `Hola ${d.nombre},

Tu patrón apunta más a una **intolerancia específica** que a un desequilibrio general — especialmente relacionado con ${disparadoresTexto}.

Llevas ${d.tiempoSintoma} con ${d.sintomaPrincipal}, y el hecho de que puedas señalar un disparador tan concreto —en vez de sentir que "todo te cae mal"— es justo lo que distingue este patrón de una disbiosis general: tu cuerpo está reaccionando a algo específico, no a un desequilibrio amplio.

Te recomendamos prestar especial atención a la eliminación dirigida de ese alimento durante el protocolo, y observar cómo responde tu cuerpo al reintroducirlo poco a poco después del día 5.

El protocolo completo de 4 fases sigue siendo tu punto de partida — este perfil solo te ayuda a saber qué vigilar de cerca.`;
  },

  F: () => `Gracias por completar el cuestionario.

Algunas de tus respuestas indican que sería importante que consultes con un médico antes de iniciar cualquier protocolo nutricional. Esto no significa que algo esté necesariamente mal — es simplemente la recomendación responsable dado lo que nos compartiste.

Por favor prioriza esa consulta antes de continuar.`,
};

function construirNotaCondicionPrevia(condiciones: string[], embarazoLactancia: string): string {
  if (condiciones.length === 0 && embarazoLactancia === 'no') return '';
  const items = condiciones.map((c) => etiquetaOpcion('p21', c));
  if (embarazoLactancia !== 'no') items.push(etiquetaOpcion('p22', embarazoLactancia));
  return `\n\nComo nos compartiste que tienes ${items.join(', ')}, te recomendamos aplicar este protocolo en conjunto con tu médico, para asegurarnos de que todo se maneje de forma segura y coordinada.`;
}

function construirNotaHibrido(perfilSecundario: string | null): string {
  if (!perfilSecundario) return '';
  return `\n\nTambién notamos un componente secundario relacionado con el patrón ${nombreAmigablePerfil(perfilSecundario)} — vale la pena tenerlo presente mientras avanzas.`;
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
