import { useEffect, useRef } from 'react';

interface KeyboardShortcuts {
  onNewTask: () => void;
  onToggleTheme: () => void;
  onFocusSearch: () => void;
  onEscape: () => void;
  onDeleteCompleted: () => void;
}

export function useKeyboardShortcuts({
  onNewTask,
  onToggleTheme,
  onFocusSearch,
  onEscape,
  onDeleteCompleted,
}: KeyboardShortcuts) {
  const inputFocusedRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      inputFocusedRef.current = isInput;

      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'n':
            e.preventDefault();
            onNewTask();
            break;
          case 'd':
            e.preventDefault();
            onToggleTheme();
            break;
          case 'k':
            e.preventDefault();
            onFocusSearch();
            break;
          case 'delete':
            e.preventDefault();
            onDeleteCompleted();
            break;
        }
      }

      if (e.key === 'Escape' && !isInput) {
        onEscape();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNewTask, onToggleTheme, onFocusSearch, onEscape, onDeleteCompleted]);

  return { inputFocused: inputFocusedRef.current };
}

export function useShortcutHelp() {
  const shortcuts = [
    { keys: ['⌘', 'N'], description: 'New task' },
    { keys: ['⌘', 'D'], description: 'Toggle dark mode' },
    { keys: ['⌘', 'K'], description: 'Focus search' },
    { keys: ['⌘', 'Delete'], description: 'Clear completed' },
    { keys: ['Esc'], description: 'Close modal / Deselect' },
  ];
  return shortcuts;
}