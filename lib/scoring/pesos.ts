import type { PerfilLetra } from './tipos';

type MapaPesos = Partial<Record<PerfilLetra, number>>;

/** Tabla de pesos por perfil (Paso 3 del spec). Solo las respuestas listadas aquí puntúan. */
export const PESOS: Record<string, Record<string, MapaPesos>> = {
  p6: { despues_almuerzo: { A: 2 }, despues_comer: { A: 2 } },
  p7: { estrenimiento_frecuente: { A: 1 }, alterna: { A: 1 } },
  p8: { todos_los_dias: { A: 2 } },
  p10: { intolerancia_lactosa: { E: 3 }, celiaquia: { E: 3 }, otro: { E: 3 } },
  p11: { sin_horarios: { A: 1, B: 1 }, dificil_alimentarse: { A: 1, B: 1 } },
  p14: { cae_mediodia: { C: 2 }, cansada_todo_el_dia: { C: 2 } },
  p16: { dificultad_generalizada: { C: 2 }, zonas_especificas: { A: 1, C: 1 } },
  p17: { alto: { B: 3 }, muy_alto: { B: 3 } },
  p18: { menos_5h: { B: 2 }, '5_a_6h': { B: 2 } },
  p19: { irregular: { B: 2 } },
  p20: { empeora_con_ciclo: { D: 3 } },
  p15: { resequedad: { A: 1, D: 1 }, brotes: { A: 1, D: 1 } },
};

export const UMBRAL_MINIMO = 4;
export const DIFERENCIA_HIBRIDO = 2;
