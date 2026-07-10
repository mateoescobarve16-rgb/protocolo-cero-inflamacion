import { describe, expect, it } from 'vitest';
import { calcularPerfil } from '../lib/scoring/calcularPerfil';
import { generarReporte } from '../lib/scoring/plantillas';
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
    expect(texto).toContain('componente secundario relacionado con el patrón Metabólico');
  });

  it('agrega la nota de condición previa cuando aplica', () => {
    const resultado = calcularPerfil(baseRespuestas({ p22: 'embarazo' }));
    const texto = generarReporte(resultado);
    expect(texto).toContain('en conjunto con tu médico');
  });

  it('agrega la nota de hidratación cuando el consumo de agua es bajo', () => {
    const resultado = calcularPerfil(baseRespuestas({ p12: 'menos_1L' }));
    const texto = generarReporte(resultado);
    expect(texto).toContain('consumo de agua está por debajo de lo recomendado');
  });

  it('no agrega la nota de hidratación cuando el consumo de agua es adecuado', () => {
    const resultado = calcularPerfil(baseRespuestas({ p12: '1.5_a_2.5L' }));
    const texto = generarReporte(resultado);
    expect(texto).not.toContain('consumo de agua está por debajo de lo recomendado');
  });

  it('agrega la nota de alcohol cuando el consumo es frecuente', () => {
    const resultado = calcularPerfil(baseRespuestas({ p13: '3_mas_semana' }));
    const texto = generarReporte(resultado);
    expect(texto).toContain('El alcohol que reportaste también suma carga');
  });

  it('referencia cómo ha evolucionado el síntoma en el cuerpo del reporte', () => {
    const resultado = calcularPerfil(baseRespuestas({ p5: 'empeora' }));
    const texto = generarReporte(resultado);
    expect(texto).toContain('ha ido empeorando con el tiempo');
  });

  it('une varios síntomas principales en una frase natural cuando p3 es multi-select', () => {
    const resultado = calcularPerfil(baseRespuestas({ p3: ['hinchazon_abdominal', 'cansancio'] }));
    const texto = generarReporte(resultado);
    expect(texto).toContain('Hinchazón / abdomen inflado y Cansancio constante');
  });

  it('nunca menciona "bajar de peso" en el perfil C (reencuadrado a energía/retención)', () => {
    const resultado = calcularPerfil(
      baseRespuestas({ p14: 'cae_mediodia', p16: 'dificultad_generalizada' })
    );
    const texto = generarReporte(resultado);
    expect(texto.toLowerCase()).not.toContain('bajar de peso');
  });

  it('traduce las condiciones previas con guion bajo a su etiqueta legible', () => {
    const resultado = calcularPerfil(baseRespuestas({ p21: ['resistencia_insulina'] }));
    const texto = generarReporte(resultado);
    expect(texto).toContain('Resistencia a la insulina, prediabetes o diabetes');
    expect(texto).not.toContain('resistencia_insulina');
  });

  it('usa el texto libre de "otro" disparador en el reporte del perfil E', () => {
    const resultado = calcularPerfil(
      baseRespuestas({ p9: ['otro_disparador'], p9_otro: 'maní', p10: 'otro' })
    );
    const texto = generarReporte(resultado);
    expect(texto).toContain('especialmente relacionado con maní');
  });

  it('nunca expone la letra cruda del perfil en el texto del reporte', () => {
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
    expect(texto).not.toMatch(/perfil [A-E]\b/);
  });
});
