/**
 * GuildIcon — icône de serveur dans la sidebar.
 * Inspiré de [[skill-tailwind-components]] et de [[skill-ui-discord]].
 */
import { cn } from '@/lib/utils';

interface GuildIconProps {
  name: string;
  icon: string | null;
  isActive?: boolean;
  unreadCount?: number;
  onClick?: () => void;
}

export function GuildIcon({
  name,
  icon,
  isActive,
  unreadCount = 0,
  onClick,
}: GuildIconProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative mx-auto mt-2 flex h-14 w-14 items-center justify-center rounded-2xl my-1',
        'transition-all hover:rounded-xl hover:bg-interactive-hover',
        isActive && 'rounded-xl bg-primary-500 text-white'
      )}
      aria-label={name}
      title={name}
    >
      {icon ? (
        <img src={icon} alt={name} className="h-10 w-10 rounded-lg" />
      ) : (
        <span className="text-xl font-bold text-text-primary">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
      {unreadCount > 0 && (
        <span className="absolute bottom-1 right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-status-dnd px-1 text-xs font-bold text-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
}
