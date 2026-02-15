# Monospace

A monorepo for developing FiveM NUI interfaces. Built with Bun, Turborepo, Preact, Vite, and Tailwind CSS -- providing shared configurations, UI utilities, and a consistent development workflow across multiple NUI projects.

## Tech Stack

- **Runtime / Package Manager** -- [Bun](https://bun.sh)
- **Monorepo Orchestration** -- [Turborepo](https://turbo.build)
- **UI Framework** -- [Preact](https://preactjs.com)
- **Bundler** -- [Vite](https://vite.dev)
- **Styling** -- [Tailwind CSS v3](https://tailwindcss.com)
- **Linting / Formatting** -- [Biome](https://biomejs.dev)
- **Schema Validation** -- [Zod](https://zod.dev)
- **Language** -- TypeScript

## Project Structure

```
monospace/
  apps/
    example/          # Reference NUI app demonstrating the shared packages
  packages/
    biome-config/     # Shared Biome linter and formatter configuration
    tailwind-config/  # Shared Tailwind CSS, PostCSS config, and base styles
    typescript-config/ # Shared TypeScript compiler configurations
    ui/               # Shared UI components and utilities
    vite-config/      # Shared Vite build configuration (Preact preset, base path)
```

## Shared Packages

All packages are published under the `@repo/*` scope and consumed via workspace linking.

| Package | Description |
|---|---|
| `@repo/biome-config` | Centralized Biome rules (recommended ruleset, tab indentation, 120-char line width) |
| `@repo/tailwind-config` | Shared Tailwind config, PostCSS config, and a base stylesheet |
| `@repo/typescript-config` | Reusable `tsconfig` base files |
| `@repo/ui` | Preact components (e.g. `Button`) and utilities (`cn`, `fetch`, `useEvent`, `useValidatedEvent`) |
| `@repo/vite-config` | Pre-configured Vite setup with the Preact preset and relative base path for NUI embedding |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.3.4 or later
- Node.js >= 18

### Install dependencies

```bash
bun install
```

### Development

Start all apps in development mode:

```bash
bun run dev
```

### Build

Build all apps for production:

```bash
bun run build
```

### Linting and Formatting

```bash
# Biome check (lint + format)
bun run format-and-lint

# Biome check with auto-fix
bun run format-and-lint:fix

# Prettier (markdown and TypeScript files)
bun run format
```

### Type Checking

```bash
bun run check-types
```

## Creating a New NUI App

1. Create a new directory under `apps/`.
2. Add a `package.json` referencing the shared packages:
   ```json
   {
     "devDependencies": {
       "@repo/vite-config": "workspace:*",
       "@repo/biome-config": "workspace:*",
       "@repo/tailwind-config": "workspace:*",
       "@repo/typescript-config": "workspace:*"
     },
     "dependencies": {
       "@repo/ui": "workspace:*"
     }
   }
   ```
3. Import the shared Vite config in your `vite.config.ts`:
   ```ts
   import { preactConfig } from "@repo/vite-config";
   import { defineConfig, type UserConfig } from "vite";

   export default defineConfig({
     ...(preactConfig as UserConfig),
   });
   ```
4. Reference the shared Tailwind config in your `tailwind.config.js`:
   ```js
   export { default } from "@repo/tailwind-config/tailwind";
   ```
5. Run `bun install` and start development with `bun run dev`.

## Using the UI Package

Import components and utilities directly from `@repo/ui`:

```tsx
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/utils/cn";
import { useValidatedEvent } from "@repo/ui/utils/useValidatedEvent";
```

## License

This project is licensed under the [GNU General Public License v3.0](./LICENSE). See the `LICENSE` file for details.
