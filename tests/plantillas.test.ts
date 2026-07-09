import { describe, expect, it } from 'vitest';
import { calcularPerfil } from '../lib/scoring/calcularPerfil';
import { generarReporte } from '../lib/scoring/plantillas';
import type { Respuestas } from '../lib/scoring/tipos';

function baseRespuestas(overrides: Partial<Respuestas> = {}): Respuestas {
  return {
    nombre: 'María',
    email: 'maria@email.com',
    p3: 'hinchazon_abdominal',
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
    p23: ['ninguna'],
    ...overrides,
  };
}

describe('generarReporte', () => {
  it('incluye el nombre de la usuaria y el lenguaje del perfil A', () => {
    const resultado = calcularPerfil(baseRespuestas());
    const texto = generarReporte(resultado);
    expect(texto).toContain('María');
    expect(texto).toContain('disbiosis');
  });

  it('nunca usa la palabra "diagnóstico" en el cuerpo del reporte', () => {
    const resultado = calcularPerfil(baseRespuestas());
    const texto = generarReporte(resultado);
    expect(texto.toLowerCase()).not.toContain('diagnóstico');
  });

  it('agrega la nota de híbrido cuando hay perfil secundario', () => {
    const resultado = calcularPerfil(
      baseRespuestas({
        p6: 'despues_almuerzo',
        p7: 'estrenimiento_frecuente',
        p8: 'todos_los_dias',
        p14: 'cae_mediodia',
        p16: 'dificultad_generalizada',
      })
    );
    const texto = generarReporte(resultado);
    expect(texto).toContain('componente secundario relacionado con el perfil C');
  });

  it('agrega la nota de condición previa cuando aplica', () => {
    const resultado = calcularPerfil(baseRespuestas({ p22: 'embarazo' }));
    const texto = generarReporte(resultado);
    expect(texto).toContain('en conjunto con tu médico');
  });

  it('devuelve la plantilla de derivación médica para perfil F, sin depender del contexto', () => {
    const resultado = calcularPerfil(baseRespuestas({ p23: ['dolor_severo'] }));
    const texto = generarReporte(resultado);
    expect(texto).toContain('consultes con un médico');
  });
});
