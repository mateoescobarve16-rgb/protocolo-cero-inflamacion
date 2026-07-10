'use client';

import { useEffect, useRef, useState } from 'react';
import { PREGUNTAS, etiquetaOpcion } from '@/lib/quiz/preguntas';
import { PASOS, IDS_HABITOS_GENERALES, tituloDePaso } from '@/lib/quiz/pasos';
import { nombreAmigablePerfil } from '@/lib/quiz/perfilLabels';
import { PreguntaField } from './components/PreguntaField';
import { DatosPersonalesForm } from './components/DatosPersonalesForm';
import { HabitosGeneralesForm } from './components/HabitosGeneralesForm';
import { ResultadoCompleto, type ResumenDiagnostico } from './components/ResultadoCompleto';
import { ProgressBar } from './components/ProgressBar';
import { iconoDePaso } from './components/pasoIconos';
import { TransicionScreen, ProcesandoScreen, RevelacionScreen } from './components/CierreScreens';
import { ArrowLeftIcon, ArrowRightIcon, SparklesIcon } from './components/Icons';

type ValorRespuesta = string | string[];
type Etapa =
  | 'bienvenida'
  | 'pregunta'
  | 'tip'
  | 'transicion'
  | 'procesando'
  | 'revelado'
  | 'resultado'
  | 'error';

interface ResultadoAPI {
  reporte_texto: string;
  requiere_derivacion: boolean;
  nota_condicion_previa: boolean;
  perfil?: string;
  puntajes?: Record<string, number>;
}

const TOTAL_PASOS = PASOS.length;

// Pantallas de "tip" que se muestran justo antes del índice indicado (una sola vez): breves pausas
// entre secciones, no promesas de resultado, mientras seguimos recopilando datos.
const TIPS: Record<number, { titulo: (nombre: string) => string; cuerpo: string }> = {
  1: {
    titulo: (nombre) => `${nombre || 'Hola'}, antes de seguir`,
    cuerpo:
      'La mayoría de los diagnósticos genéricos fallan porque no consideran tu caso particular. Cada respuesta que nos das nos ayuda a entender exactamente qué le pasa a tu cuerpo.',
  },
  10: {
    titulo: (nombre) => `Vas muy bien, ${nombre || 'vamos'}`,
    cuerpo:
      'Ya vas por la mitad. Las siguientes preguntas nos ayudan a afinar tu perfil hormonal y de estrés — no hay respuestas correctas o incorrectas, solo sé honesta.',
  },
};

function camposDelPaso(paso: (typeof PASOS)[number]): string[] {
  if (paso.tipo === 'datos-personales') return ['nombre', 'email'];
  if (paso.tipo === 'habitos-generales') return [...IDS_HABITOS_GENERALES];
  return [paso.preguntaId];
}

function etiquetaResumen(preguntaId: string, valor: unknown): string {
  if (typeof valor !== 'string' || !valor) return '—';
  return etiquetaOpcion(preguntaId, valor);
}

function etiquetaResumenMulti(preguntaId: string, valor: unknown): string {
  if (!Array.isArray(valor) || valor.length === 0) return '—';
  return valor.map((v) => etiquetaOpcion(preguntaId, v)).join(', ');
}

