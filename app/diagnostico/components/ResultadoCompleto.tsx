import Link from 'next/link';
import { PREGUNTAS } from '@/lib/quiz/preguntas';
import { nombreAmigablePerfil } from '@/lib/quiz/perfilLabels';
import type { SeccionReporte } from '@/lib/scoring/tipos';
import {
  ActivityIcon,
  ArrowRightIcon,
  ClockIcon,
  DropletIcon,
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
  secciones?: SeccionReporte[];
  nombre?: string;
  resumen?: ResumenDiagnostico;
  puntajes?: Record<string, number>;
  perfil?: string;
  aguaId?: string;
  suenoId?: string;
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

function analizarParrafo(texto: string, esPrimero: boolean) {
  const t = texto.toLowerCase();
  if (t.includes('en conjunto con tu médico')) return { Icono: HeartIcon, tono: 'alerta' as const };
  if (t.includes('componente secundario')) return { Icono: SparklesIcon, tono: 'ok' as const };
  if (esPrimero) return { Icono: SparklesIcon, tono: 'ok' as const };
  if (t.includes('fase') || t.includes('protocolo completo')) return { Icono: HeartIcon, tono: 'ok' as const };
  return { Icono: ActivityIcon, tono: 'ok' as const };
}

function iconoDeSeccion(titulo: string) {
  if (titulo === 'Qué te recomendamos') return HeartIcon;
  if (titulo === 'Notas adicionales') return SunIcon;
  return SparklesIcon;
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

/** "Marcado" si el puntaje ganador es notoriamente alto; "moderado" en cualquier otro caso (incluye híbridos). */
function textoIntensidad(puntajes: Record<string, number>, perfil: string): string {
  const letras = perfil.split('+');
  const maxScore = Math.max(...letras.map((l) => puntajes[l] ?? 0));
  return maxScore >= 7
    ? 'Es un patrón bastante marcado, no una señal aislada.'
    : 'Es una señal presente, con espacio para otros factores en juego.';
}

const ZONA_OPTIMA_AGUA = ['1.5_a_2.5L', 'mas_2.5L'];
const ZONA_OPTIMA_SUENO = ['7_a_8h', 'mas_8h'];

const TIP_AGUA: Record<string, string> = {
  menos_1L:
    'Estás por debajo de lo recomendado. Empieza el día con un vaso grande de agua antes del café, y ten una botella siempre visible — subir de a poco es más sostenible que un cambio brusco.',
  '1_a_1.5L': 'Vas por buen camino, pero aún puedes subir un poco. Prueba agregar un vaso más en la tarde.',
  '1.5_a_2.5L': 'Tu hidratación está en un buen rango. Mantenla, especialmente los días que sientas más hinchazón.',
  'mas_2.5L': 'Tu hidratación está en un excelente rango.',
};

const TIP_SUENO: Record<string, string> = {
  menos_5h:
    'Estás durmiendo menos de lo recomendado (7-9h). En vez de intentar dormir 2 horas más de golpe, prueba adelantar tu hora de dormir 20-30 minutos esta semana.',
  '5_a_6h': 'Estás cerca del rango, pero aún corto. Prueba adelantar tu hora de dormir unos 20 minutos.',
  '7_a_8h': 'Tus horas de sueño están en un buen rango. Enfócate en la calidad: evita pantallas 30 minutos antes de dormir.',
  mas_8h: 'Duermes lo suficiente. Si aún sientes cansancio, puede valer la pena revisar la calidad del sueño con tu médico.',
};

function GaugeCampo({ preguntaId, valorId }: { preguntaId: string; valorId: string }) {
  const opciones = PREGUNTAS[preguntaId].opciones ?? [];
  const indice = opciones.findIndex((o) => o.id === valorId);
  const zonaOptima = preguntaId === 'p12' ? ZONA_OPTIMA_AGUA : ZONA_OPTIMA_SUENO;
  const pct = indice >= 0 ? ((indice + 0.5) / opciones.length) * 100 : 0;
  const pctEtiqueta = Math.min(85, Math.max(15, pct));

  return (
    <div className="flex flex-col gap-1">
      {indice >= 0 && (
        <div className="relative h-6">
          <div
            className="absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-full bg-neutral-800 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow"
            style={{ left: `${pctEtiqueta}%` }}
          >
            Tú: {opciones[indice]?.label}
          </div>
        </div>
      )}
      <div className="relative flex h-2.5 w-full overflow-hidden rounded-full">
        {opciones.map((o) => (
          <div
            key={o.id}
            className={`flex-1 border-l-2 border-white first:border-l-0 ${
              zonaOptima.includes(o.id) ? 'bg-emerald-400' : 'bg-amber-300'
            } ${o.id === valorId ? 'ring-2 ring-inset ring-neutral-800' : ''}`}
          />
        ))}
      </div>
      {indice >= 0 && (
        <div className="relative h-2">
          <div
            className="absolute top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-neutral-800 shadow"
            style={{ left: `${pct}%` }}
          />
        </div>
      )}
      <div className="flex justify-between text-[11px] text-neutral-400">
        <span>{opciones[0]?.label}</span>
        <span>{opciones[opciones.length - 1]?.label}</span>
      </div>
    </div>
  );
}

/** Un párrafo dentro de una sección: normal, salvo la nota de coordinar con médico, que se resalta aparte. */
function ParrafoDeSeccion({ texto }: { texto: string }) {
  const esNotaMedica = texto.toLowerCase().includes('en conjunto con tu médico');
  if (esNotaMedica) {
    return (
      <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 leading-relaxed text-amber-900">
        {renderConNegritas(texto)}
      </p>
    );
  }
  return <p className="leading-relaxed text-neutral-700">{renderConNegritas(texto)}</p>;
}

export function ResultadoCompleto({
  reporteTexto,
  secciones,
  nombre,
  resumen,
  puntajes,
  perfil,
  aguaId,
  suenoId,
}: ResultadoCompletoProps) {
  const parrafosPlanos = reporteTexto.split('\n\n').filter(Boolean);
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
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          {nombre ? `${nombre}, este es tu patrón funcional` : 'Tu patrón funcional'}
        </h1>
        <p className="text-neutral-500">Esto es lo que encontramos al cruzar tus respuestas.</p>
      </div>

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

      {puntajes && perfil && (
        <div className="flex flex-col gap-3 rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-900/5 sm:p-8">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Cómo se distribuyen tus señales</h2>
            <p className="text-sm text-neutral-500">
              Cada patrón agrupa señales distintas — normalmente hay uno dominante, pero es común tener
              rasgos de más de uno. {textoIntensidad(puntajes, perfil)}
            </p>
          </div>
          <GraficoPuntajes puntajes={puntajes} dominantes={dominantes} />
        </div>
      )}

      {(aguaId || suenoId) && (
        <div className="flex flex-col gap-5 rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-900/5 sm:p-8">
          <h2 className="text-lg font-bold text-neutral-900">Recomendaciones rápidas</h2>

          {aguaId && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
                <DropletIcon className="h-4 w-4 text-indigo-500" />
                Hidratación
              </div>
              <GaugeCampo preguntaId="p12" valorId={aguaId} />
              <p className="text-sm text-neutral-600">{TIP_AGUA[aguaId]}</p>
            </div>
          )}

          {suenoId && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
                <MoonIcon className="h-4 w-4 text-indigo-500" />
                Sueño
              </div>
              <GaugeCampo preguntaId="p18" valorId={suenoId} />
              <p className="text-sm text-neutral-600">{TIP_SUENO[suenoId]}</p>
            </div>
          )}
        </div>
      )}

      {secciones ? (
        <div className="flex flex-col gap-4">
          {secciones.map((seccion) => {
            const Icono = iconoDeSeccion(seccion.titulo);
            return (
              <div
                key={seccion.titulo}
                className="flex flex-col gap-3 rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-900/5 sm:p-8"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
                    <Icono className="h-5 w-5" />
                  </span>
                  <h2 className="text-lg font-bold text-neutral-900">{seccion.titulo}</h2>
                </div>
                <div className="flex flex-col gap-3">
                  {seccion.parrafos.map((parrafo, i) => (
                    <ParrafoDeSeccion key={i} texto={parrafo} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {parrafosPlanos.map((parrafo, i) => {
            const { Icono, tono } = analizarParrafo(parrafo, i === 0);
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
      )}

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
