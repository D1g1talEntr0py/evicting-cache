# Copilot Instructions for evicting-cache

## Project Overview
This is a lightweight TypeScript library implementing a Least Recently Used (LRU) cache with automatic eviction. The entire implementation is a single class (`EvictingCache`) in `src/evicting-cache.ts` that wraps JavaScript's native `Map` to maintain insertion order for LRU semantics.

## Architecture & Core Concepts

**LRU Implementation Strategy**: The cache leverages Map's iteration order guarantee (items are ordered by insertion). When an item is accessed via `get()`, it's deleted and re-inserted to move it to the end (most recently used). The first item in iteration order is always the least recently used.

**Key vs Peek Distinction**:
- `get(key)` returns the value AND updates LRU order (delete + re-insert)
- `peek(key)` returns the value WITHOUT affecting LRU order (read-only)
- This is critical for cache semantics - see tests like `peek does not affect LRU order` in `tests/evicting-cache.test.ts`

**Generic Type Support**: The cache supports any key/value types (`EvictingCache<K, V>`). Tests extensively validate objects, arrays, Maps, Sets, Dates, Symbols, and bigints as keys to ensure reference-based equality works correctly.

## Development Workflow

**Build System**: Uses a custom `tsbuild` command (not standard tsc):
- `pnpm build` - Compiles TypeScript to `dist/`
- `pnpm build:watch` - Watch mode for development
- `pnpm type-check` - Type checking only (no emit)
- Build configuration in `tsconfig.json` under `tsbuild.entryPoints`

**Testing**: Vitest with **100% coverage requirement**:
- `pnpm test` - Run all tests
- `pnpm test:coverage` - Generate coverage report (outputs to `tests/coverage/`)
- `pnpm test:watch` - Watch mode for TDD
- Coverage config in `vitest.config.ts` - excludes `src/index.ts`, includes all other `src/` files
- All new code must maintain 100% test coverage

**Pre-publish Checks**: The `prepublish` script runs linting, tests, and minified build - all must pass before publishing.

## Code Style & Conventions

**Indentation**: Tabs, not spaces (enforced via ESLint `indent: ['error', 'tab']`)

**Semicolons**: Required always, except:
- Last statement in one-line blocks: `if (x) { return }`
- Last statement in one-line class bodies

**String Quotes**: Single quotes enforced (`quotes: ['error', 'single']`)

**TypeScript Strictness**: Maximum strictness enabled:
- `strict: true` with additional flags: `noUncheckedIndexedAccess`, `noImplicitReturns`, `isolatedDeclarations`
- Use `null` for missing cache values, not `undefined` (see `get()` return type)

**JSDoc Requirements**: All public methods require JSDoc with `@param`, `@returns`, and description. See existing methods in `src/evicting-cache.ts` as templates.

**Error Handling Pattern**: Constructor validates capacity with specific `RangeError` messages:
- "capacity must be greater than 0" for values < 1
- "capacity must be an integer" for non-integers
- See constructor tests for all edge cases (Infinity, 0, negative, floats)

## Module System

**ESM Only**: `"type": "module"` in package.json - no CommonJS support
- Import paths must include `.js` extension in TypeScript files (TypeScript quirk)
- Use `import.meta.url` for file paths (see `vitest.config.ts`)

**Exports**: Single entry point via package.json `exports` field pointing to `src/evicting-cache.js` (compiled from `.ts`)

## Testing Patterns

**Test Organization**: Single describe block per class, grouped by functionality (constructors, operations, iterators)

**Type Variation Tests**: Each operation tested with diverse key/value types to ensure Map's reference equality semantics work (see object/array/Map/Set/Date/Symbol key tests)

**LRU Behavior Verification**: Tests explicitly document expected eviction order in comments - maintain this pattern when adding tests

**Iterator Tests**: Verify LRU order through iterator results - order changes are observable via `keys()`, `values()`, `entries()`

## Common Tasks

**Adding New Methods**:
1. Add to `EvictingCache` class with JSDoc
2. Export via public API or keep private
3. Add test suite in `tests/evicting-cache.test.ts` with type variations
4. Run `pnpm test:coverage` to ensure coverage targets are met

**Modifying LRU Logic**: Always verify with both `get affects LRU order` and `peek does not affect LRU order` test patterns

**Browser Compatibility**: Configured via `browserslist` in package.json - check compatibility with `eslint-plugin-compat` (runs automatically on `pnpm lint`)
