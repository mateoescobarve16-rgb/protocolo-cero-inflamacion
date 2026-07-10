export interface Opcion {
  id: string;
  label: string;
  /** Si se marca, deselecciona cualquier otra opción marcada en preguntas multi-select (ej. "Ninguna de las anteriores"). */
  exclusiva?: boolean;
}

export type TipoPregunta = 'texto' | 'single' | 'multi';

export interface Pregunta {
  id: string;
  texto: string;
  tipo: TipoPregunta;
  opciones?: Opcion[];
  placeholder?: string;
}

export interface Bloque {
  id: string;
  titulo: string;
  preguntaIds: string[];
}

export const PREGUNTAS: Record<string, Pregunta> = {
  nombre: {
    id: 'nombre',
    texto: '¿Cómo te gustaría que te llamemos?',
    tipo: 'texto',
    placeholder: 'Tu nombre',
  },
  email: {
    id: 'email',
    texto: '¿Cuál es tu correo electrónico?',
    tipo: 'texto',
    placeholder: 'tu@email.com',
  },
  p3: {
    id: 'p3',
    texto: '¿Cuál es el síntoma que más te molesta ahora mismo?',
    tipo: 'single',
    opciones: [
      { id: 'hinchazon_abdominal', label: 'Hinchazón / abdomen inflado' },
      { id: 'gases_eructos', label: 'Gases y eructos frecuentes' },
      { id: 'cansancio', label: 'Cansancio constante' },
      { id: 'estrenimiento', label: 'Estreñimiento o tránsito irregular' },
      { id: 'piel_opaca', label: 'Piel opaca o resequedad' },
      { id: 'dificultad_bajar_peso', label: 'Dificultad para bajar de peso' },
    ],
  },
  p4: {
    id: 'p4',
    texto: '¿Desde cuándo lo sientes?',
    tipo: 'single',
    opciones: [
      { id: 'menos_1_mes', label: 'Menos de 1 mes' },
      { id: '1_a_6_meses', label: '1 a 6 meses' },
      { id: '6_meses_a_1_anio', label: '6 meses a 1 año' },
      { id: 'mas_1_anio', label: 'Más de 1 año' },
    ],
  },
  p5: {
    id: 'p5',
    texto: '¿Ha empeorado, mejorado, o se mantiene igual?',
    tipo: 'single',
    opciones: [
      { id: 'empeora', label: 'Ha empeorado' },
      { id: 'se_mantiene_igual', label: 'Se mantiene igual' },
      { id: 'mejora_y_empeora', label: 'Mejora y empeora sin patrón claro' },
    ],
  },
  p6: {
    id: 'p6',
    texto: '¿Cuándo aparece la hinchazón?',
    tipo: 'single',
    opciones: [
      { id: 'al_despertar', label: 'Al despertar' },
      { id: 'despues_comer', label: 'Después de comer (cualquier comida)' },
      { id: 'despues_almuerzo', label: 'Después del almuerzo específicamente' },
      { id: 'en_la_noche', label: 'En la noche' },
      { id: 'todo_el_dia', label: 'Todo el día, sin patrón' },
    ],
  },
  p7: {
    id: 'p7',
    texto: '¿Cómo es tu tránsito intestinal?',
    tipo: 'single',
    opciones: [
      { id: 'estrenimiento_frecuente', label: 'Estreñimiento frecuente' },
      { id: 'diarrea_frecuente', label: 'Diarrea frecuente' },
      { id: 'alterna', label: 'Alterno entre los dos' },
      { id: 'normal', label: 'Normal, sin problema de tránsito' },
    ],
  },
  p8: {
    id: 'p8',
    texto: '¿Notas gases o eructos frecuentes?',
    tipo: 'single',
    opciones: [
      { id: 'todos_los_dias', label: 'Sí, todos los días' },
      { id: 'algunas_veces_semana', label: 'Sí, algunas veces por semana' },
      { id: 'casi_nunca', label: 'Casi nunca' },
    ],
  },
  p9: {
    id: 'p9',
    texto: '¿Qué alimentos sientes que te "caen mal"?',
    tipo: 'multi',
    opciones: [
      { id: 'lacteos', label: 'Lácteos' },
      { id: 'gluten', label: 'Gluten / harinas' },
      { id: 'gaseosas', label: 'Alimentos con gas (gaseosas, cerveza)' },
      { id: 'grasas', label: 'Comidas grasosas o fritas' },
      { id: 'azucar', label: 'Azúcar / dulces' },
      { id: 'ninguno', label: 'No identifico un disparador claro', exclusiva: true },
    ],
  },
  p10: {
    id: 'p10',
    texto: '¿Tienes alguna alergia o intolerancia alimentaria diagnosticada?',
    tipo: 'single',
    opciones: [
      { id: 'intolerancia_lactosa', label: 'Sí, a lácteos (intolerancia a la lactosa)' },
      { id: 'celiaquia', label: 'Sí, al gluten (celiaquía o sensibilidad)' },
      { id: 'otro', label: 'Sí, a otro alimento' },
      { id: 'no_diagnosticada', label: 'No tengo ninguna diagnosticada' },
    ],
  },
  p11: {
    id: 'p11',
    texto: '¿Cómo describirías tu alimentación en una semana normal?',
    tipo: 'single',
    opciones: [
      { id: 'horarios_fijos', label: 'Como en horarios fijos y balanceados' },
      { id: 'sin_horarios', label: 'Como sin horarios definidos' },
      { id: 'dificil_alimentarse', label: 'Se me hace difícil alimentarme bien por falta de tiempo' },
      { id: 'pierdo_control_finde', label: 'Como bien entre semana, pero pierdo el control el fin de semana' },
    ],
  },
  p12: {
    id: 'p12',
    texto: '¿Cuánta agua tomas al día aproximadamente?',
    tipo: 'single',
    opciones: [
      { id: 'menos_1L', label: 'Menos de 1 litro' },
      { id: '1_a_1.5L', label: '1 a 1.5 litros' },
      { id: '1.5_a_2.5L', label: '1.5 a 2.5 litros' },
      { id: 'mas_2.5L', label: 'Más de 2.5 litros' },
    ],
  },
  p13: {
    id: 'p13',
    texto: '¿Con qué frecuencia consumes alcohol?',
    tipo: 'single',
    opciones: [
      { id: 'nunca', label: 'Nunca' },
      { id: 'ocasional', label: 'Ocasionalmente (eventos especiales)' },
      { id: '1_a_2_semana', label: '1 a 2 veces por semana' },
      { id: '3_mas_semana', label: '3 o más veces por semana' },
    ],
  },
  p14: {
    id: 'p14',
    texto: '¿Cómo está tu energía durante el día?',
    tipo: 'single',
    opciones: [
      { id: 'estable', label: 'Estable todo el día' },
      { id: 'cae_mediodia', label: 'Cae fuerte al mediodía' },
      { id: 'cae_tarde_noche', label: 'Cae en la tarde/noche' },
      { id: 'cansada_todo_el_dia', label: 'Cansada todo el día' },
    ],
  },
  p15: {
    id: 'p15',
    texto: '¿Has notado cambios en tu piel en este mismo periodo?',
    tipo: 'single',
    opciones: [
      { id: 'resequedad', label: 'Sí, más opaca o reseca' },
      { id: 'brotes', label: 'Sí, más brotes o irritación' },
      { id: 'no_cambios', label: 'No he notado cambios' },
    ],
  },
  p16: {
    id: 'p16',
    texto: '¿Te cuesta bajar de peso a pesar de cuidarte?',
    tipo: 'single',
    opciones: [
      { id: 'zonas_especificas', label: 'Sí, en zonas específicas (abdomen, piernas)' },
      { id: 'dificultad_generalizada', label: 'Sí, de forma generalizada' },
      { id: 'no_preocupa', label: 'No, no es algo que me preocupe' },
    ],
  },
  p17: {
    id: 'p17',
    texto: '¿Cómo describirías tu nivel de estrés?',
    tipo: 'single',
    opciones: [
      { id: 'bajo', label: 'Bajo' },
      { id: 'medio', label: 'Medio' },
      { id: 'alto', label: 'Alto' },
      { id: 'muy_alto', label: 'Muy alto / constante' },
    ],
  },
  p18: {
    id: 'p18',
    texto: '¿Cuántas horas duermes en promedio?',
    tipo: 'single',
    opciones: [
      { id: 'menos_5h', label: 'Menos de 5 horas' },
      { id: '5_a_6h', label: '5 a 6 horas' },
      { id: '7_a_8h', label: '7 a 8 horas' },
      { id: 'mas_8h', label: 'Más de 8 horas' },
    ],
  },
  p19: {
    id: 'p19',
    texto: '¿A qué hora sueles acostarte y despertarte generalmente?',
    tipo: 'single',
    opciones: [
      { id: 'duermo_temprano', label: 'Duermo temprano y despierto temprano (ej. antes de 10pm - antes de 6am)' },
      { id: 'horario_intermedio', label: 'Horario intermedio (ej. 10pm-12am a 6am-8am)' },
      { id: 'duermo_tarde', label: 'Duermo tarde y despierto tarde (ej. después de 12am - después de 8am)' },
      { id: 'irregular', label: 'Mi horario es muy irregular, cambia día a día' },
    ],
  },
  p20: {
    id: 'p20',
    texto: 'Si aplica, ¿tus síntomas cambian con tu ciclo menstrual?',
    tipo: 'single',
    opciones: [
      { id: 'empeora_con_ciclo', label: 'Sí, empeoran antes o durante mi periodo' },
      { id: 'no_relacion', label: 'No noto relación' },
      { id: 'no_aplica', label: 'No aplica / no tengo ciclo regular' },
    ],
  },
  p21: {
    id: 'p21',
    texto: '¿Tienes alguna condición médica diagnosticada relacionada con lo siguiente?',
    tipo: 'multi',
    opciones: [
      { id: 'hipotiroidismo', label: 'Hipotiroidismo o hipertiroidismo' },
      { id: 'sop', label: 'Síndrome de ovario poliquístico (SOP)' },
      { id: 'resistencia_insulina', label: 'Resistencia a la insulina, prediabetes o diabetes' },
      { id: 'sii_eii', label: 'Síndrome de intestino irritable (SII) o enfermedad inflamatoria intestinal' },
      { id: 'ninguna', label: 'Ninguna de las anteriores', exclusiva: true },
    ],
  },
  p22: {
    id: 'p22',
    texto: '¿Estás embarazada o en lactancia actualmente?',
    tipo: 'single',
    opciones: [
      { id: 'embarazo', label: 'Sí, embarazada' },
      { id: 'lactancia', label: 'Sí, en lactancia' },
      { id: 'no', label: 'No' },
    ],
  },
  p23: {
    id: 'p23',
    texto: '¿Has notado alguna de estas señales?',
    tipo: 'multi',
    opciones: [
      { id: 'sangre_heces', label: 'Sangre en las heces' },
      { id: 'dolor_severo', label: 'Dolor abdominal muy severo' },
      { id: 'perdida_peso', label: 'Pérdida de peso sin explicación' },
      { id: 'fiebre', label: 'Fiebre asociada a los síntomas' },
      { id: 'ninguna', label: 'Ninguna de las anteriores', exclusiva: true },
    ],
  },
};

