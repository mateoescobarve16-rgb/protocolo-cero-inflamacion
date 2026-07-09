'use client';

import { useState } from 'react';
import { BLOQUES, PREGUNTAS } from '@/lib/quiz/preguntas';
import { PreguntaField } from './components/PreguntaField';
import { ProgressBar } from './components/ProgressBar';

type ValorRespuesta = string | string[];
type Etapa = 'bienvenida' | 'bloque' | 'enviando' | 'resultado' | 'error';

interface ResultadoAPI {
  reporte_texto: string;
  requiere_derivacion: boolean;
  nota_condicion_previa: boolean;
}

export default function DiagnosticoPage() {
  const [etapa, setEtapa] = useState<Etapa>('bienvenida');
  const [bloqueIndex, setBloqueIndex] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, ValorRespuesta>>({});
  const [erroresBloque, setErroresBloque] = useState<string[]>([]);
  const [resultado, setResultado] = useState<ResultadoAPI | null>(null);

  const bloqueActual = BLOQUES[bloqueIndex];

  function actualizarRespuesta(preguntaId: string, valor: ValorRespuesta) {
    setRespuestas((prev) => ({ ...prev, [preguntaId]: valor }));
    setErroresBloque((prev) => prev.filter((id) => id !== preguntaId));
  }

  function validarBloqueActual(): string[] {
    return bloqueActual.preguntaIds.filter((id) => {
      const pregunta = PREGUNTAS[id];
      const valor = respuestas[id];
      if (pregunta.tipo === 'multi') return !Array.isArray(valor) || valor.length === 0;
      return typeof valor !== 'string' || valor.trim() === '';
    });
  }

  function irSiguiente() {
    const faltantes = validarBloqueActual();
    if (faltantes.length > 0) {
      setErroresBloque(faltantes);
      return;
    }

    if (bloqueIndex === BLOQUES.length - 1) {
      enviarDiagnostico();
      return;
    }

    setBloqueIndex((i) => i + 1);
    setErroresBloque([]);
  }

  function irAtras() {
    if (bloqueIndex === 0) {
      setEtapa('bienvenida');
      return;
    }
    setBloqueIndex((i) => i - 1);
    setErroresBloque([]);
  }

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

  return (
    <main className="flex min-h-screen flex-col items-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-xl">
        {etapa === 'bienvenida' && (
          <div className="flex flex-col gap-6 text-center">
            <h1 className="text-3xl font-semibold text-neutral-900">
              Diagnóstico de Perfil Funcional
            </h1>
            <p className="text-neutral-600">
              Este cuestionario te toma unos minutos y nos ayuda a entender tu patrón
              principal de inflamación, para orientarte mejor dentro del Protocolo Cero
              Inflamación. No es un diagnóstico médico — es una herramienta de
              interpretación para personalizar tu experiencia.
            </p>
            <button
              type="button"
              onClick={() => setEtapa('bloque')}
              className="mx-auto rounded-full bg-emerald-600 px-8 py-3 font-medium text-white transition hover:bg-emerald-700"
            >
              Comenzar
            </button>
          </div>
        )}

        {etapa === 'bloque' && (
          <div className="flex flex-col gap-8">
            <ProgressBar pasoActual={bloqueIndex + 1} totalPasos={BLOQUES.length} />

            <div>
              <h2 className="mb-6 text-xl font-semibold text-neutral-900">
                {bloqueActual.titulo}
              </h2>

              <div className="flex flex-col gap-8">
                {bloqueActual.preguntaIds.map((id) => (
                  <PreguntaField
                    key={id}
                    pregunta={PREGUNTAS[id]}
                    valor={respuestas[id]}
                    onChange={(valor) => actualizarRespuesta(id, valor)}
                    error={erroresBloque.includes(id)}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={irAtras}
                className="rounded-full border border-neutral-300 px-6 py-2 text-neutral-600 transition hover:bg-neutral-100"
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={irSiguiente}
                className="rounded-full bg-emerald-600 px-8 py-2 font-medium text-white transition hover:bg-emerald-700"
              >
                {bloqueIndex === BLOQUES.length - 1 ? 'Ver mi resultado' : 'Siguiente'}
              </button>
            </div>
          </div>
        )}

        {etapa === 'enviando' && (
          <div className="flex flex-col items-center gap-4 py-24 text-neutral-500">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
            <p>Calculando tu perfil funcional...</p>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="flex flex-col gap-6">
            <div
              className={`rounded-2xl border p-6 ${
                resultado.requiere_derivacion
                  ? 'border-amber-300 bg-amber-50'
                  : 'border-emerald-200 bg-white'
              }`}
            >
              {resultado.reporte_texto.split('\n\n').map((parrafo, i) => (
                <p key={i} className="mb-4 whitespace-pre-line text-neutral-700 last:mb-0">
                  {parrafo}
                </p>
              ))}
            </div>
          </div>
        )}

        {etapa === 'error' && (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <p className="text-neutral-700">
              Algo salió mal al calcular tu resultado. Por favor intenta de nuevo.
            </p>
            <button
              type="button"
              onClick={() => setEtapa('bloque')}
              className="rounded-full bg-emerald-600 px-6 py-2 font-medium text-white transition hover:bg-emerald-700"
            >
              Reintentar
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
