/** JavaScript implementation of a Least Recently Used(LRU) Cache using a Map. */
export class EvictingCache<K, V> {
	private readonly _capacity: number;
	private readonly cache: Map<K, V>;

	/**
	 * Creates a new Evicting Cache with the given capacity.
	 *
	 * @param {number} [capacity=100] The maximum number of key-value pairs the cache can hold.
	 */
	constructor(capacity: number = 100) {
		if (capacity < 1) { throw new RangeError('capacity must be greater than 0') }
		if (!Number.isInteger(capacity)) { throw new RangeError('capacity must be an integer') }

		this._capacity = capacity;
		this.cache = new Map();
	}

	/**
	 * Returns the value associated with the given key from the cache and updates the LRU order.
	 *
	 * @param {K} key The key to get the value for.
	 * @returns {V | null} The associated value if the key is in the cache, or null otherwise.
	 */
	get(key: K): V | null {
		const value = this.cache.get(key);
		if (value === undefined) { return null }

		this.cache.delete(key);
		// Move the accessed item to the end (most recently used)
		this.cache.set(key, value);

		return value;
	}

	/**
	 * Returns true if the given key is in the cache, false otherwise.
	 *
	 * @param {K} key The key to check.
	 * @returns {boolean} True if the key is in the cache, false otherwise.
	 */
	has(key: K): boolean {
		return this.cache.has(key);
	}

	/**
	 * Adds a new key-value pair to the cache and updates the LRU order.
	 * If adding the new pair will exceed the capacity, removes the least recently used pair from the cache.
	 *
	 * @param {K} key The key to add.
	 * @param {V} value The value to add.
	 * @returns {void}
	 */
	put(key: K, value: V): void {
		this.putAndEvict(key, value);
	}

	/**
	 * Returns the value associated with the given key from the cache without updating the LRU order.
	 *
	 * @param {K} key The key to get the value for.
	 * @returns {V | null} The associated value if the key is in the cache, or null otherwise.
	 */
	peek(key: K): V | null {
		return this.cache.get(key) ?? null;
	}

	/**
	 * Returns the value for the key if it exists in the cache. If not, put the key-value pair into the cache and return the value.
	 * @param {K} key The key.
	 * @param {function(): V} producer The value to put if the key does not exist in the cache.
	 * @returns {V} The value corresponding to the key.
	 */
	getOrPut(key: K, producer: () => V): V {
		return this.get(key) ?? this.putAndEvict(key, producer());
	}

	/**
	 * Removes the least recently used key-value pair from the cache.
	 *
	 * @returns {boolean} True if an item was removed, false otherwise.
	 */
	evict(): boolean {
		if (this.cache.size === 0) { return false }
		const key = this.cache.keys().next().value as K;

		return this.cache.delete(key);
	}

	/**
	 * Clears the cache and the LRU list.
	 *
	 * @returns {void}
	 */
	clear(): void {
		this.cache.clear();
	}

	/**
	 * Gets the capacity of the cache.
	 * This is the maximum number of key-value pairs the cache can hold.
	 * This is not the number of key-value pairs in the cache.
	 *
	 * @readonly
	 * @returns {number} The capacity of the cache.
	 */
	get capacity(): number {
		return this._capacity;
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
	get size(): number {
		return this.cache.size;
	}

	/**
	 * Returns an iterator over the keys in the cache.
	 * The keys are returned in the order of least recently used to most recently used.
	 *
	 * @returns {IterableIterator<K>} An iterator over the keys in the cache.
	 */
	keys(): IterableIterator<K> {
		return this.cache.keys();
	}

	/**
	 * Returns an iterator over the values in the cache.
	 * The values are returned in the order of least recently used to most recently used.
	 *
	 * @returns {IterableIterator<V>} An iterator over the values in the cache.
	 */
	values(): IterableIterator<V> {
		return this.cache.values();
	}

	/**
	 * Returns an iterator over the entries in the cache.
	 * The entries are returned in the order of least recently used to most recently used.
	 *
	 * @returns {IterableIterator<[K, V]>} An iterator over the entries in the cache.
	 */
	entries(): IterableIterator<[K, V]> {
		return this.cache.entries();
	}

	/**
	 * Returns an iterator over the entries in the cache.
	 * The entries are returned in the order of least recently used to most recently used.
	 *
	 * @returns {IterableIterator<[K, V]>} An iterator over the entries in the cache.
	 */
	[Symbol.iterator](): IterableIterator<[K, V]> {
		return this.entries();
	}

	/**
	 * Gets the description of the object.
	 *
	 * @override
	 * @returns {string} The description of the object.
	 */
	get [Symbol.toStringTag](): string {
		return 'EvictingCache';
	}

	/**
	 * Puts a key-value pair into the cache and evicts the least recently used item if necessary.
	 * If the key already exists, the item is removed and re-added to update its position.
	 * If the cache is full, the least recently used item is evicted and the new item is added.
	 * @param {K} key The key to put.
	 * @param {V} value The value to put.
	 * @returns {V} The value that was put.
	 */
	private putAndEvict(key: K, value: V): V {
		if (this.cache.has(key)) {
			this.cache.delete(key);
		} else if (this._capacity <= this.cache.size) {
			this.evict();
		}

		this.cache.set(key, value);

		return value;
	}
}