export const BLOQUES: Bloque[] = [
  { id: 'bloque-1', titulo: 'Datos personales', preguntaIds: ['nombre', 'email'] },
  { id: 'bloque-2', titulo: 'Síntoma principal y línea de tiempo', preguntaIds: ['p3', 'p4', 'p5'] },
  { id: 'bloque-3', titulo: 'Patrón digestivo', preguntaIds: ['p6', 'p7', 'p8'] },
  { id: 'bloque-4', titulo: 'Alimentación, disparadores y hábitos', preguntaIds: ['p9', 'p10', 'p11', 'p12', 'p13'] },
  { id: 'bloque-5', titulo: 'Energía, piel y peso', preguntaIds: ['p14', 'p15', 'p16'] },
  { id: 'bloque-6', titulo: 'Estrés y sueño', preguntaIds: ['p17', 'p18', 'p19', 'p20'] },
  { id: 'bloque-7', titulo: 'Condiciones de salud previas', preguntaIds: ['p21', 'p22'] },
  { id: 'bloque-8', titulo: 'Señales de alarma', preguntaIds: ['p23'] },
];

export const TODAS_LAS_PREGUNTAS_IDS = BLOQUES.flatMap((b) => b.preguntaIds);

export function obtenerBloqueDePregunta(preguntaId: string): Bloque {
  return BLOQUES.find((b) => b.preguntaIds.includes(preguntaId))!;
}

/** Traduce el id interno de una opción (ej. "menos_1_mes") a su texto legible. */
export function etiquetaOpcion(preguntaId: string, valor: string): string {
  return PREGUNTAS[preguntaId]?.opciones?.find((o) => o.id === valor)?.label ?? valor;
}
