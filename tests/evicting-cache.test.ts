import { EvictingCache } from '../src/evicting-cache';
import { describe, test, expect, beforeEach } from 'vitest';

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
		const cache = new EvictingCache<number, boolean>(3);
		cache.put(1, true);
		cache.put(2, false);
		cache.put(3, true);
		cache.put(4, false);
		expect(cache.size).toBe(3);
		expect(cache.has(1)).toBe(false);
		expect(cache.get(2)).toBe(false);
	});

	test('get', () => {
		const cache = new EvictingCache<boolean, string>(3);
		cache.put(true, 'hello');
		cache.put(false, 'world');
		expect(cache.get(true)).toBe('hello');
		expect(cache.get(false)).toBe('world');
		expect(cache.get(true)).toBe('hello');
		expect(cache.size).toBe(2);
	});

	test('getOrPut', () => {
		const cache = new EvictingCache<{ id: number }, { name: string }>(3);
		const key1 = { id: 1 };
		const value1 = { name: 'one' };
		const key2 = { id: 2 };
		const value2 = { name: 'two' };
		const key3 = { id: 3 };
		const value3 = { name: 'three' };

		expect(cache.getOrPut(key1, () => value1)).toBe(value1);
		expect(cache.getOrPut(key2, () => value2)).toBe(value2);
		expect(cache.getOrPut(key3, () => value3)).toBe(value3);
		expect(cache.getOrPut(key1, () => ({ name: 'another one' }))).toBe(value1);
		expect(cache.size).toBe(3);
	});

	test('evict', () => {
		const cache = new EvictingCache<Date, string>(3);
		const day1 = new Date('2025-01-01');
		const day2 = new Date('2025-01-02');
		const day3 = new Date('2025-01-03');
		cache.put(day1, 'a');
		cache.put(day2, 'b');
		cache.put(day3, 'c');
		expect(cache.evict()).toBe(true);
		expect(cache.has(day1)).toBe(false);
		expect(cache.evict()).toBe(true);
		expect(cache.has(day2)).toBe(false);
		expect(cache.evict()).toBe(true);
		expect(cache.size).toBe(0);
		expect(cache.evict()).toBe(false);
		expect(cache.size).toBe(0);
	});

	test('clear', () => {
		const cache = new EvictingCache<any[], number>(3);
		cache.put([1], 10);
		cache.put([2], 20);
		cache.put([3], 30);
		cache.clear();
		expect(cache.size).toBe(0);
		expect(cache.has([1])).toBe(false);
	});

	test('capacity', () => {
		const cache = new EvictingCache<string, number>(3);
		expect(cache.capacity).toBe(3);
	});

	test('size', () => {
		const cache = new EvictingCache<Set<string>, { active: boolean }>(3);
		const set1 = new Set(['a']);
		const set2 = new Set(['b']);
		const set3 = new Set(['c']);
		const set4 = new Set(['d']);

		expect(cache.size).toBe(0);
		cache.put(set1, { active: true });
		expect(cache.size).toBe(1);
		cache.put(set2, { active: true });
		expect(cache.size).toBe(2);
		cache.put(set3, { active: false });
		expect(cache.size).toBe(3);
		cache.put(set4, { active: true });
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
		const cache = new EvictingCache<Map<string, number>, string[]>(3);
		const map1 = new Map([['a', 1]]);
		const map2 = new Map([['b', 2]]);
		cache.put(map1, ['a']);
		cache.put(map1, ['b']);
		cache.put(map2, ['c']);
		expect(cache.get(map1)).toEqual(['b']);
		expect(cache.get(map2)).toEqual(['c']);
	});

	test('get with non-existent key', () => {
		const cache = new EvictingCache<any, any>(3);
		expect(cache.get('a')).toBe(null);
		expect(cache.get(null)).toBe(null);
		expect(cache.get(undefined)).toBe(null);
	});

	test('evict with empty cache', () => {
		const cache = new EvictingCache<string, number>(3);
		expect(cache.evict()).toBe(false);
	});

	test('clear with empty cache', () => {
		const cache = new EvictingCache<string, number>(3);
		expect(cache.clear()).toBeUndefined();
	});

	test('peek does not affect LRU order', () => {
		const cache = new EvictingCache<bigint, string>(3);
		cache.put(1n, 'one');
		cache.put(2n, 'two');
		cache.put(3n, 'three'); // LRU order: 1n, 2n, 3n

		// Peek at the least recently used item. This should not change its position.
		expect(cache.peek(1n)).toBe('one');

		// Peek at an item that is not in the cache.
		expect(cache.peek(99n)).toBe(null);

		// Add a new item to trigger eviction.
		cache.put(4n, 'four');

		// 1n should have been evicted.
		expect(cache.has(1n)).toBe(false);
		expect(cache.has(2n)).toBe(true);
		expect(cache.has(3n)).toBe(true);
		expect(cache.has(4n)).toBe(true);
	});

	test('get affects LRU order', () => {
		const cache = new EvictingCache<string, { status: string }>(3);
		const val1 = { status: 'active' };
		const val2 = { status: 'inactive' };
		const val3 = { status: 'pending' };
		const val4 = { status: 'archived' };

		cache.put('a', val1);
		cache.put('b', val2);
		cache.put('c', val3); // LRU order: a, b, c

		// Get the least recently used item, which moves it to the end.
		expect(cache.get('a')).toBe(val1); // LRU order: b, c, a

		// Add a new item to trigger eviction.
		cache.put('d', val4);

		// 'b' should have been evicted.
		expect(cache.has('b')).toBe(false);
		expect(cache.has('a')).toBe(true);
		expect(cache.has('c')).toBe(true);
		expect(cache.has('d')).toBe(true);
	});

	test('object keys', () => {
		const cache = new EvictingCache<object, { value: string; timestamp: Date }>(3);
		const key1 = { id: 1 };
		const key2 = { id: 2 };
		const key3 = { id: 3 };
		const key4 = { id: 4 };

		const value1 = { value: 'one', timestamp: new Date() };
		const value2 = { value: 'two', timestamp: new Date() };
		const value3 = { value: 'three', timestamp: new Date() };
		const value4 = { value: 'four', timestamp: new Date() };

		cache.put(key1, value1);
		cache.put(key2, value2);
		cache.put(key3, value3);

		expect(cache.get(key1)).toBe(value1);
		expect(cache.get(key2)).toBe(value2);
		expect(cache.get(key3)).toBe(value3);
		expect(cache.size).toBe(3);

		cache.put(key4, value4);
		expect(cache.size).toBe(3);
		expect(cache.has(key1)).toBe(false); // key1 should be evicted
		expect(cache.get(key2)).toBe(value2);
		expect(cache.get(key3)).toBe(value3);
		expect(cache.get(key4)).toBe(value4);
	});

	test('array keys', () => {
		const cache = new EvictingCache<any[], { data: string }>(3);
		const key1 = [1];
		const key2 = [2];
		const key3 = [3];
		const key4 = [4];

		const value1 = { data: 'one' };
		const value2 = { data: 'two' };
		const value3 = { data: 'three' };
		const value4 = { data: 'four' };

		cache.put(key1, value1);
		cache.put(key2, value2);
		cache.put(key3, value3);

		expect(cache.get(key1)).toBe(value1);
		expect(cache.get(key2)).toBe(value2);
		expect(cache.get(key3)).toBe(value3);
		expect(cache.size).toBe(3);

		cache.put(key4, value4);
		expect(cache.size).toBe(3);
		expect(cache.has(key1)).toBe(false); // key1 should be evicted
		expect(cache.get(key2)).toBe(value2);
		expect(cache.get(key3)).toBe(value3);
		expect(cache.get(key4)).toBe(value4);
	});

	test('Map keys', () => {
		const cache = new EvictingCache<Map<string, number>, { valid: boolean }>(3);
		const key1 = new Map([['a', 1]]);
		const key2 = new Map([['b', 2]]);
		const key3 = new Map([['c', 3]]);
		const key4 = new Map([['d', 4]]);

		const value1 = { valid: true };
		const value2 = { valid: true };
		const value3 = { valid: false };
		const value4 = { valid: true };

		cache.put(key1, value1);
		cache.put(key2, value2);
		cache.put(key3, value3);

		expect(cache.get(key1)).toBe(value1);
		expect(cache.get(key2)).toBe(value2);
		expect(cache.get(key3)).toBe(value3);
		expect(cache.size).toBe(3);

		cache.put(key4, value4);
		expect(cache.size).toBe(3);
		expect(cache.has(key1)).toBe(false); // key1 should be evicted
		expect(cache.get(key2)).toBe(value2);
		expect(cache.get(key3)).toBe(value3);
		expect(cache.get(key4)).toBe(value4);
	});

	test('Set keys', () => {
		const cache = new EvictingCache<Set<number>, string>(3);
		const key1 = new Set([1]);
		const key2 = new Set([2]);
		const key3 = new Set([3]);
		const key4 = new Set([4]);

		cache.put(key1, 'one');
		cache.put(key2, 'two');
		cache.put(key3, 'three');

		expect(cache.get(key1)).toBe('one');
		expect(cache.get(key2)).toBe('two');
		expect(cache.get(key3)).toBe('three');
		expect(cache.size).toBe(3);

		cache.put(key4, 'four');
		expect(cache.size).toBe(3);
		expect(cache.has(key1)).toBe(false); // key1 should be evicted
		expect(cache.get(key2)).toBe('two');
		expect(cache.get(key3)).toBe('three');
		expect(cache.get(key4)).toBe('four');
	});

	test('Symbol keys', () => {
		const cache = new EvictingCache<symbol, string[]>(3);
		const key1 = Symbol('key1');
		const key2 = Symbol('key2');
		const key3 = Symbol('key3');
		const key4 = Symbol('key4');
		const value1 = ['v1'];
		const value2 = ['v2'];
		const value3 = ['v3'];
		const value4 = ['v4'];

		cache.put(key1, value1);
		cache.put(key2, value2);
		cache.put(key3, value3);

		expect(cache.get(key1)).toBe(value1);
		expect(cache.get(key2)).toBe(value2);
		expect(cache.get(key3)).toBe(value3);
		expect(cache.size).toBe(3);

		cache.put(key4, value4);
		expect(cache.size).toBe(3);
		expect(cache.has(key1)).toBe(false); // key1 should be evicted
		expect(cache.get(key2)).toBe(value2);
		expect(cache.get(key3)).toBe(value3);
		expect(cache.get(key4)).toBe(value4);
	});

	test('Date keys', () => {
		const cache = new EvictingCache<Date, { event: string; year: number }>(3);
		const key1 = new Date('2025-07-27T00:00:00.000Z');
		const key2 = new Date('2025-07-28T00:00:00.000Z');
		const key3 = new Date('2025-07-29T00:00:00.000Z');
		const key4 = new Date('2025-07-30T00:00:00.000Z');

		const value1 = { event: 'Conference Day 1', year: 2025 };
		const value2 = { event: 'Conference Day 2', year: 2025 };
		const value3 = { event: 'Workshop Day 1', year: 2025 };
		const value4 = { event: 'Workshop Day 2', year: 2025 };

		cache.put(key1, value1);
		cache.put(key2, value2);
		cache.put(key3, value3);

		expect(cache.get(key1)).toBe(value1);
		expect(cache.get(key2)).toBe(value2);
		expect(cache.get(key3)).toBe(value3);
		expect(cache.size).toBe(3);

		cache.put(key4, value4);
		expect(cache.size).toBe(3);
		expect(cache.has(key1)).toBe(false); // key1 should be evicted
		expect(cache.get(key2)).toBe(value2);
		expect(cache.get(key3)).toBe(value3);
		expect(cache.get(key4)).toBe(value4);
	});

	describe('iterators', () => {
		let cache: EvictingCache<number, { text: string }>;
		beforeEach(() => {
			cache = new EvictingCache<number, { text: string }>(3);
			cache.put(1, { text: 'a' });
			cache.put(2, { text: 'b' });
			cache.put(3, { text: 'c' });
		});

		test('keys', () => {
			const keys = [...cache.keys()];
			expect(keys).toEqual([1, 2, 3]);
		});

		test('values', () => {
			const values = [...cache.values()];
			expect(values).toEqual([{ text: 'a' }, { text: 'b' }, { text: 'c' }]);
		});

		test('entries', () => {
			const entries = [...cache.entries()];
			expect(entries).toEqual([[1, { text: 'a' }], [2, { text: 'b' }], [3, { text: 'c' }]]);
		});

		test('[Symbol.iterator]', () => {
			const entries = [...cache];
			expect(entries).toEqual([[1, { text: 'a' }], [2, { text: 'b' }], [3, { text: 'c' }]]);
		});

		test('iterators with get calls to change order', () => {
			cache.get(1);
			const keys = [...cache.keys()];
			expect(keys).toEqual([2, 3, 1]);
			const values = [...cache.values()];
			expect(values).toEqual([{ text: 'b' }, { text: 'c' }, { text: 'a' }]);
			const entries = [...cache.entries()];
			expect(entries).toEqual([[2, { text: 'b' }], [3, { text: 'c' }], [1, { text: 'a' }]]);
		});
	});
});
