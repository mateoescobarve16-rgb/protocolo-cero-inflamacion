import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-[var(--background)] px-6 text-center">
      <div className="flex max-w-lg flex-col items-center gap-5 rounded-3xl border border-emerald-100 bg-white p-10 shadow-xl shadow-emerald-900/5">
        <span className="rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Protocolo Cero Inflamación
        </span>
        <h1 className="text-3xl font-bold leading-tight text-neutral-900">
          Descubre tu patrón funcional
        </h1>
        <p className="text-neutral-600">
          Un diagnóstico de 23 preguntas, una pantalla a la vez, para entender tu patrón
          dominante y recibir un reporte personalizado que oriente tu protocolo.
        </p>
        <Link
          href="/diagnostico"
          className="w-full rounded-full bg-emerald-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-[0.98]"
        >
          Hacer el diagnóstico
        </Link>
      </div>
    </main>
  );
}
