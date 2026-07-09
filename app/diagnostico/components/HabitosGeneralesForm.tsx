import { PREGUNTAS } from '@/lib/quiz/preguntas';
import { ChevronDownIcon, ClockIcon, DropletIcon, MoonIcon, WineIcon } from './Icons';

type ValoresHabitos = {
  p12?: string;
  p13?: string;
  p18?: string;
  p19?: string;
};

interface HabitosGeneralesFormProps {
  valores: ValoresHabitos;
  onChange: (preguntaId: 'p12' | 'p13' | 'p18' | 'p19', valor: string) => void;
  errores: string[];
}

const INSIGHT_SUENO: Record<string, { texto: string; tono: 'alerta' | 'ok' }> = {
  menos_5h: {
    texto: 'Por debajo del rango recomendado (7-9h). Dormir poco puede sostener la inflamación.',
    tono: 'alerta',
  },
  '5_a_6h': {
    texto: 'Un poco por debajo del rango recomendado (7-9h).',
    tono: 'alerta',
  },
  '7_a_8h': {
    texto: 'Justo en el rango óptimo (7-9h).',
    tono: 'ok',
  },
  mas_8h: {
    texto: 'Por encima del promedio, dentro de un rango saludable.',
    tono: 'ok',
  },
};

function SelectCampo({
  label,
  icono: Icono,
  preguntaId,
  valor,
  onChange,
  error,
}: {
  label: string;
  icono?: (props: { className?: string }) => React.ReactElement;
  preguntaId: 'p12' | 'p13' | 'p18' | 'p19';
  valor?: string;
  onChange: (preguntaId: 'p12' | 'p13' | 'p18' | 'p19', valor: string) => void;
  error?: boolean;
}) {
  const pregunta = PREGUNTAS[preguntaId];
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-neutral-700">{label}</label>
      <div className="relative">
        {Icono && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
            <Icono className="h-5 w-5" />
          </span>
        )}
        <select
          value={valor ?? ''}
          onChange={(e) => onChange(preguntaId, e.target.value)}
          className={`w-full appearance-none rounded-2xl border-2 bg-white py-3.5 pr-11 text-base text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${
            Icono ? 'pl-12' : 'pl-4'
          } ${error ? 'border-red-300' : 'border-neutral-200'} ${!valor ? 'text-neutral-400' : ''}`}
        >
          <option value="" disabled>
            Seleccionar...
          </option>
          {pregunta.opciones?.map((opcion) => (
            <option key={opcion.id} value={opcion.id} className="text-neutral-800">
              {opcion.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
          <ChevronDownIcon className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

export function HabitosGeneralesForm({ valores, onChange, errores }: HabitosGeneralesFormProps) {
  const insight = valores.p18 ? INSIGHT_SUENO[valores.p18] : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <MoonIcon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Hábitos generales</h2>
          <p className="text-sm text-neutral-500">Tu rutina diaria nos ayuda a personalizar tu plan</p>
        </div>
      </div>

      <SelectCampo
        label={PREGUNTAS.p18.texto}
        icono={ClockIcon}
        preguntaId="p18"
        valor={valores.p18}
        onChange={onChange}
        error={errores.includes('p18')}
      />

      {insight && (
        <div
          className={`flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm ${
            insight.tono === 'ok'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-amber-200 bg-amber-50 text-amber-800'
          }`}
        >
          <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-current" />
          <p>{insight.texto}</p>
        </div>
      )}

      <SelectCampo
        label={PREGUNTAS.p19.texto}
        icono={ClockIcon}
        preguntaId="p19"
        valor={valores.p19}
        onChange={onChange}
        error={errores.includes('p19')}
      />

      <SelectCampo
        label={PREGUNTAS.p12.texto}
        icono={DropletIcon}
        preguntaId="p12"
        valor={valores.p12}
        onChange={onChange}
        error={errores.includes('p12')}
      />

      <SelectCampo
        label={PREGUNTAS.p13.texto}
        icono={WineIcon}
        preguntaId="p13"
        valor={valores.p13}
        onChange={onChange}
        error={errores.includes('p13')}
      />
    </div>
  );
}
