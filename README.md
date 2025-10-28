# Evicting Cache

[![npm version](https://img.shields.io/npm/v/evicting-cache.svg)](https://www.npmjs.com/package/evicting-cache)
[![npm downloads](https://img.shields.io/npm/dm/evicting-cache.svg)](https://www.npmjs.com/package/evicting-cache)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/D1g1talEntr0py/evicting-cache)

A lightweight, high-performance TypeScript implementation of an LRU (Least Recently Used) cache with automatic eviction.

The cache is backed by JavaScript's native `Map`, leveraging its insertion order guarantee for efficient LRU semantics. When the cache reaches capacity, the least recently used item is automatically evicted.

## Installation

```bash
// pnpm 🎉
pnpm add evicting-cache

// npm 🤷🏽‍♂️
npm install evicting-cache
```

## Features

- 🚀 **High Performance** - O(1) operations for get, put, delete, and evict
- 📦 **Lightweight** - Zero dependencies, small bundle size
- 🔄 **LRU Eviction** - Automatic removal of least recently used items
- 📊 **Statistics Tracking** - Built-in hit/miss ratio monitoring
- 🔢 **Batch Operations** - Efficient multi-key operations
- 🎯 **Type Safe** - Full TypeScript support with generics
- ✅ **100% Test Coverage** - Thoroughly tested and reliable
- 🌐 **Modern ES Modules** - Native ESM support
- 🔍 **Map-like API** - Familiar interface with additional features

## Usage

### Basic Example

```typescript
import { EvictingCache } from 'evicting-cache';

// Create a cache with capacity of 3 items (default is 100)
const cache = new EvictingCache<string, string>(3);

cache.put('key1', 'value1');
cache.put('key2', 'value2');
cache.put('key3', 'value3');
cache.put('key4', 'value4'); // 'key1' is evicted (LRU)

console.log(cache.get('key1')); // null (evicted)
console.log(cache.get('key2')); // 'value2'
console.log(cache.get('key3')); // 'value3'
console.log(cache.get('key4')); // 'value4'

cache.put('key5', 'value5'); // 'key2' is evicted

console.log(cache.get('key2')); // null (evicted)
console.log(cache.size); // 3
```

### LRU Behavior

```typescript
const cache = new EvictingCache<string, number>(3);

cache.put('a', 1);
cache.put('b', 2);
cache.put('c', 3);
// Order: a, b, c (a is LRU)

cache.get('a'); // Access 'a', moves it to most recent
// Order: b, c, a (b is now LRU)

cache.put('d', 4); // Evicts 'b' (LRU)
// Order: c, a, d

console.log(cache.has('b')); // false (evicted)
```

### Peek Without Affecting LRU

```typescript
const cache = new EvictingCache<string, string>(2);

cache.put('x', 'hello');
cache.put('y', 'world');

// peek() reads without updating LRU order
console.log(cache.peek('x')); // 'hello'
// 'x' remains LRU

cache.put('z', 'new'); // 'x' is evicted
console.log(cache.has('x')); // false
```

### Get or Compute

```typescript
const cache = new EvictingCache<string, number>(10);

// Get existing value or compute and cache it
const value = cache.getOrPut('userId:123', () => {
  // Expensive computation only happens if key is missing
  return fetchUserFromDatabase('123');
});

// If producer throws, cache remains unchanged
try {
  cache.getOrPut('key', () => {
    throw new Error('Failed to compute');
  });
} catch (error) {
  // Cache state is unmodified
}
```

### Batch Operations

```typescript
const cache = new EvictingCache<string, number>(100);

// Add multiple entries at once
cache.putAll([
  ['a', 1],
  ['b', 2],
  ['c', 3]
]);

// Can also use a Map
cache.putAll(new Map([['d', 4], ['e', 5]]));

// Get multiple values (returns Map, excludes missing keys)
const values = cache.getAll(['a', 'b', 'missing']);
console.log(values.size); // 2
console.log(values.get('a')); // 1
console.log(values.has('missing')); // false

// Delete multiple keys (returns count removed)
const removed = cache.deleteAll(['a', 'c', 'missing']);
console.log(removed); // 2
```

### Cache Statistics

```typescript
const cache = new EvictingCache<string, string>(10);

cache.put('a', 'value1');
cache.get('a'); // hit
cache.get('b'); // miss
cache.get('a'); // hit

const stats = cache.getStats();
console.log(stats.hits); // 2
console.log(stats.misses); // 1
console.log(stats.hitRate); // 0.667 (66.7%)

// Reset statistics
cache.resetStats();
console.log(cache.getStats().hits); // 0
```

### Iteration

```typescript
const cache = new EvictingCache<string, number>(3);
cache.put('a', 1);
cache.put('b', 2);
cache.put('c', 3);

// Iterate over entries (LRU to MRU order)
for (const [key, value] of cache) {
  console.log(key, value);
}

// Or use forEach
cache.forEach((value, key, cache) => {
  console.log(key, value);
});

// Get keys, values, or entries
console.log([...cache.keys()]); // ['a', 'b', 'c']
console.log([...cache.values()]); // [1, 2, 3]
console.log([...cache.entries()]); // [['a', 1], ['b', 2], ['c', 3]]
```

## API Reference

### Constructor

- `new EvictingCache<K, V>(capacity?: number)` - Creates a new cache with the specified capacity (default: 100)

### Core Methods

- `get(key: K): V | null` - Returns value and updates LRU order
- `peek(key: K): V | null` - Returns value without updating LRU order
- `put(key: K, value: V): void` - Adds or updates a key-value pair
- `delete(key: K): boolean` - Removes a key from the cache
- `has(key: K): boolean` - Checks if a key exists
- `getOrPut(key: K, producer: () => V): V` - Gets existing value or computes and stores new one
- `evict(): boolean` - Manually removes the LRU item
- `clear(): void` - Removes all items from the cache

### Batch Operations

- `putAll(entries: Iterable<[K, V]>): void` - Adds multiple entries
- `getAll(keys: Iterable<K>): Map<K, V>` - Gets multiple values
- `deleteAll(keys: Iterable<K>): number` - Removes multiple keys

### Statistics

- `getStats(): { hits: number, misses: number, hitRate: number }` - Returns cache statistics
- `resetStats(): void` - Resets statistics counters

### Iteration

- `keys(): IterableIterator<K>` - Returns an iterator over keys
- `values(): IterableIterator<V>` - Returns an iterator over values
- `entries(): IterableIterator<[K, V]>` - Returns an iterator over entries
- `forEach(callback: (value: V, key: K, cache: EvictingCache<K, V>) => void, thisArg?: unknown): void` - Executes callback for each entry
- `[Symbol.iterator]()` - Makes the cache iterable

### Properties

- `capacity: number` - Maximum number of items (read-only)
- `size: number` - Current number of items (read-only)

## Performance

All core operations have **O(1)** time complexity:

| Operation | Complexity | Updates LRU |
|-----------|------------|-------------|
| `get(key)` | O(1) | ✅ Yes |
| `peek(key)` | O(1) | ❌ No |
| `put(key, value)` | O(1) | ✅ Yes |
| `delete(key)` | O(1) | ❌ N/A |
| `evict()` | O(1) | ❌ N/A |
| `has(key)` | O(1) | ❌ No |
| `clear()` | O(1) | ❌ N/A |

**Space complexity:** O(n) where n is the capacity

## TypeScript Support

Full TypeScript support with generic types:

```typescript
// Strongly typed cache
const userCache = new EvictingCache<number, User>(100);
const configCache = new EvictingCache<string, Config>(50);

// Works with any key/value types
const complexCache = new EvictingCache<{ id: number; tenant: string }, Promise<Data>>(25);
```

## Browser Compatibility

Compatible with all modern browsers and Node.js environments that support ES2015+ features:
- Chrome/Edge: ✅ Latest
- Firefox: ✅ Latest
- Safari: ✅ 15+
- Node.js: ✅ 14+

## License

ISC License - See [LICENSE](LICENSE) file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.