export default function DiagnosticoPage() {
  const [etapa, setEtapa] = useState<Etapa>('bienvenida');
  const [pasoIndex, setPasoIndex] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, ValorRespuesta>>({});
  const [erroresCampos, setErroresCampos] = useState<string[]>([]);
  const [resultado, setResultado] = useState<ResultadoAPI | null>(null);
  const [fetchListo, setFetchListo] = useState(false);
  const [tipsVistos, setTipsVistos] = useState<Set<number>>(new Set());

  const pasoActual = PASOS[pasoIndex];

  function validarCampo(id: string): boolean {
    const pregunta = PREGUNTAS[id];
    const valor = respuestas[id];
    if (pregunta.tipo === 'multi') return Array.isArray(valor) && valor.length > 0;
    return typeof valor === 'string' && valor.trim() !== '';
  }

  function camposFaltantes(paso: (typeof PASOS)[number]): string[] {
    return camposDelPaso(paso).filter((id) => !validarCampo(id));
  }

  const respondida = camposFaltantes(pasoActual).length === 0;

  const irSiguienteRef = useRef<() => void>(() => {});
  const autoAvanzarTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function limpiarAutoAvance() {
    if (autoAvanzarTimeout.current) {
      clearTimeout(autoAvanzarTimeout.current);
      autoAvanzarTimeout.current = null;
    }
  }

  // Cancela cualquier auto-avance pendiente si el usuario navega antes de que dispare.
  useEffect(() => limpiarAutoAvance, [pasoIndex]);

  async function iniciarCalculo() {
    setFetchListo(false);
    try {
      const res = await fetch('/api/calcular-perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(respuestas),
      });

      if (!res.ok) throw new Error('Respuesta no válida del servidor');

      const data: ResultadoAPI = await res.json();
      setResultado(data);
      setFetchListo(true);
    } catch {
      setEtapa('error');
    }
  }

  function irSiguiente() {
    const faltantes = camposFaltantes(pasoActual);
    if (faltantes.length > 0) {
      setErroresCampos(faltantes);
      return;
    }

    if (pasoIndex === TOTAL_PASOS - 1) {
      setEtapa('transicion');
      iniciarCalculo();
      return;
    }

    const siguiente = pasoIndex + 1;
    setPasoIndex(siguiente);
    setErroresCampos([]);
    setEtapa(TIPS[siguiente] && !tipsVistos.has(siguiente) ? 'tip' : 'pregunta');
  }

  // Ref actualizada tras cada render para que el setTimeout del auto-avance nunca llame a una versión obsoleta.
  useEffect(() => {
    irSiguienteRef.current = irSiguiente;
  });

  function irAtras() {
    limpiarAutoAvance();
    if (pasoIndex === 0) {
      setEtapa('bienvenida');
      return;
    }
    setPasoIndex((i) => i - 1);
    setErroresCampos([]);
    setEtapa('pregunta');
  }

  function continuarDesdeTip() {
    setTipsVistos((prev) => new Set(prev).add(pasoIndex));
    setEtapa('pregunta');
  }

  function alTerminarProcesamiento() {
    setEtapa(resultado?.requiere_derivacion ? 'resultado' : 'revelado');
  }

  function actualizarRespuesta(campoId: string, valor: ValorRespuesta, autoAvanzar = false) {
    setRespuestas((prev) => ({ ...prev, [campoId]: valor }));
    setErroresCampos((prev) => prev.filter((id) => id !== campoId));
    if (autoAvanzar) {
      limpiarAutoAvance();
      autoAvanzarTimeout.current = setTimeout(() => irSiguienteRef.current(), 380);
    }
  }

  const nombre = (respuestas.nombre as string) ?? '';

  const resumen: ResumenDiagnostico | undefined =
    resultado && !resultado.requiere_derivacion
      ? {
          sintomaPrincipal: etiquetaResumenMulti('p3', respuestas.p3),
          tiempoSintoma: etiquetaResumen('p4', respuestas.p4),
          nivelEstres: etiquetaResumen('p17', respuestas.p17),
          horasSueno: etiquetaResumen('p18', respuestas.p18),
          patronDominante: resultado.perfil ? nombreAmigablePerfil(resultado.perfil) : '—',
        }
      : undefined;

  const esResultado = etapa === 'resultado';

  return (
    <main
      className={`flex flex-col items-center bg-[var(--background)] px-4 py-6 ${
        esResultado ? 'min-h-dvh' : 'h-dvh justify-center overflow-hidden py-4'
      }`}
    >
      <div className={`flex w-full flex-col ${esResultado ? 'max-w-lg' : 'max-w-md'}`}>
        {(etapa === 'pregunta' || etapa === 'tip') && (
          <ProgressBar pasoActual={pasoIndex + 1} totalPasos={TOTAL_PASOS} />
        )}

        {etapa === 'bienvenida' && (
          <div className="flex flex-col items-center gap-5 rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-xl shadow-emerald-900/5">
            <span className="rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Protocolo Cero Inflamación
            </span>
            <h1 className="text-2xl font-bold leading-tight text-neutral-900 sm:text-3xl">
              Diagnóstico de Perfil Funcional
            </h1>
            <p className="text-neutral-600">
              Este cuestionario te toma unos minutos y nos ayuda a entender tu patrón
              principal de inflamación, para orientarte mejor dentro del protocolo. No es
              un diagnóstico médico — es una herramienta de interpretación para
              personalizar tu experiencia.
            </p>
            <button
              type="button"
              onClick={() => setEtapa('pregunta')}
              className="w-full rounded-full bg-emerald-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-[0.98]"
            >
              Comenzar
            </button>
          </div>
        )}

        {etapa === 'tip' && (
          <div className="animate-fade-slide-in flex flex-col items-center gap-4 rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-xl shadow-emerald-900/5">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-600/30">
              <SparklesIcon className="h-7 w-7" />
            </span>
            <h2 className="text-xl font-bold text-neutral-900">{TIPS[pasoIndex].titulo(nombre)}</h2>
            <p className="text-neutral-600">{TIPS[pasoIndex].cuerpo}</p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-emerald-900/10">
              <div
                className="animate-barra-pausa h-full rounded-full bg-emerald-600"
                style={{ animationDuration: '2000ms' }}
                onAnimationEnd={continuarDesdeTip}
              />
            </div>
          </div>
        )}

        {etapa === 'pregunta' && (
          <div
            key={pasoIndex}
            className="animate-fade-slide-in flex max-h-[calc(100dvh-5.5rem)] flex-col gap-3 overflow-y-auto rounded-3xl border border-emerald-100 bg-white p-5 shadow-xl shadow-emerald-900/5 sm:p-8"
          >
            {pasoActual.tipo === 'pregunta' && (
              <>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    {iconoDePaso(pasoActual, 'h-4 w-4')}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                    {tituloDePaso(pasoActual)}
                  </span>
                </div>
                <PreguntaField
                  pregunta={PREGUNTAS[pasoActual.preguntaId]}
                  valor={respuestas[pasoActual.preguntaId]}
                  onChange={(valor) =>
                    actualizarRespuesta(
                      pasoActual.preguntaId,
                      valor,
                      PREGUNTAS[pasoActual.preguntaId].tipo === 'single'
                    )
                  }
                  error={erroresCampos.includes(pasoActual.preguntaId)}
                />
              </>
            )}

            {pasoActual.tipo === 'datos-personales' && (
              <DatosPersonalesForm
                nombre={(respuestas.nombre as string) ?? ''}
                email={(respuestas.email as string) ?? ''}
                onChangeNombre={(v) => actualizarRespuesta('nombre', v)}
                onChangeEmail={(v) => actualizarRespuesta('email', v)}
                onEnter={irSiguiente}
                errorNombre={erroresCampos.includes('nombre')}
                errorEmail={erroresCampos.includes('email')}
              />
            )}

            {pasoActual.tipo === 'habitos-generales' && (
              <HabitosGeneralesForm
                valores={{
                  p12: respuestas.p12 as string | undefined,
                  p13: respuestas.p13 as string | undefined,
                  p18: respuestas.p18 as string | undefined,
                  p19: respuestas.p19 as string | undefined,
                }}
                onChange={(id, v) => actualizarRespuesta(id, v)}
                errores={erroresCampos}
              />
            )}

            <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
              <button
                type="button"
                onClick={irAtras}
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Atrás
              </button>
              <button
                type="button"
                onClick={irSiguiente}
                className={`flex items-center gap-2 rounded-full px-7 py-2.5 text-sm font-semibold shadow-md transition active:scale-[0.98] ${
                  respondida
                    ? 'bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-700'
                    : 'cursor-not-allowed bg-emerald-100 text-emerald-400 shadow-none'
                }`}
              >
                {pasoIndex === TOTAL_PASOS - 1 ? 'Ver mi resultado' : 'Continuar'}
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {etapa === 'transicion' && (
          <TransicionScreen nombre={nombre} onDone={() => setEtapa('procesando')} />
        )}

        {etapa === 'procesando' && (
          <ProcesandoScreen nombre={nombre} listo={fetchListo} onDone={alTerminarProcesamiento} />
        )}

        {etapa === 'revelado' && resultado && (
          <RevelacionScreen
            nombre={nombre}
            perfilLabel={resultado.perfil ? nombreAmigablePerfil(resultado.perfil) : 'tu patrón funcional'}
            onContinuar={() => setEtapa('resultado')}
          />
        )}

        {etapa === 'resultado' && resultado && (
          <ResultadoCompleto
            reporteTexto={resultado.reporte_texto}
            requiereDerivacion={resultado.requiere_derivacion}
            resumen={resumen}
            puntajes={resultado.puntajes}
            perfil={resultado.perfil}
          />
        )}

        {etapa === 'error' && (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-neutral-200 bg-white p-10 text-center shadow-xl">
            <p className="text-neutral-700">
              Algo salió mal al calcular tu resultado. Por favor intenta de nuevo.
            </p>
            <button
              type="button"
              onClick={() => setEtapa('pregunta')}
              className="rounded-full bg-emerald-600 px-6 py-2.5 font-semibold text-white transition hover:bg-emerald-700"
            >
              Reintentar
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
