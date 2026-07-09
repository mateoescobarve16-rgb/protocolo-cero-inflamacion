import type { Paso } from '@/lib/quiz/pasos';
import { obtenerBloqueDePregunta } from '@/lib/quiz/preguntas';
import { UserIcon, MoonIcon } from './Icons';
import { ICONO_POR_BLOQUE } from './bloqueIconos';

export function iconoDePaso(paso: Paso, className?: string) {
  if (paso.tipo === 'datos-personales') return <UserIcon className={className} />;
  if (paso.tipo === 'habitos-generales') return <MoonIcon className={className} />;
  const Icono = ICONO_POR_BLOQUE[obtenerBloqueDePregunta(paso.preguntaId).id];
  return <Icono className={className} />;
}
