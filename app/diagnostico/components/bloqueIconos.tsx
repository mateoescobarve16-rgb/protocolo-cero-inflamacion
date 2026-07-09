import {
  UserIcon,
  ClockIcon,
  ActivityIcon,
  LeafIcon,
  SunIcon,
  MoonIcon,
  HeartIcon,
  AlertTriangleIcon,
} from './Icons';

export const ICONO_POR_BLOQUE: Record<string, (props: { className?: string }) => React.ReactElement> = {
  'bloque-1': UserIcon,
  'bloque-2': ClockIcon,
  'bloque-3': ActivityIcon,
  'bloque-4': LeafIcon,
  'bloque-5': SunIcon,
  'bloque-6': MoonIcon,
  'bloque-7': HeartIcon,
  'bloque-8': AlertTriangleIcon,
};
