'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ResultadoCompleto } from './diagnostico/components/ResultadoCompleto';
import { ArrowRightIcon, EnvelopeIcon } from './diagnostico/components/Icons';

type Vista = 'inicio' | 'buscando-email' | 'buscando' | 'encontrado' | 'no-encontrado' | 'error';

interface ResultadoPlan {
  reporte_texto: string;
}

export default function Home() {
  const [vista, setVista] = useState<Vista>('inicio');
  const [email, setEmail] = useState('');
  const [resultado, setResultado] = useState<ResultadoPlan | null>(null);

  async function buscarPlan(e: FormEvent) {
    e.preventDefault();
    setVista('buscando');
    try {
      const res = await fetch('/api/buscar-resultado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.encontrado) {
        setResultado(data);
        setVista('encontrado');
      } else if (res.ok) {
        setVista('no-encontrado');
      } else {
        setVista('error');
      }
    } catch {
      setVista('error');
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-[var(--background)] px-6 py-10 text-center">
      <div className={`w-full ${vista === 'encontrado' ? 'max-w-lg' : 'max-w-md'}`}>
        {vista === 'inicio' && (
          <div className="flex flex-col items-center gap-5 rounded-3xl border border-emerald-100 bg-white p-10 shadow-xl shadow-emerald-900/5">
            <span className="rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Protocolo Cero Inflamación
            </span>
            <h1 className="text-3xl font-bold leading-tight text-neutral-900">
              Descubre tu patrón funcional
            </h1>
            <p className="text-neutral-600">
              Un diagnóstico de preguntas para entender tu patrón dominante y recibir un
              reporte personalizado que oriente tu protocolo.
            </p>
            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <Link
                href="/diagnostico"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-[0.98]"
              >
                Comenzar
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => setVista('buscando-email')}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-emerald-200 px-6 py-3.5 font-semibold text-emerald-700 transition hover:bg-emerald-50 active:scale-[0.98]"
              >
                Ver mi plan
              </button>
            </div>
          </div>
        )}

        {vista === 'buscando-email' && (
          <form
            onSubmit={buscarPlan}
            className="flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-white p-8 text-left shadow-xl shadow-emerald-900/5"
          >
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Ver mi plan</h2>
              <p className="text-sm text-neutral-500">
                Escribe el correo con el que hiciste tu diagnóstico.
              </p>
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                <EnvelopeIcon className="h-5 w-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                autoFocus
                className="w-full rounded-2xl border-2 border-neutral-200 bg-white py-3.5 pl-12 pr-5 text-base text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setVista('inicio')}
                className="rounded-full px-3 py-2 text-sm font-medium text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600"
              >
                Atrás
              </button>
              <button
                type="submit"
                className="rounded-full bg-emerald-600 px-7 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-[0.98]"
              >
                Buscar
              </button>
            </div>
          </form>
        )}

        {vista === 'buscando' && (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-emerald-100 bg-white p-12 text-neutral-500 shadow-xl shadow-emerald-900/5">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
            <p>Buscando tu plan...</p>
          </div>
        )}

        {vista === 'encontrado' && resultado && (
          <ResultadoCompleto reporteTexto={resultado.reporte_texto} />
        )}

        {vista === 'error' && (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-neutral-200 bg-white p-10 text-center shadow-xl">
            <p className="text-neutral-700">
              Algo salió mal al buscar tu plan. Por favor intenta de nuevo.
            </p>
            <button
              type="button"
              onClick={() => setVista('buscando-email')}
              className="rounded-full bg-emerald-600 px-6 py-2.5 font-semibold text-white transition hover:bg-emerald-700"
            >
              Reintentar
            </button>
          </div>
        )}

        {vista === 'no-encontrado' && (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-neutral-200 bg-white p-10 text-center shadow-xl">
            <p className="text-neutral-700">No encontramos un diagnóstico con ese correo.</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setVista('buscando-email')}
                className="rounded-full border-2 border-emerald-200 px-6 py-2.5 font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Intentar de nuevo
              </button>
              <Link
                href="/diagnostico"
                className="rounded-full bg-emerald-600 px-6 py-2.5 font-semibold text-white transition hover:bg-emerald-700"
              >
                Hacer el diagnóstico
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
