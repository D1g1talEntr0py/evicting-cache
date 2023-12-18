import LinkedMap from '@d1g1tal/collections/dist/linked-map.js';

/**
 * JavaScript implementation of a Least Recently Used(LRU) Cache using a doubly linked list.
 *
 * @template K
 * @template V
 * @type {EvictingCache<K, V>}
 */
export default class EvictingCache {
	/** @type {number} */
	#capacity;
	/** @type {LinkedMap<K, V>} */
	#cache;

	/**
	 * Creates a new Evicting Cache with the given capacity.
	 *
	 * @param {number} [capacity=100] The maximum number of key-value pairs the cache can hold.
	 */
	constructor(capacity = 100) {
		if (capacity < 1) { throw new RangeError('capacity must be greater than 0') }
		if (!Number.isInteger(capacity)) { throw new RangeError('capacity must be an integer') }

		this.#capacity = capacity;
		this.#cache = new LinkedMap();
	}

	/**
	 * Returns the value associated with the given key from the cache and updates the LRU order.
	 *
	 * @param {K} key The key to get the value for.
	 * @returns {V|null} The associated value if the key is in the cache, or null otherwise.
	 */
	get(key) {
		const value = this.#cache.get(key);
		if (!value) { return null }

		this.#cache.moveToFirst(key);

		return value;
	}

	/**
	 * Returns true if the given key is in the cache, false otherwise.
	 *
	 * @param {K} key The key to check.
	 * @returns {boolean} True if the key is in the cache, false otherwise.
	 */
	has(key) {
		return this.#cache.has(key);
	}

	/**
	 * Adds a new key-value pair to the cache and updates the LRU order.
	 * If adding the new pair will exceed the capacity, removes the least recently used pair from the cache.
	 *
	 * @param {K} key The key to add.
	 * @param {V} value The value to add.
	 * @returns {void}
	 */
	put(key, value) {
		this.#put(key, value);
	}

	/**
	 * Returns the value for the key if it exists in the cache. If not, put the key-value pair into the cache and return the value.
	 * @param {K} key The key.
	 * @param {function(): V} producer The value to put if the key does not exist in the cache.
	 * @returns {V} The value corresponding to the key.
	 */
	getOrPut(key, producer) {
		return this.get(key) ?? this.#put(key, producer());
	}

	/**
	 * Removes the least recently used key-value pair from the cache.
	 *
	 * @returns {boolean} True if an item was removed, false otherwise.
	 */
	evict() {
		return this.#cache.size ? this.#cache.removeLast() : false;
	}

	/**
	 * Clears the cache and the LRU list.
	 *
	 * @returns {void}
	 */
	clear() {
		this.#cache.clear();
	}

	/**
	 * Gets the capacity of the cache.
	 * This is the maximum number of key-value pairs the cache can hold.
	 * This is not the number of key-value pairs in the cache.
	 *
	 * @readonly
	 * @returns {number} The capacity of the cache.
	 */
	get capacity() {
		return this.#capacity;
	}

	/**
	 * Gets the size of the cache.
	 * This is the number of key-value pairs in the cache.
	 * This is not the capacity of the cache.
	 * The capacity is the maximum number of key-value pairs the cache can hold.
	 * The size is the number of key-value pairs currently in the cache.
	 * The size will be less than or equal to the capacity.
	 *
	 * @returns {number} The size of the cache.
	 */
	get size() {
		return this.#cache.size;
	}

	/**
	 * Gets the description of the object.
	 *
	 * @override
	 * @returns {string} The description of the object.
	 */
	get [Symbol.toStringTag]() {
		return 'EvictingCache';
	}

	#put(key, value) {
		this.#cache.addFirst(key, value);
		if (this.#cache.size > this.#capacity) { this.evict() }

		return value;
	}
}