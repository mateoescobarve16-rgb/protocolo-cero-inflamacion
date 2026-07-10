import Link from 'next/link';
import { nombreAmigablePerfil } from '@/lib/quiz/perfilLabels';
import {
  ActivityIcon,
  AlertTriangleIcon,
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

interface ResultadoCompletoProps {
  reporteTexto: string;
  requiereDerivacion: boolean;
  resumen?: ResumenDiagnostico;
  puntajes?: Record<string, number>;
  perfil?: string;
}

const TINTES = {
  rose: 'bg-rose-50 text-rose-600',
  amber: 'bg-amber-50 text-amber-600',
  orange: 'bg-orange-50 text-orange-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  emerald: 'bg-emerald-50 text-emerald-700',
} as const;

/** Convierte **negrita** en <strong>, ya que el texto se muestra tal cual, sin parser de markdown. */
function renderConNegritas(texto: string) {
  return texto.split(/(\*\*[^*]+\*\*)/g).map((parte, i) =>
    parte.startsWith('**') && parte.endsWith('**') ? (
      <strong key={i} className="font-semibold text-neutral-900">
        {parte.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{parte}</span>
    )
  );
}

function analizarParrafo(texto: string, esPrimero: boolean, requiereDerivacion: boolean) {
  const t = texto.toLowerCase();

  if (requiereDerivacion) return { Icono: AlertTriangleIcon, tono: 'alerta' as const };
  if (t.includes('en conjunto con tu médico')) return { Icono: HeartIcon, tono: 'alerta' as const };
  if (t.includes('componente secundario')) return { Icono: SparklesIcon, tono: 'ok' as const };
  if (esPrimero) return { Icono: SparklesIcon, tono: 'ok' as const };
  if (t.includes('fase') || t.includes('protocolo completo')) return { Icono: HeartIcon, tono: 'ok' as const };
  return { Icono: ActivityIcon, tono: 'ok' as const };
}

const PERFILES_ORDEN = ['A', 'B', 'C', 'D', 'E'] as const;

function GraficoPuntajes({ puntajes, dominantes }: { puntajes: Record<string, number>; dominantes: string[] }) {
  const max = Math.max(...Object.values(puntajes), 1);
  const filas = PERFILES_ORDEN.map((letra) => ({
    letra,
    nombre: nombreAmigablePerfil(letra),
    puntos: puntajes[letra] ?? 0,
  })).sort((a, b) => b.puntos - a.puntos);

  return (
    <div className="flex flex-col gap-3">
      {filas.map((fila) => {
        const esDominante = dominantes.includes(fila.letra);
        return (
          <div key={fila.letra} className="flex flex-col gap-1">
            <span className={`text-sm font-medium ${esDominante ? 'text-emerald-700' : 'text-neutral-500'}`}>
              {fila.nombre}
            </span>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-100">
              <div
                className={`h-full rounded-full transition-all ${esDominante ? 'bg-emerald-600' : 'bg-neutral-300'}`}
                style={{ width: `${Math.max((fila.puntos / max) * 100, 4)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ResultadoCompleto({
  reporteTexto,
  requiereDerivacion,
  resumen,
  puntajes,
  perfil,
}: ResultadoCompletoProps) {
  const parrafos = reporteTexto.split('\n\n').filter(Boolean);
  const dominantes = perfil ? perfil.split('+') : [];

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

  return (
    <div className="flex w-full flex-col gap-5 pb-10 text-left">
      {requiereDerivacion ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-amber-600 bg-gradient-to-br from-amber-400 to-amber-600 p-8 text-center text-white shadow-xl shadow-amber-900/20">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <AlertTriangleIcon className="h-7 w-7" />
          </span>
          <h1 className="text-xl font-bold">Es importante que consultes con un médico</h1>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Tu reporte completo</h1>
          <p className="text-neutral-500">Esto es lo que encontramos al cruzar tus respuestas.</p>
        </div>
      )}

      {resumen && (
        <div className="flex flex-col gap-3 rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-900/5 sm:p-8">
          <h2 className="text-lg font-bold text-neutral-900">Resumen de tu patrón funcional</h2>
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
      )}

      {puntajes && !requiereDerivacion && (
        <div className="flex flex-col gap-3 rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-900/5 sm:p-8">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Cómo se distribuyen tus señales</h2>
            <p className="text-sm text-neutral-500">
              Cada patrón agrupa señales distintas — normalmente hay uno dominante, pero es común tener
              rasgos de más de uno.
            </p>
          </div>
          <GraficoPuntajes puntajes={puntajes} dominantes={dominantes} />
        </div>
      )}

      <div className="flex flex-col gap-4">
        {parrafos.map((parrafo, i) => {
          const { Icono, tono } = analizarParrafo(parrafo, i === 0, requiereDerivacion);
          return (
            <div
              key={i}
              className={`flex gap-3 rounded-3xl border p-5 shadow-md sm:p-6 ${
                tono === 'alerta' ? 'border-amber-200 bg-amber-50' : 'border-emerald-100 bg-white'
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ${
                  tono === 'alerta'
                    ? 'bg-gradient-to-br from-amber-400 to-amber-600'
                    : 'bg-gradient-to-br from-emerald-400 to-emerald-600'
                }`}
              >
                <Icono className="h-5 w-5" />
              </span>
              <p className="whitespace-pre-line pt-1.5 text-left leading-relaxed text-neutral-700">
                {renderConNegritas(parrafo)}
              </p>
            </div>
          );
        })}
      </div>

      <Link
        href="/"
        className="mx-auto flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-[0.98]"
      >
        Volver al inicio
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </div>
  );
}
