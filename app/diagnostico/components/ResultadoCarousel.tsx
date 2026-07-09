'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ActivityIcon, AlertTriangleIcon, ArrowLeftIcon, ArrowRightIcon, HeartIcon, SparklesIcon } from './Icons';

interface ResultadoCarouselProps {
  reporteTexto: string;
  requiereDerivacion: boolean;
}

function analizarParrafo(texto: string, index: number, requiereDerivacion: boolean) {
  const t = texto.toLowerCase();

  if (requiereDerivacion) return { Icono: AlertTriangleIcon, tono: 'alerta' as const };
  if (t.includes('en conjunto con tu médico')) return { Icono: HeartIcon, tono: 'alerta' as const };
  if (t.includes('componente secundario')) return { Icono: SparklesIcon, tono: 'ok' as const };
  if (index === 0) return { Icono: SparklesIcon, tono: 'ok' as const };
  if (t.includes('fase') || t.includes('protocolo completo')) return { Icono: HeartIcon, tono: 'ok' as const };
  return { Icono: ActivityIcon, tono: 'ok' as const };
}

export function ResultadoCarousel({ reporteTexto, requiereDerivacion }: ResultadoCarouselProps) {
  const parrafos = reporteTexto.split('\n\n').filter(Boolean);
  const [indice, setIndice] = useState(0);
  const total = parrafos.length;
  const esUltima = indice === total - 1;

  const { Icono, tono } = analizarParrafo(parrafos[indice], indice, requiereDerivacion);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex gap-1.5">
        {parrafos.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= indice ? 'bg-emerald-600' : 'bg-emerald-900/10'
            }`}
          />
        ))}
      </div>

      <div
        key={indice}
        className={`animate-fade-slide-in flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-3xl border p-6 text-center shadow-xl sm:p-8 ${
          tono === 'alerta'
            ? 'border-amber-200 bg-amber-50 shadow-amber-900/5'
            : 'border-emerald-100 bg-white shadow-emerald-900/5'
        }`}
      >
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
            tono === 'alerta'
              ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white'
              : 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white'
          } shadow-lg`}
        >
          <Icono className="h-7 w-7" />
        </span>
        <p className="whitespace-pre-line leading-relaxed text-neutral-700">{parrafos[indice]}</p>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIndice((i) => Math.max(0, i - 1))}
          disabled={indice === 0}
          className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600 disabled:pointer-events-none disabled:opacity-0"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Atrás
        </button>

        {!esUltima ? (
          <button
            type="button"
            onClick={() => setIndice((i) => Math.min(total - 1, i + 1))}
            className="flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-[0.98]"
          >
            Siguiente
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-[0.98]"
          >
            Volver al inicio
          </Link>
        )}
      </div>
    </div>
  );
}
