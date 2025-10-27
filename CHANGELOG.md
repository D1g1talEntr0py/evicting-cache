# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.0] - 2025-10-27

### Added
- `delete(key)` method to explicitly remove items from the cache, matching standard Map API
- `forEach(callback, thisArg?)` method to iterate over cache entries with proper `this` binding support
- Batch operations for improved performance:
  - `putAll(entries)` - Add multiple key-value pairs at once
  - `getAll(keys)` - Retrieve multiple values (returns Map, excludes missing keys)
  - `deleteAll(keys)` - Remove multiple keys (returns count of removed items)
- Cache statistics tracking:
  - `getStats()` - Returns hit/miss counts and calculated hit rate
  - `resetStats()` - Resets statistics counters to zero
- Statistics are automatically tracked on `get()` operations (hits and misses)
- Comprehensive test suite for all new features maintaining 100% code coverage

### Changed
- Improved `getOrPut()` error handling with explicit documentation that cache state remains unchanged when producer function throws
- Enhanced `getOrPut()` implementation to be more explicit about error handling behavior

### Fixed
- Performance optimization in `evict()` method - removed unsafe type assertion and simplified iterator usage
- Performance optimization in `putAndEvict()` method - removed redundant `has()` check, now leverages `delete()` return value

### Security
- Replaced `any` type with `unknown` type in `forEach()` `thisArg` parameter for improved type safety

## [2.3.0] - Previous Release
