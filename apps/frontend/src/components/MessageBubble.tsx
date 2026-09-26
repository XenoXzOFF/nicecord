/**
 * MessageBubble — affichage d'un message dans le chat.
 * Inspiré de [[skill-ui-discord]] et de [[skill-tailwind-components]].
 */
import type { Message, User } from '@nicecord/types';
import { formatTime } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  author: User;
}

export function MessageBubble({ message, author }: MessageBubbleProps) {
  return (
    <div className="group flex w-full gap-3 px-4 py-1.5 hover:bg-interactive-hover/50">
      <img
        src={author.avatar ?? '/avatar-default.svg'}
        alt={author.username}
        className="h-10 w-10 rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-sm text-white">{author.username}</span>
          <span className="text-xs text-text-tertiary">
            {formatTime(message.createdAt)}
          </span>
        </div>
        <p className="text-sm text-text-secondary whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </div>
    </div>
  );
}
