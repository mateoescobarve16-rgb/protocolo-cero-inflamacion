export type PerfilLetra = 'A' | 'B' | 'C' | 'D' | 'E';
export type Puntajes = Record<PerfilLetra, number>;

export interface Respuestas {
  nombre: string;
  email: string;
  p3: string[];
  p4: string;
  p5: string;
  p6: string;
  p7: string;
  p8: string;
  p9: string[];
  p9_otro?: string;
  p10: string;
  p11: string;
  p12: string;
  p13: string;
  p14: string;
  p15: string;
  p16: string;
  p17: string;
  p18: string;
  p19: string;
  p20: string;
  p21: string[];
  p22: string;
}

export interface DatosReporte {
  nombre: string;
  sintomaPrincipal: string;
  tiempoSintoma: string;
  evolucion: string;
  disparadores: string[];
  agua: string;
  alcohol: string;
}

export interface ResultadoPerfil {
  perfil: string;
  perfil_secundario: string | null;
  es_hibrido: boolean;
  puntajes: Puntajes;
  nota_condicion_previa: boolean;
  condiciones_marcadas: string[];
  embarazo_lactancia: string;
  contexto: DatosReporte;
}

export interface SeccionReporte {
  titulo: string;
  parrafos: string[];
}

export interface Reporte {
  /** Texto plano (párrafos separados por "\n\n"), tal como se guarda en Supabase. */
  texto: string;
  /** Los mismos párrafos agrupados por sección, para el render en tarjetas. */
  secciones: SeccionReporte[];
}
