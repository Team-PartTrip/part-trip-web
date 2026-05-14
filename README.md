# parttrip-web

React, TypeScript, and Vite application structured with Feature-Sliced Design.

## Scripts

```sh
npm run dev
npm run build
npm run lint
```

## Architecture

Source code lives under `src` and follows these layers:

```text
src/
  app/        Application composition, providers, global styles
  pages/      Route-level pages
  widgets/    Page blocks assembled from features and entities
  features/   User-facing business actions
  entities/   Domain models and entity UI
  shared/     Reusable UI, config, api, and utilities
```

Layer dependencies must point downward only:

```text
app -> pages -> widgets -> features -> entities -> shared
```

For example, `features` may import from `entities` and `shared`, but must not import from
`widgets`, `pages`, or `app`.

## Public API

Each slice exposes its public surface through an `index.ts` file. Import slices through
their public API:

```ts
import { HomePage } from '@pages/home'
```

Avoid deep imports into slice internals:

```ts
// Do not use this outside the slice.
import { HomePage } from '@pages/home/ui/HomePage'
```

ESLint is configured to catch upward layer imports and deep slice imports through aliases.

## Aliases

The following aliases are configured in TypeScript and Vite:

```text
@app
@pages
@widgets
@features
@entities
@shared
```
