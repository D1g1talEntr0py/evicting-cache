import EvictingCache from '../src/evicting-cache';
import { describe, test, expect } from '@jest/globals';

describe('EvictingCache', () => {
	test('constructor', () => {
		const cache = new EvictingCache();
		expect(cache.capacity).toBe(100);
		expect(cache.size).toBe(0);
		expect(cache.toString()).toBe('[object EvictingCache]');
	});

	test('constructor with capacity', () => {
		const cache = new EvictingCache(3);
		expect(cache.capacity).toBe(3);
		expect(cache.size).toBe(0);
		expect(cache.toString()).toBe('[object EvictingCache]');
	});

	test('constructor with invalid capacity', () => {
		expect(() => new EvictingCache(-1)).toThrow(RangeError);
		expect(() => new EvictingCache(0)).toThrow(RangeError);
		expect(() => new EvictingCache(1.5)).toThrow(RangeError);
		expect(() => new EvictingCache(Infinity)).toThrow(RangeError);
	});

	test('put', () => {
		const cache = new EvictingCache(3);
		expect(cache.put('a', 1)).toBeUndefined();
		expect(cache.put('b', 2)).toBeUndefined();
		expect(cache.put('c', 3)).toBeUndefined();
		expect(cache.put('d', 4)).toBeUndefined();
		expect(cache.size).toBe(3);
	});

	test('get', () => {
		const cache = new EvictingCache(3);
		expect(cache.put('a', 1)).toBeUndefined();
		expect(cache.put('b', 2)).toBeUndefined();
		expect(cache.put('c', 3)).toBeUndefined();
		expect(cache.get('a')).toBe(1);
		expect(cache.get('b')).toBe(2);
		expect(cache.get('c')).toBe(3);
		expect(cache.size).toBe(3);
	});

	test('getOrPut', () => {
		const cache = new EvictingCache(3);
		expect(cache.getOrPut('a', () => 1)).toBe(1);
		expect(cache.getOrPut('b', () => 2)).toBe(2);
		expect(cache.getOrPut('c', () => 3)).toBe(3);
		expect(cache.getOrPut('a', () => 4)).toBe(1);
		expect(cache.getOrPut('b', () => 5)).toBe(2);
		expect(cache.getOrPut('c', () => 6)).toBe(3);
		expect(cache.size).toBe(3);
	});

	test('evict', () => {
		const cache = new EvictingCache(3);
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
		const cache = new EvictingCache(3);
		expect(cache.put('a', 1)).toBeUndefined();
		expect(cache.put('b', 2)).toBeUndefined();
		expect(cache.put('c', 3)).toBeUndefined();
		expect(cache.clear()).toBeUndefined();
		expect(cache.size).toBe(0);
	});

	test('capacity', () => {
		const cache = new EvictingCache(3);
		expect(cache.capacity).toBe(3);
	});

	test('size', () => {
		const cache = new EvictingCache(3);
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
		const cache = new EvictingCache(3);
		expect(cache[Symbol.toStringTag]).toBe('EvictingCache');
	});

	test('put with existing key', () => {
		const cache = new EvictingCache(3);
		expect(cache.put('a', 1)).toBeUndefined();
		expect(cache.put('a', 2)).toBeUndefined();
		expect(cache.get('a')).toBe(2);
	});

	test('get with non-existent key', () => {
		const cache = new EvictingCache(3);
		expect(cache.get('a')).toBe(null);
	});

	test('evict with empty cache', () => {
		const cache = new EvictingCache(3);
		expect(cache.evict()).toBe(false);
	});

	test('clear with empty cache', () => {
		const cache = new EvictingCache(3);
		expect(cache.clear()).toBeUndefined();
	});
});
