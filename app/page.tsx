import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-neutral-50 px-6 text-center">
      <div className="flex max-w-lg flex-col items-center gap-6">
        <h1 className="text-3xl font-semibold text-neutral-900">
          Protocolo Cero Inflamación
        </h1>
        <p className="text-neutral-600">
          Descubre tu patrón funcional dominante con un diagnóstico de 23 preguntas y
          recibe un reporte personalizado para orientar tu protocolo.
        </p>
        <Link
          href="/diagnostico"
          className="rounded-full bg-emerald-600 px-8 py-3 font-medium text-white transition hover:bg-emerald-700"
        >
          Hacer el diagnóstico
        </Link>
      </div>
    </main>
  );
}
