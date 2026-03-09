# Tailwind CSS & shadcn/ui Setup

This project is now configured with Tailwind CSS and shadcn/ui using TypeScript.

## What's Been Configured

### Tailwind CSS
- Installed `tailwindcss@^3.4.0`, `postcss`, `autoprefixer`, and `tailwindcss-animate`
- Created `tailwind.config.ts` (TypeScript) with:
  - shadcn/ui compatible settings
  - Full color system with CSS variables
  - Custom border radius utilities
  - Dark mode support using class strategy
- Created `postcss.config.ts` (TypeScript)
- Updated `src/index.css` with:
  - Tailwind directives (@tailwind base, components, utilities)
  - CSS variables for theming (light and dark modes)
  - Base styles with proper font rendering

### shadcn/ui
- Installed required dependencies:
  - `class-variance-authority` - For component variants
  - `clsx` - For conditional classes
  - `tailwind-merge` - For merging Tailwind classes
  - `lucide-react` - Icon library
- Created `src/lib/utils.ts` with the `cn()` utility function
- Created `components.json` configuration file
- Set up path aliases in `tsconfig.app.json` and `vite.config.ts` (@/ → src/)

### TypeScript Configuration
All configuration files use TypeScript where applicable:
- ✅ `vite.config.ts` - Vite configuration with path aliases
- ✅ `tailwind.config.ts` - Tailwind CSS configuration with proper typing
- ✅ `postcss.config.ts` - PostCSS configuration
- ⚠️ `eslint.config.js` - ESLint flat config (works better with .js)
- ⚠️ `lint-staged.config.js` - Lint-staged config (simple, no type benefits)

### .gitignore
Updated with comprehensive ignore patterns for:
- Dependencies (node_modules, .pnp)
- Build outputs (dist, build)
- Environment variables (.env*)
- Testing coverage
- OS and editor files (.DS_Store, .vscode, .idea)
- Temporary files (*.tmp, .cache)
- TypeScript build info (*.tsbuildinfo)

## Project Structure

```
├── src/
│   ├── lib/
│   │   └── utils.ts          # cn() utility for class merging
│   ├── components/
│   │   └── ui/               # shadcn/ui components go here
│   ├── index.css             # Tailwind directives + CSS variables
│   └── ...
├── tailwind.config.ts        # Tailwind configuration
├── postcss.config.ts         # PostCSS configuration
├── vite.config.ts            # Vite configuration with aliases
├── tsconfig.app.json         # TypeScript config with path aliases
└── components.json           # shadcn/ui configuration
```

## Adding shadcn/ui Components

To add components from shadcn/ui, use the CLI:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
# etc.
```

Or add multiple components at once:
```bash
npx shadcn-ui@latest add button card input dialog
```

## Usage Example

```tsx
import { Button } from "@/components/ui/button"

function App() {
  return (
    <Button variant="default">Click me</Button>
  )
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Dark Mode

The project is configured with dark mode support using the `class` strategy. Toggle dark mode by adding/removing the `dark` class on the root element.
