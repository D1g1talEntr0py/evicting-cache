# Copilot Instructions for evicting-cache

## Overview
- This repo is a small TypeScript LRU cache library.
- The main implementation is the `EvictingCache` class in `src/evicting-cache.ts`.
- The cache relies on `Map` insertion order for LRU behavior.

## Behavior Rules
- `get(key)` returns the cached value and refreshes recency by deleting and re-inserting the key.
- `peek(key)` returns the cached value without changing recency.
- The first key in iteration order is always the least recently used.
- Missing values should be represented as `null`, not `undefined`.
- Generic key and value support matters. Preserve reference-equality behavior for objects, arrays, Maps, Sets, Dates, Symbols, and bigints.

## Implementation Constraints
- Constructor validation must keep these exact `RangeError` messages:
	- `capacity must be greater than 0`
	- `capacity must be an integer`
- Public methods require JSDoc with description, `@param`, and `@returns`.
- ESM only: TypeScript imports should use `.js` extensions where required.
- Keep changes small and consistent with the single-class design unless the task explicitly requires larger refactoring.

## Style
- Use tabs for indentation.
- Use single quotes.
- Keep semicolons, matching existing style.
- The project uses strict TypeScript settings, including `noUncheckedIndexedAccess` and `noImplicitReturns`.

## Validation
- `pnpm build` compiles with `tsc` and minifies with Terser to build `dist/`.
- `pnpm type-check` runs type checking without emit.
- `pnpm test` runs Vitest.
- `pnpm test:coverage` must stay at 100% coverage for `src/` except `src/index.ts`.
- The release workflow runs linting, type-checking, coverage, and the build; do not break it.

## Test Expectations
- Tests live in `tests/evicting-cache.test.ts` and are grouped by behavior.
- When changing LRU logic, verify both `get affects LRU order` and `peek does not affect LRU order` behavior.
- When adding methods or changing public behavior, add focused tests and keep coverage at 100%.
- Iterator order is observable through `keys()`, `values()`, and `entries()`; treat it as part of the contract.
