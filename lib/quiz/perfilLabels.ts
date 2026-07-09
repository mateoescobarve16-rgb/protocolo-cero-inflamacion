const NOMBRE_PERFIL: Record<string, string> = {
  A: 'Inflamación digestiva',
  B: 'Estrés y digestión',
  C: 'Metabólico',
  D: 'Hormonal',
  E: 'Intolerancia específica',
};

export function nombreAmigablePerfil(perfil: string): string {
  const base = perfil.includes('+') ? perfil.split('+')[0] : perfil;
  return NOMBRE_PERFIL[base] ?? 'Patrón funcional';
}
