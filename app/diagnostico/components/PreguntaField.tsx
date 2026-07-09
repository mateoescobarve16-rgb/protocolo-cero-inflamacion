import type { Pregunta } from '@/lib/quiz/preguntas';

type ValorRespuesta = string | string[];

interface PreguntaFieldProps {
  pregunta: Pregunta;
  valor: ValorRespuesta | undefined;
  onChange: (valor: ValorRespuesta) => void;
  onEnter?: () => void;
  error?: boolean;
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0">
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 010 1.415l-7.404 7.404a1 1 0 01-1.415 0L3.296 9.52a1 1 0 111.415-1.414l3.475 3.474 6.696-6.696a1 1 0 011.415 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function PreguntaField({ pregunta, valor, onChange, onEnter, error }: PreguntaFieldProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-balance text-xl font-semibold leading-snug text-neutral-900 sm:text-2xl">
        {pregunta.texto}
      </h2>

      {pregunta.tipo === 'texto' && (
        <input
          type={pregunta.id === 'email' ? 'email' : 'text'}
          value={(valor as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onEnter?.();
          }}
          placeholder={pregunta.placeholder}
          autoFocus
          className={`rounded-2xl border-2 bg-white px-5 py-4 text-lg text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${
            error ? 'border-red-300' : 'border-neutral-200'
          }`}
        />
      )}

      {pregunta.tipo === 'single' && (
        <div className="flex flex-col gap-2.5">
          {pregunta.opciones?.map((opcion) => {
            const seleccionada = valor === opcion.id;
            return (
              <button
                key={opcion.id}
                type="button"
                aria-pressed={seleccionada}
                onClick={() => onChange(opcion.id)}
                className={`flex items-center justify-between gap-3 rounded-2xl border-2 px-5 py-3.5 text-left text-[15px] leading-snug transition-all active:scale-[0.98] sm:text-base ${
                  seleccionada
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm shadow-emerald-100'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-emerald-300 hover:bg-emerald-50/40'
                }`}
              >
                <span>{opcion.label}</span>
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors ${
                    seleccionada ? 'bg-emerald-500 text-white' : 'bg-transparent text-transparent'
                  }`}
                >
                  <CheckIcon />
                </span>
              </button>
            );
          })}
        </div>
      )}

      {pregunta.tipo === 'multi' && (
        <div className="flex flex-col gap-2.5">
          {pregunta.opciones?.map((opcion) => {
            const seleccionadas = (valor as string[]) ?? [];
            const seleccionada = seleccionadas.includes(opcion.id);

            const alternar = () => {
              if (opcion.exclusiva) {
                onChange(seleccionada ? [] : [opcion.id]);
                return;
              }
              const sinExclusivas = seleccionadas.filter((id) => {
                const otraOpcion = pregunta.opciones?.find((o) => o.id === id);
                return !otraOpcion?.exclusiva;
              });
              onChange(
                seleccionada
                  ? sinExclusivas.filter((id) => id !== opcion.id)
                  : [...sinExclusivas, opcion.id]
              );
            };

            return (
              <button
                key={opcion.id}
                type="button"
                aria-pressed={seleccionada}
                onClick={alternar}
                className={`flex items-center justify-between gap-3 rounded-2xl border-2 px-5 py-3.5 text-left text-[15px] leading-snug transition-all active:scale-[0.98] sm:text-base ${
                  seleccionada
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm shadow-emerald-100'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-emerald-300 hover:bg-emerald-50/40'
                }`}
              >
                <span>{opcion.label}</span>
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-colors ${
                    seleccionada ? 'bg-emerald-500 text-white' : 'bg-transparent text-transparent'
                  }`}
                >
                  <CheckIcon />
                </span>
              </button>
            );
          })}
        </div>
      )}

      {error && <p className="text-sm font-medium text-red-500">Esta pregunta es requerida.</p>}
    </div>
  );
}
