'use client';

import { useEffect, useState } from 'react';
import { ActivityIcon, ArrowRightIcon, CheckIcon, SparklesIcon } from './Icons';

interface TransicionScreenProps {
  nombre: string;
  onDone: () => void;
  duracionMs?: number;
}

export function TransicionScreen({ nombre, onDone, duracionMs = 2800 }: TransicionScreenProps) {
  useEffect(() => {
    const t = setTimeout(onDone, duracionMs);
    return () => clearTimeout(t);
  }, [onDone, duracionMs]);

  return (
    <div className="animate-fade-slide-in flex flex-col items-center gap-4 rounded-3xl border border-emerald-100 bg-white p-10 text-center shadow-xl shadow-emerald-900/5">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-600/30">
        <SparklesIcon className="h-7 w-7" />
      </span>
      <h2 className="text-xl font-bold text-neutral-900">
        {nombre ? `${nombre}, ya casi terminamos` : 'Ya casi terminamos'}
      </h2>
      <p className="text-neutral-600">
        Con todo lo que nos compartiste, ahora vamos a cruzar tus respuestas para armar tu
        patrón funcional completo.
      </p>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-emerald-900/10">
        <div
          className="animate-barra-pausa h-full rounded-full bg-emerald-600"
          style={{ animationDuration: `${duracionMs}ms` }}
        />
      </div>
    </div>
  );
}

const PASOS_PROCESAMIENTO = [
  'Analizando tus respuestas',
  'Cruzando tus síntomas digestivos, hormonales y de estrés',
  'Identificando tu patrón funcional dominante',
  'Redactando tu reporte personalizado',
];

interface ProcesandoScreenProps {
  nombre: string;
  listo: boolean;
  onDone: () => void;
}

export function ProcesandoScreen({ nombre, listo, onDone }: ProcesandoScreenProps) {
  const [visibles, setVisibles] = useState(0);

  useEffect(() => {
    if (visibles >= PASOS_PROCESAMIENTO.length) return;
    const t = setTimeout(() => setVisibles((v) => v + 1), 900);
    return () => clearTimeout(t);
  }, [visibles]);

  const animacionCompleta = visibles >= PASOS_PROCESAMIENTO.length;

  useEffect(() => {
    if (!animacionCompleta || !listo) return;
    const t = setTimeout(onDone, 400);
    return () => clearTimeout(t);
  }, [animacionCompleta, listo, onDone]);

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-900/5 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <ActivityIcon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Preparando tu reporte...</h2>
          <p className="text-sm text-neutral-500">{nombre ? `Un momento, ${nombre}` : 'Un momento'}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {PASOS_PROCESAMIENTO.map((texto, i) => (
          <div
            key={texto}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition-colors duration-300 ${
              i < visibles
                ? 'animate-check-pop border-emerald-100 bg-emerald-50 text-emerald-900'
                : 'border-neutral-100 bg-neutral-50 text-neutral-400'
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                i < visibles ? 'bg-emerald-500 text-white' : 'border-2 border-neutral-300'
              }`}
            >
              {i < visibles && <CheckIcon className="h-3.5 w-3.5" />}
            </span>
            {texto}
          </div>
        ))}
      </div>
    </div>
  );
}

interface RevelacionScreenProps {
  nombre: string;
  perfilLabel: string;
  onContinuar: () => void;
}

export function RevelacionScreen({ nombre, perfilLabel, onContinuar }: RevelacionScreenProps) {
  return (
    <div className="animate-fade-slide-in flex flex-col items-center gap-4 rounded-3xl border border-emerald-600 bg-gradient-to-br from-emerald-500 to-emerald-700 p-8 text-center text-white shadow-xl shadow-emerald-900/20">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
        <SparklesIcon className="h-7 w-7" />
      </span>
      <h2 className="text-2xl font-bold">{nombre ? `¡Listo, ${nombre}!` : '¡Listo!'}</h2>
      <p className="text-emerald-50">Tu patrón funcional está listo.</p>
      <span className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium">
        Patrón dominante: {perfilLabel}
      </span>
      <button
        type="button"
        onClick={onContinuar}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 font-semibold text-emerald-700 shadow-lg transition hover:bg-emerald-50 active:scale-[0.98]"
      >
        Ver mi resultado completo
        <ArrowRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
