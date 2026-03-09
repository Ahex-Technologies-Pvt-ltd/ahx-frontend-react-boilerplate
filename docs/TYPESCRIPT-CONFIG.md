# TypeScript Configuration Guide

## Configuration Files Overview

This project uses TypeScript for all configuration files where it provides benefits:

### ✅ TypeScript Config Files

1. **vite.config.ts**
   - Type: `import { defineConfig } from 'vite'`
   - Benefits: Full IntelliSense for Vite options, type-safe plugin configuration
   - Path aliases configured for `@/` → `src/`

2. **tailwind.config.ts**
   - Type: `import type { Config } from 'tailwindcss'`
   - Benefits: Type-safe theme configuration, autocomplete for Tailwind options
   - Uses `satisfies Config` for type checking

3. **postcss.config.ts**
   - Simple export with plugins object
   - Benefits: Consistent with other TS configs

### ⚠️ JavaScript Config Files (Intentional)

1. **eslint.config.js**
   - Reason: ESLint flat config system works better with .js
   - The new flat config format is optimized for JavaScript
   - TypeScript support is limited and can cause issues

2. **lint-staged.config.js**
   - Reason: Simple configuration with no type benefits
   - No complex logic that would benefit from TypeScript

## Path Aliases

Configured in both `tsconfig.app.json` and `vite.config.ts`:

```typescript
// tsconfig.app.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

// vite.config.ts
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

## Usage Examples

### Importing with Path Aliases

```typescript
// ✅ Good - Using path alias
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ❌ Avoid - Relative paths
import { Button } from '../../components/ui/button';
```

### Using cn() Utility

```typescript
import { cn } from '@/lib/utils';

// Merge Tailwind classes safely
<div className={cn(
  "base-class",
  condition && "conditional-class",
  "override-class"
)} />
```

## Type Safety Benefits

1. **Vite Config**: Autocomplete for plugins, build options, server config
2. **Tailwind Config**: Type-safe theme extensions, color definitions
3. **Import Paths**: TypeScript validates `@/` imports at compile time

## Build Process

The TypeScript compiler (`tsc`) checks all `.ts` and `.tsx` files, including config files:

```bash
npm run build  # Runs: tsc -b && vite build
```

This ensures type errors in config files are caught before build.
