import { describe, expect, it } from 'vitest';
import { calcularPerfil } from '../lib/scoring/calcularPerfil';
import type { Respuestas } from '../lib/scoring/tipos';

function baseRespuestas(overrides: Partial<Respuestas> = {}): Respuestas {
  return {
    nombre: 'María',
    email: 'maria@email.com',
    p3: ['hinchazon_abdominal'],
    p4: 'menos_1_mes',
    p5: 'se_mantiene_igual',
    p6: 'al_despertar',
    p7: 'normal',
    p8: 'casi_nunca',
    p9: ['ninguno'],
    p10: 'no_diagnosticada',
    p11: 'horarios_fijos',
    p12: '1.5_a_2.5L',
    p13: 'nunca',
    p14: 'estable',
    p15: 'no_cambios',
    p16: 'no_preocupa',
    p17: 'bajo',
    p18: '7_a_8h',
    p19: 'duermo_temprano',
    p20: 'no_relacion',
    p21: ['ninguna'],
    p22: 'no',
    ...overrides,
  };
}

describe('calcularPerfil', () => {
  it('devuelve perfil A por defecto cuando nadie llega al umbral mínimo de 4 puntos', () => {
    const resultado = calcularPerfil(baseRespuestas());
    expect(resultado.perfil).toBe('A');
    expect(resultado.es_hibrido).toBe(false);
  });

  it('perfil A (disbiosis) cuando el patrón digestivo domina', () => {
    const resultado = calcularPerfil(
      baseRespuestas({ p6: 'despues_almuerzo', p7: 'estrenimiento_frecuente', p8: 'todos_los_dias' })
    );
    expect(resultado.perfil).toBe('A');
    expect(resultado.puntajes.A).toBe(5);
    expect(resultado.es_hibrido).toBe(false);
  });

  it('perfil B (estrés / eje intestino-cerebro) cuando el estrés y el sueño dominan', () => {
    const resultado = calcularPerfil(
      baseRespuestas({ p17: 'muy_alto', p18: 'menos_5h', p19: 'irregular' })
    );
    expect(resultado.perfil).toBe('B');
    expect(resultado.puntajes.B).toBe(7);
  });

  it('perfil C (metabólico) cuando la energía y la retención dominan', () => {
    const resultado = calcularPerfil(
      baseRespuestas({ p14: 'cae_mediodia', p16: 'dificultad_generalizada' })
    );
    expect(resultado.perfil).toBe('C');
    expect(resultado.puntajes.C).toBe(4);
  });

  it('perfil D (hormonal) cuando los síntomas cambian con el ciclo', () => {
    const resultado = calcularPerfil(baseRespuestas({ p20: 'empeora_con_ciclo', p15: 'resequedad' }));
    expect(resultado.perfil).toBe('D');
    expect(resultado.puntajes.D).toBe(4);
  });

  it('perfil E (intolerancia específica) cuando hay un solo disparador y diagnóstico confirmado', () => {
    const resultado = calcularPerfil(baseRespuestas({ p9: ['lacteos'], p10: 'intolerancia_lactosa' }));
    expect(resultado.perfil).toBe('E');
    expect(resultado.puntajes.E).toBe(6);
  });

  it('perfil A por acumulación de disparadores múltiples (3+) en p9', () => {
    const resultado = calcularPerfil(
      baseRespuestas({ p9: ['lacteos', 'gluten', 'azucar'], p6: 'despues_almuerzo' })
    );
    expect(resultado.perfil).toBe('A');
    expect(resultado.puntajes.A).toBe(4);
  });

  it('cuenta el disparador "otro_disparador" igual que cualquier otro para el conteo de p9', () => {
    const resultado = calcularPerfil(
      baseRespuestas({ p9: ['otro_disparador'], p9_otro: 'maní', p10: 'otro' })
    );
    expect(resultado.perfil).toBe('E');
    expect(resultado.contexto.disparadores).toEqual(['maní']);
  });

  it('detecta empate exacto como híbrido "A+B"', () => {
    const resultado = calcularPerfil(
      baseRespuestas({
        p6: 'despues_almuerzo',
        p7: 'estrenimiento_frecuente',
        p8: 'todos_los_dias',
        p17: 'alto',
        p18: '5_a_6h',
      })
    );
    expect(resultado.puntajes.A).toBe(5);
    expect(resultado.puntajes.B).toBe(5);
    expect(resultado.perfil).toBe('A+B');
    expect(resultado.es_hibrido).toBe(true);
  });

  it('detecta perfil híbrido con secundario cuando la diferencia es <= 2 puntos', () => {
    const resultado = calcularPerfil(
      baseRespuestas({
        p6: 'despues_almuerzo',
        p7: 'estrenimiento_frecuente',
        p8: 'todos_los_dias',
        p14: 'cae_mediodia',
        p16: 'dificultad_generalizada',
      })
    );
    expect(resultado.puntajes.A).toBe(5);
    expect(resultado.puntajes.C).toBe(4);
    expect(resultado.perfil).toBe('A');
    expect(resultado.perfil_secundario).toBe('C');
    expect(resultado.es_hibrido).toBe(true);
  });

  it('activa nota_condicion_previa cuando hay una condición marcada, sin importar el perfil ganador', () => {
    const resultado = calcularPerfil(
      baseRespuestas({
        p6: 'despues_almuerzo',
        p7: 'estrenimiento_frecuente',
        p8: 'todos_los_dias',
        p21: ['hipotiroidismo'],
      })
    );
    expect(resultado.perfil).toBe('A');
    expect(resultado.nota_condicion_previa).toBe(true);
    expect(resultado.condiciones_marcadas).toEqual(['hipotiroidismo']);
  });

  it('activa nota_condicion_previa cuando hay embarazo o lactancia, aunque no haya condiciones marcadas', () => {
    const resultado = calcularPerfil(baseRespuestas({ p22: 'embarazo' }));
    expect(resultado.nota_condicion_previa).toBe(true);
    expect(resultado.condiciones_marcadas).toEqual([]);
  });
});
