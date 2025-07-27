import { EvictingCache } from '../src/evicting-cache';
import { describe, test, expect } from 'vitest';

describe('EvictingCache', () => {
	test('constructor', () => {
		const cache = new EvictingCache<string, number>();
		expect(cache.capacity).toBe(100);
		expect(cache.size).toBe(0);
		expect(cache.toString()).toBe('[object EvictingCache]');
	});

	test('constructor with capacity', () => {
		const cache = new EvictingCache<string, number>(3);
		expect(cache.capacity).toBe(3);
		expect(cache.size).toBe(0);
		expect(cache.toString()).toBe('[object EvictingCache]');
	});

	test('constructor with invalid capacity', () => {
		expect(() => new EvictingCache<string, number>(-1)).toThrow(RangeError);
		expect(() => new EvictingCache<string, number>(0)).toThrow(RangeError);
		expect(() => new EvictingCache<string, number>(1.5)).toThrow(RangeError);
		expect(() => new EvictingCache<string, number>(Infinity)).toThrow(RangeError);
	});

	test('put', () => {
		const cache = new EvictingCache<string, number>(3);
		expect(cache.put('a', 1)).toBeUndefined();
		expect(cache.put('b', 2)).toBeUndefined();
		expect(cache.put('c', 3)).toBeUndefined();
		expect(cache.put('d', 4)).toBeUndefined();
		expect(cache.size).toBe(3);
	});

	test('get', () => {
		const cache = new EvictingCache<string, number>(3);
		expect(cache.put('a', 1)).toBeUndefined();
		expect(cache.put('b', 2)).toBeUndefined();
		expect(cache.put('c', 3)).toBeUndefined();
		expect(cache.get('a')).toBe(1);
		expect(cache.get('b')).toBe(2);
		expect(cache.get('c')).toBe(3);
		expect(cache.size).toBe(3);
	});

	test('getOrPut', () => {
		const cache = new EvictingCache<string, number>(3);
		expect(cache.getOrPut('a', () => 1)).toBe(1);
		expect(cache.getOrPut('b', () => 2)).toBe(2);
		expect(cache.getOrPut('c', () => 3)).toBe(3);
		expect(cache.getOrPut('a', () => 4)).toBe(1);
		expect(cache.getOrPut('b', () => 5)).toBe(2);
		expect(cache.getOrPut('c', () => 6)).toBe(3);
		expect(cache.size).toBe(3);
	});

	test('evict', () => {
		const cache = new EvictingCache<string, number>(3);
		expect(cache.put('a', 1)).toBeUndefined();
		expect(cache.put('b', 2)).toBeUndefined();
		expect(cache.put('c', 3)).toBeUndefined();
		expect(cache.evict()).toBe(true);
		expect(cache.has('a')).toBe(false);
		expect(cache.evict()).toBe(true);
		expect(cache.has('b')).toBe(false);
		expect(cache.evict()).toBe(true);
		expect(cache.size).toBe(0);
		expect(cache.evict()).toBe(false);
		expect(cache.size).toBe(0);
	});

	test('clear', () => {
		const cache = new EvictingCache<string, number>(3);
		expect(cache.put('a', 1)).toBeUndefined();
		expect(cache.put('b', 2)).toBeUndefined();
		expect(cache.put('c', 3)).toBeUndefined();
		expect(cache.clear()).toBeUndefined();
		expect(cache.size).toBe(0);
	});

	test('capacity', () => {
		const cache = new EvictingCache<string, number>(3);
		expect(cache.capacity).toBe(3);
	});

	test('size', () => {
		const cache = new EvictingCache<string, number>(3);
		expect(cache.size).toBe(0);
		expect(cache.put('a', 1)).toBeUndefined();
		expect(cache.size).toBe(1);
		expect(cache.put('b', 2)).toBeUndefined();
		expect(cache.size).toBe(2);
		expect(cache.put('c', 3)).toBeUndefined();
		expect(cache.size).toBe(3);
		expect(cache.put('d', 4)).toBeUndefined();
		expect(cache.size).toBe(3);
		expect(cache.evict()).toBe(true);
		expect(cache.size).toBe(2);
		expect(cache.evict()).toBe(true);
		expect(cache.size).toBe(1);
		expect(cache.evict()).toBe(true);
		expect(cache.size).toBe(0);
		expect(cache.evict()).toBe(false);
		expect(cache.size).toBe(0);
	});

	test('Symbol.toStringTag', () => {
		const cache = new EvictingCache<string, number>(3);
		expect(cache[Symbol.toStringTag]).toBe('EvictingCache');
	});

	test('put with existing key', () => {
		const cache = new EvictingCache<string, number>(3);
		expect(cache.put('a', 1)).toBeUndefined();
		expect(cache.put('a', 2)).toBeUndefined();
		expect(cache.get('a')).toBe(2);
	});

	test('get with non-existent key', () => {
		const cache = new EvictingCache<string, number>(3);
		expect(cache.get('a')).toBe(null);
	});

	test('evict with empty cache', () => {
		const cache = new EvictingCache<string, number>(3);
		expect(cache.evict()).toBe(false);
	});

	test('clear with empty cache', () => {
		const cache = new EvictingCache<string, number>(3);
		expect(cache.clear()).toBeUndefined();
	});

	test('peek', () => {
		const cache = new EvictingCache<string, number>(3);
		expect(cache.put('a', 1)).toBeUndefined();
		expect(cache.peek('a')).toBe(1);
		expect(cache.peek('b')).toBe(null);
		expect(cache.size).toBe(1);
	});

	test('object keys', () => {
		const cache = new EvictingCache<object, number>(3);
		const key1 = { id: 1 };
		const key2 = { id: 2 };
		const key3 = { id: 3 };
		const key4 = { id: 4 };

		cache.put(key1, 1);
		cache.put(key2, 2);
		cache.put(key3, 3);

		expect(cache.get(key1)).toBe(1);
		expect(cache.get(key2)).toBe(2);
		expect(cache.get(key3)).toBe(3);
		expect(cache.size).toBe(3);

		cache.put(key4, 4);
		expect(cache.size).toBe(3);
		expect(cache.has(key1)).toBe(false); // key1 should be evicted
		expect(cache.get(key2)).toBe(2);
		expect(cache.get(key3)).toBe(3);
		expect(cache.get(key4)).toBe(4);
	});

	test('array keys', () => {
		const cache = new EvictingCache<any[], number>(3);
		const key1 = [1];
		const key2 = [2];
		const key3 = [3];
		const key4 = [4];

		cache.put(key1, 1);
		cache.put(key2, 2);
		cache.put(key3, 3);

		expect(cache.get(key1)).toBe(1);
		expect(cache.get(key2)).toBe(2);
		expect(cache.get(key3)).toBe(3);
		expect(cache.size).toBe(3);

		cache.put(key4, 4);
		expect(cache.size).toBe(3);
		expect(cache.has(key1)).toBe(false); // key1 should be evicted
		expect(cache.get(key2)).toBe(2);
		expect(cache.get(key3)).toBe(3);
		expect(cache.get(key4)).toBe(4);
	});

	test('Map keys', () => {
		const cache = new EvictingCache<Map<string, number>, number>(3);
		const key1 = new Map([['a', 1]]);
		const key2 = new Map([['b', 2]]);
		const key3 = new Map([['c', 3]]);
		const key4 = new Map([['d', 4]]);

		cache.put(key1, 1);
		cache.put(key2, 2);
		cache.put(key3, 3);

		expect(cache.get(key1)).toBe(1);
		expect(cache.get(key2)).toBe(2);
		expect(cache.get(key3)).toBe(3);
		expect(cache.size).toBe(3);

		cache.put(key4, 4);
		expect(cache.size).toBe(3);
		expect(cache.has(key1)).toBe(false); // key1 should be evicted
		expect(cache.get(key2)).toBe(2);
		expect(cache.get(key3)).toBe(3);
		expect(cache.get(key4)).toBe(4);
	});

	test('Set keys', () => {
		const cache = new EvictingCache<Set<number>, number>(3);
		const key1 = new Set([1]);
		const key2 = new Set([2]);
		const key3 = new Set([3]);
		const key4 = new Set([4]);

		cache.put(key1, 1);
		cache.put(key2, 2);
		cache.put(key3, 3);

		expect(cache.get(key1)).toBe(1);
		expect(cache.get(key2)).toBe(2);
		expect(cache.get(key3)).toBe(3);
		expect(cache.size).toBe(3);

		cache.put(key4, 4);
		expect(cache.size).toBe(3);
		expect(cache.has(key1)).toBe(false); // key1 should be evicted
		expect(cache.get(key2)).toBe(2);
		expect(cache.get(key3)).toBe(3);
		expect(cache.get(key4)).toBe(4);
	});

	test('Date keys', () => {
		const cache = new EvictingCache<Date, number>(3);
		const key1 = new Date('2025-07-27T00:00:00.000Z');
		const key2 = new Date('2025-07-28T00:00:00.000Z');
		const key3 = new Date('2025-07-29T00:00:00.000Z');
		const key4 = new Date('2025-07-30T00:00:00.000Z');

		cache.put(key1, 1);
		cache.put(key2, 2);
		cache.put(key3, 3);

		expect(cache.get(key1)).toBe(1);
		expect(cache.get(key2)).toBe(2);
		expect(cache.get(key3)).toBe(3);
		expect(cache.size).toBe(3);

		cache.put(key4, 4);
		expect(cache.size).toBe(3);
		expect(cache.has(key1)).toBe(false); // key1 should be evicted
		expect(cache.get(key2)).toBe(2);
		expect(cache.get(key3)).toBe(3);
		expect(cache.get(key4)).toBe(4);
	});

	describe('randomized tests', () => {
		// Simple seeded random number generator for reproducibility
		const seededRandom = (seed => () => {
			seed = (seed * 9301 + 49297) % 233280;
			return seed / 233280;
		})(1);

		const generateRandomString = (length: number): string => {
			const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
			let result = '';
			for (let i = 0; i < length; i++) {
				result += chars.charAt(Math.floor(seededRandom() * chars.length));
			}
			return result;
		};

		test('a series of random operations', () => {
			const capacity = Math.floor(seededRandom() * 99) + 1; // 1 to 100
			const cache = new EvictingCache<string, number>(capacity);
			const referenceMap = new Map<string, number>();
			const lruOrder: string[] = [];

			const operations = ['put', 'get', 'getOrPut', 'peek', 'has', 'evict', 'clear'];
			const numOperations = 1000;

			for (let i = 0; i < numOperations; i++) {
				const operation = operations[Math.floor(seededRandom() * operations.length)];
				const key = generateRandomString(5);
				const value = Math.floor(seededRandom() * 1000);

				switch (operation) {
					case 'put': {
						if (referenceMap.has(key)) {
							lruOrder.splice(lruOrder.indexOf(key), 1);
						} else if (referenceMap.size === capacity) {
							const evictedKey = lruOrder.shift();
							if (evictedKey) {
								referenceMap.delete(evictedKey);
							}
						}
						referenceMap.set(key, value);
						lruOrder.push(key);
						cache.put(key, value);
						break;
					}
					case 'get': {
						const expectedValue = referenceMap.get(key) ?? null;
						expect(cache.get(key)).toBe(expectedValue);
						if (referenceMap.has(key)) {
							lruOrder.splice(lruOrder.indexOf(key), 1);
							lruOrder.push(key);
						}
						break;
					}
					case 'getOrPut': {
						let expectedValue = referenceMap.get(key);
						if (expectedValue === undefined) {
							expectedValue = value;
							if (referenceMap.size === capacity) {
								const evictedKey = lruOrder.shift();
								if (evictedKey) {
									referenceMap.delete(evictedKey);
								}
							}
							referenceMap.set(key, expectedValue);
							lruOrder.push(key);
						} else {
							lruOrder.splice(lruOrder.indexOf(key), 1);
							lruOrder.push(key);
						}
						expect(cache.getOrPut(key, () => value)).toBe(expectedValue);
						break;
					}
					case 'peek': {
						const expectedValue = referenceMap.get(key) ?? null;
						expect(cache.peek(key)).toBe(expectedValue);
						break;
					}
					case 'has': {
						expect(cache.has(key)).toBe(referenceMap.has(key));
						break;
					}
					case 'evict': {
						if (referenceMap.size > 0) {
							const evictedKey = lruOrder.shift();
							if (evictedKey) {
								referenceMap.delete(evictedKey);
							}
							expect(cache.evict()).toBe(true);
						} else {
							expect(cache.evict()).toBe(false);
						}
						break;
					}
					case 'clear': {
						referenceMap.clear();
						lruOrder.length = 0;
						cache.clear();
						break;
					}
				}
				expect(cache.size).toBe(referenceMap.size);
			}
		});
	});
});
