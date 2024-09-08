# Evicting Cache
JavaScript Cache using an LRU (Least Recently Used) algorithm

The cache is backed by a LinkedMap, which is a Map that maintains insertion order. When the cache is full, the least recently used item is evicted.

## Installation

```bash
// pnpm 🎉
pnpm add evicting-cache

// npm 🤷🏽‍♂️
npm install evicting-cache
```

## Usage
```javascript
import EvictingCache from 'evicting-cache';

// Constructor accepts a number, which is the maximum number of items to store.
// default is 100
const cache = new EvictingCache(3);

// Obviously a contrived example, but this is what you get with AI...
cache.put('key1', 'value1');
cache.put('key2', 'value2');
cache.put('key3', 'value3');
cache.put('key4', 'value4');

console.log(cache.get('key1')); // undefined
console.log(cache.get('key2')); // value2
console.log(cache.get('key3')); // value3
console.log(cache.get('key4')); // value4

cache.put('key5', 'value5');

console.log(cache.get('key2')); // undefined

```