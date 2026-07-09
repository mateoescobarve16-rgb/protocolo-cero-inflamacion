import { UserIcon, EnvelopeIcon } from './Icons';

interface DatosPersonalesFormProps {
  nombre: string;
  email: string;
  onChangeNombre: (valor: string) => void;
  onChangeEmail: (valor: string) => void;
  onEnter?: () => void;
  errorNombre?: boolean;
  errorEmail?: boolean;
}

export function DatosPersonalesForm({
  nombre,
  email,
  onChangeNombre,
  onChangeEmail,
  onEnter,
  errorNombre,
  errorEmail,
}: DatosPersonalesFormProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <UserIcon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Datos personales</h2>
          <p className="text-sm text-neutral-500">Cuéntanos un poco sobre ti para personalizar tu experiencia</p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="nombre" className="text-sm font-medium text-neutral-700">
          Nombre completo
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
            <UserIcon className="h-5 w-5" />
          </span>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => onChangeNombre(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onEnter?.();
            }}
            placeholder="Tu nombre y apellido"
            autoFocus
            className={`w-full rounded-2xl border-2 bg-white py-3.5 pl-12 pr-5 text-base text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${
              errorNombre ? 'border-red-300' : 'border-neutral-200'
            }`}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-neutral-700">
          Correo electrónico
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
            <EnvelopeIcon className="h-5 w-5" />
          </span>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onChangeEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onEnter?.();
            }}
            placeholder="tu@email.com"
            className={`w-full rounded-2xl border-2 bg-white py-3.5 pl-12 pr-5 text-base text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${
              errorEmail ? 'border-red-300' : 'border-neutral-200'
            }`}
          />
        </div>
        <p className="text-xs text-neutral-400">
          Usaremos este correo para que puedas volver a ver tu plan más adelante.
        </p>
      </div>
    </div>
  );
}
