interface ProgressBarProps {
  pasoActual: number;
  totalPasos: number;
}

export function ProgressBar({ pasoActual, totalPasos }: ProgressBarProps) {
  const porcentaje = Math.round((pasoActual / totalPasos) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 text-sm text-neutral-500">
        <span>
          Bloque {pasoActual} de {totalPasos}
        </span>
        <span>{porcentaje}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-600 transition-all duration-300 ease-out"
          style={{ width: `${porcentaje}%` }}
        />
      </div>
    </div>
  );
}
