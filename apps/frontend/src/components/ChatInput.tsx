/**
 * ChatInput — barre d'écriture des messages.
 * Inspiré de [[skill-ui-discord]] et de [[skill-tailwind-components]].
 */
'use client';

import { useState, useRef } from 'react';

interface ChatInputProps {
  onSend: (content: string) => void;
  placeholder?: string;
}

export function ChatInput({ onSend, placeholder = 'Message #general' }: ChatInputProps) {
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
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={placeholder}
          className="w-full bg-transparent border-0 outline-none py-2.5 px-4 text-sm text-text-primary resize-none min-h-[20px] max-h-96"
          rows={1}
          maxLength={2000}
        />
      </div>
      <button
        disabled={!text.trim()}
        onClick={handleSubmit}
        className="mb-1 rounded-full bg-primary-500 p-2 text-white hover:bg-primary-600 disabled:opacity-50 transition-colors"
        aria-label="Envoyer le message"
      >
        ▶
      </button>
    </div>
  );
}
