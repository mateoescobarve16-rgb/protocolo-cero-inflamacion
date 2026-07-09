import type { Pregunta } from '@/lib/quiz/preguntas';

type ValorRespuesta = string | string[];

interface PreguntaFieldProps {
  pregunta: Pregunta;
  valor: ValorRespuesta | undefined;
  onChange: (valor: ValorRespuesta) => void;
  error?: boolean;
}

export function PreguntaField({ pregunta, valor, onChange, error }: PreguntaFieldProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-base font-medium text-neutral-800">{pregunta.texto}</label>

      {pregunta.tipo === 'texto' && (
        <input
          type={pregunta.id === 'email' ? 'email' : 'text'}
          value={(valor as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={pregunta.placeholder}
          className={`rounded-lg border px-4 py-3 text-neutral-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 ${
            error ? 'border-red-400' : 'border-neutral-300'
          }`}
        />
      )}

      {pregunta.tipo === 'single' && (
        <div className="flex flex-col gap-2">
          {pregunta.opciones?.map((opcion) => {
            const seleccionada = valor === opcion.id;
            return (
              <button
                key={opcion.id}
                type="button"
                aria-pressed={seleccionada}
                onClick={() => onChange(opcion.id)}
                className={`rounded-lg border px-4 py-3 text-left transition ${
                  seleccionada
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                    : 'border-neutral-300 text-neutral-700 hover:border-emerald-400'
                }`}
              >
                {opcion.label}
              </button>
            );
          })}
        </div>
      )}

      {pregunta.tipo === 'multi' && (
        <div className="flex flex-col gap-2">
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
                className={`rounded-lg border px-4 py-3 text-left transition ${
                  seleccionada
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                    : 'border-neutral-300 text-neutral-700 hover:border-emerald-400'
                }`}
              >
                {opcion.label}
              </button>
            );
          })}
        </div>
      )}

      {error && <p className="text-sm text-red-500">Esta pregunta es requerida.</p>}
    </div>
  );
}
