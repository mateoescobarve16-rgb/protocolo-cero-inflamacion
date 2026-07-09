interface ProgressBarProps {
  pasoActual: number;
  totalPasos: number;
}

export function ProgressBar({ pasoActual, totalPasos }: ProgressBarProps) {
  const porcentaje = Math.round((pasoActual / totalPasos) * 100);

  return (
    <div className="fixed inset-x-0 top-0 z-10 h-1.5 bg-emerald-950/5">
      <div
        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 ease-out"
        style={{ width: `${porcentaje}%` }}
      />
    </div>
  );
}
