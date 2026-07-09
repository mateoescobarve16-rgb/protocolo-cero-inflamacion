interface ProgressBarProps {
  pasoActual: number;
  totalPasos: number;
}

export function ProgressBar({ pasoActual, totalPasos }: ProgressBarProps) {
  const porcentaje = Math.round((pasoActual / totalPasos) * 100);

  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-emerald-900/10">
        <div
          className="h-full rounded-full bg-emerald-600 transition-all duration-500 ease-out"
          style={{ width: `${porcentaje}%` }}
        />
      </div>
      <span className="shrink-0 text-xs font-medium text-neutral-500">
        {pasoActual}/{totalPasos}
      </span>
    </div>
  );
}
