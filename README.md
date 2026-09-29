# TodoList Pro

A beautiful, fully-featured todo list application built with React, TypeScript, Tailwind CSS, and Framer Motion.

## Features

### Core Functionality
- ✅ **Full CRUD** - Create, read, update, delete tasks
- ✅ **Drag & Drop Reordering** - Smooth drag-and-drop with @dnd-kit
- ✅ **Categories/Tags** - Customizable categories with colors and icons
- ✅ **Due Dates** - Set deadlines with smart date formatting (Today, Tomorrow, Overdue)
- ✅ **Priority Levels** - Low, Medium, High with visual indicators
- ✅ **Descriptions** - Rich task descriptions
- ✅ **Search** - Real-time search across titles and descriptions

### UI/UX Excellence
- ✅ **Dark Mode** - System-aware with manual toggle, persisted
- ✅ **Framer Motion Animations** - Staggered entrances, layout animations, micro-interactions
- ✅ **Keyboard Shortcuts** - Power user workflows
- ✅ **Responsive Design** - Mobile-first, works on all screen sizes
- ✅ **Accessible** - ARIA labels, semantic HTML, focus management
- ✅ **Overdue Alerts** - Banner appears when tasks are past due

### Data Persistence
- ✅ **LocalStorage** - All data survives browser refresh
- ✅ **Optimistic Updates** - Instant UI feedback

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `⌘ N` | New task |
| `⌘ D` | Toggle dark mode |
| `⌘ K` | Focus search |
| `⌘ Delete` | Clear completed |
| `Esc` | Close modal / Deselect |

## Tech Stack

- **React 18** + **TypeScript** - Type-safe component architecture
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling with custom design system
- **Framer Motion** - Production-ready animations
- **@dnd-kit** - Accessible drag-and-drop
- **date-fns** - Date manipulation
- **Lucide React** - Beautiful icons
- **uuid** - Unique ID generation

## Getting Started

### Prerequisites
- Node.js 18+
- npm, pnpm, or yarn

### Installation

```bash
# Navigate to project directory
cd todo-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Task.tsx          # Individual task with animations
│   ├── TaskList.tsx      # Drag-and-drop sortable list
│   ├── TaskForm.tsx      # Modal form for create/edit
│   ├── CategoryFilter.tsx # Sidebar category filter
│   ├── Header.tsx        # Top bar with search & actions
│   └── Stats.tsx         # Statistics cards
├── hooks/
│   ├── TasksContext.tsx  # Shared task/category state + localStorage
│   └── useKeyboardShortcuts.ts # Global keyboard handlers
├── types/
│   └── index.ts          # TypeScript interfaces
├── utils/
│   └── helpers.ts        # Date formatting, priority styles, etc.
├── styles/
│   └── globals.css       # Tailwind + custom utilities
├── App.tsx               # Main app component
└── main.tsx              # Entry point
```

## Customization

### Adding Categories
Categories can be added via the sidebar "+" button. Each category has:
- Name
- Color (from predefined palette)
- Icon (from Lucide icons)

### Modifying Colors
Edit `tailwind.config.js` to customize the color palette:

```js
colors: {
  primary: { ... },    // Main brand color
  accent: { ... },     // Secondary brand color
}
```

### Adding Animations
Framer Motion variants are defined inline. For reusable animations, create a `variants.ts` file:

```ts
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};
```

## Performance

- **Single state tree** - `TasksContext` avoids duplicate state from per-component hooks
- **Optimized re-renders** - `useCallback`/`useMemo` on handlers and derived values
- **Locality-based filtering** - filters and search run over the in-memory array

## Accessibility

- Semantic HTML5 elements
- ARIA labels, roles, and `aria-pressed` on interactive controls
- Keyboard navigation and visible focus rings
- Dismissable menus via outside-click

## License

MIT License - feel free to use for personal or commercial projects.

## Credits

- Icons by [Lucide](https://lucide.dev)
- Animations by [Framer Motion](https://framer.com/motion)
- Drag & drop by [@dnd-kit](https://dndkit.com)
- Date handling by [date-fns](https://date-fns.org)