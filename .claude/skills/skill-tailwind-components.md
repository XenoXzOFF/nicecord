# Skill : Tailwind Components pour Nicecord

> Guide de création rapide de composants interactifs en s'appuyant sur Tailwind CSS et le design Discord.

## Configuration Tailwind (tailwind.config.js)

```js
module.exports = {
  content: ['./src/frontend/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { 500: '#5865F2', 600: '#4755EB' },
        bg: {
          default: '#313338',
          secondary: '#2B2D31',
          tertiary: '#25262A',
          accent: '#1E1F22',
        },
        interactive: {
          hover: '#383A40',
          active: '#2A2B2F',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B5BAC1',
          tertiary: '#8E9297',
        },
        status: {
          online: '#57F089',
          idle: '#FFAF58',
          dnd: '#F0595E',
          offline: '#6A6D74',
        },
      },
      fontFamily: {
        sans: ['Whitney', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"Cascadia Code"', 'monospace'],
      },
      spacing: {
        sidebar: '240px',
        'user-panel': '316px',
      },
    },
  },
  plugins: [],
};
```

## Composants interactifs

### 1. GuildIcon (icône de serveur)

```tsx
// components/GuildIcon.tsx
import { cn } from '@/lib/utils';

interface GuildIconProps {
  guildId: string;
  name: string;
  Icon?: React.ElementType;
  isActive?: boolean;
  unreadCount?: number;
  onClick?: () => void;
}

export function GuildIcon({
  name,
  Icon,
  isActive,
  unreadCount,
  onClick,
}: GuildIconProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative mx-auto mt-2 flex h-14 w-14 items-center justify-center rounded-2xl my-1 transition-all hover:rounded-xl hover:bg-accent',
        isActive && 'rounded-xl bg-primary-500 text-white',
      )}
    >
      {Icon && <Icon size={24} />}
      {unreadCount && unreadCount > 0 && (
        <span className="absolute bottom-1 right-1 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {unreadCount > 249 ? '249+' : unreadCount}
        </span>
      )}
    </button>
  );
}
```

### 2. ServerListItem (serveur dans la sidebar)

```tsx
export function ServerList() {
  const [collapsed, setCollapsed] = useState(false);
  // collapsed = icônes seulement
  const width = collapsed ? 'w-[72px]' : 'w-[240px]';
  return (
    <aside className={cn('flex flex-col bg-tertiary transition-all', width)}>
      {/* ... */}
      <button onClick={() => setCollapsed(!collapsed)} className="hover:bg-interactive-hover ...">
        {collapsed ? '›' : '‹'}
      </button>
    </aside>
  );
}
```

### 3. ChannelList (liste des salons)

```tsx
export function ChannelListItem({ channel, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-2 py-1.5 text-sm rounded-md mx-2 my-0.5 transition-colors',
        'hover:bg-interactive-hover hover:text-primary-500',
        isActive && 'bg-background-tertiary text-white font-medium',
      )}
    >
      <HashIcon size={16} />
      <span>{channel.name}</span>
      {channel.unreadCount > 0 && (
        <span className="ml-auto bg-primary-500 text-xs rounded-full px-1.5 py-0.5">
          {channel.unreadCount}
        </span>
      )}
    </button>
  );
}
```

### 4. ChatInput (barre d'écriture)

```tsx
export function ChatInput({ onSend }: { onSend: (msg: string) => void }) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
    inputRef.current?.focus();
  };

  return (
    <div className="flex items-end gap-2 p-4 bg-bg-secondary">
      <div className="flex-1 rounded-[18px] bg-bg-tertiary focus-within:ring-2 focus-within:ring-primary-500">
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSubmit())}
          placeholder="Message #général"
          className="w-full bg-transparent border-0 outline-none py-2.5 px-4 text-sm text-text-primary resize-none min-h-[20px] max-h-96"
          rows={1}
        />
      </div>
      <button
        disabled={!text.trim()}
        onClick={handleSubmit}
        className="mb-1 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-medium rounded-full w-10 h-10 flex items-center justify-center transition-colors"
      >
        <PaperPlaneIcon size={18} />
      </button>
    </div>
  );
}
```

### 5. MessageBubble (bulle de message)

```tsx
export function MessageBubble({ message }: { message: Message }) {
  return (
    <div className="group flex gap-3 px-4 py-1">
      <img
        src={message.author.avatar}
        alt={message.author.name}
        className="h-10 w-10 rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-sm text-text-primary">{message.author.name}</span>
          <span className="text-xs text-text-tertiary">
            {format(new Date(message.createdAt), 'HH:mm')}
          </span>
        </div>
        <p className="text-sm text-text-secondary">{message.content}</p>
      </div>
    </div>
  );
}
```

### 6. Modal (boîte de dialogue)

```tsx
export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-lg bg-bg-secondary p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold text-text-primary">{title}</h2>
        {children}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-text-tertiary hover:text-text-primary"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
```

## Utilitaire `cn` (className merge)

```ts
// src/frontend/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Règles d'or
1. **Jamais de CSS inline ou de style personnalisé** si Tailwind suffit — excepté pour la palette exacte (`#RRGGBB`).
2. **Tous les composants utilisent le dark mode** (`dark:` variant n'est pas nécessaire car sombre par défaut).
3. **Taille des icônes** : 16px (toolbar), 24px (sidebar), 40px (avatar), 18px (input buttons).
4. **Bordures** : pas de border visible entre les colonnes (design plat Discord).
5. **Hover** : toujours `transition-colors duration-150` pour les effets de survol.

---

*Ce skill s'appuie sur [[skill-ui-discord]] pour la charte graphique exacte.*
