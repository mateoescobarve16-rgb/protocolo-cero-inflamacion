'use client';

import { useEffect, useRef, useState } from 'react';
import { PREGUNTAS, TODAS_LAS_PREGUNTAS_IDS, obtenerBloqueDePregunta } from '@/lib/quiz/preguntas';
import { PreguntaField } from './components/PreguntaField';
import { ProgressBar } from './components/ProgressBar';

type ValorRespuesta = string | string[];
type Etapa = 'bienvenida' | 'pregunta' | 'enviando' | 'resultado' | 'error';

interface ResultadoAPI {
  reporte_texto: string;
  requiere_derivacion: boolean;
  nota_condicion_previa: boolean;
}

const TOTAL_PREGUNTAS = TODAS_LAS_PREGUNTAS_IDS.length;

export default function DiagnosticoPage() {
  const [etapa, setEtapa] = useState<Etapa>('bienvenida');
  const [pasoIndex, setPasoIndex] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, ValorRespuesta>>({});
  const [error, setError] = useState(false);
  const [resultado, setResultado] = useState<ResultadoAPI | null>(null);

  const preguntaId = TODAS_LAS_PREGUNTAS_IDS[pasoIndex];
  const pregunta = PREGUNTAS[preguntaId];
  const bloque = obtenerBloqueDePregunta(preguntaId);

  const irSiguienteRef = useRef<() => void>(() => {});
  const autoAvanzarTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function limpiarAutoAvance() {
    if (autoAvanzarTimeout.current) {
      clearTimeout(autoAvanzarTimeout.current);
      autoAvanzarTimeout.current = null;
    }
  }

  // Cancela cualquier auto-avance pendiente si el usuario navega (ej. con "Atrás") antes de que dispare.
  useEffect(() => limpiarAutoAvance, [pasoIndex]);

  async function enviarDiagnostico() {
    setEtapa('enviando');
    try {
      const res = await fetch('/api/calcular-perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(respuestas),
      });

      if (!res.ok) throw new Error('Respuesta no válida del servidor');

      const data: ResultadoAPI = await res.json();
      setResultado(data);
      setEtapa('resultado');
    } catch {
      setEtapa('error');
    }
  }

  function irSiguiente() {
    const valor = respuestas[preguntaId];
    const invalido =
      pregunta.tipo === 'multi'
        ? !Array.isArray(valor) || valor.length === 0
        : typeof valor !== 'string' || valor.trim() === '';

    if (invalido) {
      setError(true);
      return;
    }

    if (pasoIndex === TOTAL_PREGUNTAS - 1) {
      enviarDiagnostico();
      return;
    }

    setPasoIndex((i) => i + 1);
    setError(false);
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
    setError(false);
  }

  function actualizarRespuesta(valor: ValorRespuesta, autoAvanzar = false) {
    setRespuestas((prev) => ({ ...prev, [preguntaId]: valor }));
    setError(false);
    if (autoAvanzar) {
      limpiarAutoAvance();
      autoAvanzarTimeout.current = setTimeout(() => irSiguienteRef.current(), 380);
    }
  }

  return (
    <main className="flex h-dvh flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-emerald-50 px-4 py-4">
      {etapa === 'pregunta' && <ProgressBar pasoActual={pasoIndex + 1} totalPasos={TOTAL_PREGUNTAS} />}

      <div className="flex w-full max-w-md flex-col">
        {etapa === 'bienvenida' && (
          <div className="flex flex-col items-center gap-5 rounded-3xl border border-emerald-100 bg-white/90 p-8 text-center shadow-xl shadow-emerald-900/5">
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

        {etapa === 'pregunta' && (
          <div
            key={preguntaId}
            className="animate-fade-slide-in flex max-h-[calc(100dvh-2rem)] flex-col gap-5 overflow-y-auto rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-xl shadow-emerald-900/5 sm:p-8"
          >
            <div className="flex items-center justify-between text-xs font-medium text-emerald-600">
              <span className="uppercase tracking-wide">{bloque.titulo}</span>
              <span className="text-neutral-400">
                {pasoIndex + 1} / {TOTAL_PREGUNTAS}
              </span>
            </div>

            <PreguntaField
              pregunta={pregunta}
              valor={respuestas[preguntaId]}
              onChange={(valor) => actualizarRespuesta(valor, pregunta.tipo === 'single')}
              onEnter={irSiguiente}
              error={error}
            />

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={irAtras}
                className="rounded-full px-4 py-2 text-sm font-medium text-neutral-500 transition hover:bg-neutral-100"
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={irSiguiente}
                className="rounded-full bg-emerald-600 px-7 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-[0.98]"
              >
                {pasoIndex === TOTAL_PREGUNTAS - 1 ? 'Ver mi resultado' : 'Continuar'}
              </button>
            </div>
          </div>
        )}

        {etapa === 'enviando' && (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-emerald-100 bg-white/90 p-12 text-neutral-500 shadow-xl shadow-emerald-900/5">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
            <p>Calculando tu perfil funcional...</p>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div
            className={`flex max-h-[calc(100dvh-2rem)] flex-col gap-4 overflow-y-auto rounded-3xl border p-6 shadow-xl sm:p-8 ${
              resultado.requiere_derivacion
                ? 'border-amber-200 bg-amber-50 shadow-amber-900/5'
                : 'border-emerald-100 bg-white/90 shadow-emerald-900/5'
            }`}
          >
            {resultado.reporte_texto.split('\n\n').map((parrafo, i) => (
              <p key={i} className="whitespace-pre-line leading-relaxed text-neutral-700">
                {parrafo}
              </p>
            ))}
          </div>
        )}

        {etapa === 'error' && (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-neutral-200 bg-white/90 p-10 text-center shadow-xl">
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
