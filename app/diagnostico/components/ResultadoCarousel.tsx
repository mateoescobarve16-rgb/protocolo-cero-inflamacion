'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ActivityIcon,
  AlertTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ClockIcon,
  HeartIcon,
  MoonIcon,
  SparklesIcon,
  SunIcon,
} from './Icons';

export interface ResumenDiagnostico {
  sintomaPrincipal: string;
  tiempoSintoma: string;
  nivelEstres: string;
  horasSueno: string;
  patronDominante: string;
}

interface ResultadoCarouselProps {
  reporteTexto: string;
  requiereDerivacion: boolean;
  resumen?: ResumenDiagnostico;
}

const TINTES = {
  rose: 'bg-rose-50 text-rose-600',
  amber: 'bg-amber-50 text-amber-600',
  orange: 'bg-orange-50 text-orange-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  emerald: 'bg-emerald-50 text-emerald-700',
} as const;

function analizarParrafo(texto: string, esPrimero: boolean, requiereDerivacion: boolean) {
  const t = texto.toLowerCase();

  if (requiereDerivacion) return { Icono: AlertTriangleIcon, tono: 'alerta' as const };
  if (t.includes('en conjunto con tu médico')) return { Icono: HeartIcon, tono: 'alerta' as const };
  if (t.includes('componente secundario')) return { Icono: SparklesIcon, tono: 'ok' as const };
  if (esPrimero) return { Icono: SparklesIcon, tono: 'ok' as const };
  if (t.includes('fase') || t.includes('protocolo completo')) return { Icono: HeartIcon, tono: 'ok' as const };
  return { Icono: ActivityIcon, tono: 'ok' as const };
}

export function ResultadoCarousel({ reporteTexto, requiereDerivacion, resumen }: ResultadoCarouselProps) {
  const parrafos = reporteTexto.split('\n\n').filter(Boolean);
  const [indice, setIndice] = useState(0);

  const filasResumen = resumen
    ? [
        { icono: ActivityIcon, tinte: 'rose' as const, etiqueta: 'SÍNTOMA PRINCIPAL', valor: resumen.sintomaPrincipal },
        { icono: ClockIcon, tinte: 'amber' as const, etiqueta: 'TIEMPO CON EL SÍNTOMA', valor: resumen.tiempoSintoma },
        { icono: SunIcon, tinte: 'orange' as const, etiqueta: 'NIVEL DE ESTRÉS', valor: resumen.nivelEstres },
        { icono: MoonIcon, tinte: 'indigo' as const, etiqueta: 'HORAS DE SUEÑO', valor: resumen.horasSueno },
        {
          icono: SparklesIcon,
          tinte: 'emerald' as const,
          etiqueta: 'PATRÓN DOMINANTE',
          valor: resumen.patronDominante,
          destacado: true,
        },
      ]
    : [];

  const total = parrafos.length + (resumen ? 1 : 0);
  const esTarjetaResumen = resumen !== undefined && indice === 0;
  const indiceParrafo = resumen ? indice - 1 : indice;
  const esUltima = indice === total - 1;

  const { Icono, tono } = esTarjetaResumen
    ? { Icono: SparklesIcon, tono: 'ok' as const }
    : analizarParrafo(parrafos[indiceParrafo], indiceParrafo === 0, requiereDerivacion);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= indice ? 'bg-emerald-600' : 'bg-emerald-900/10'
            }`}
          />
        ))}
      </div>

      {esTarjetaResumen ? (
        <div
          key="resumen"
          className="animate-fade-slide-in flex flex-col gap-3 rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-900/5 sm:p-8"
        >
          <h3 className="text-lg font-bold text-neutral-900">Resumen de tu patrón funcional</h3>
          <div className="flex flex-col gap-2">
            {filasResumen.map((fila) => (
              <div
                key={fila.etiqueta}
                className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 ${
                  fila.destacado ? 'bg-emerald-50' : 'bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${TINTES[fila.tinte]}`}>
                    {fila.icono({ className: 'h-4 w-4' })}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    {fila.etiqueta}
                  </span>
                </div>
                <span
                  className={`text-right text-sm font-bold ${fila.destacado ? 'text-emerald-700' : 'text-neutral-800'}`}
                >
                  {fila.valor}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
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
          <p className="whitespace-pre-line leading-relaxed text-neutral-700">{parrafos[indiceParrafo]}</p>
        </div>
      )}

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
