## [3.0.2](https://github.com/D1g1talEntr0py/evicting-cache/compare/v3.0.1...v3.0.2) (2026-03-16)

### Bug Fixes

* **ci:** Fix publishing to include a valid release (997fa6a8f56d9b3fe91f8cc2206b1169607ddb25)
* **ci:** fixed autoInstallPeers mismatch (c8778b682546bd9767a3664a858435776b59f1b3)
* **ci:** more fun with peer install conflicts (53fa74b13e0688059722ad8634c1bf8bfa596de5)
* **ci:** more GitHub actions nonsense (e211d1ad81397f4b720dc534e4f8cbe9f02ce44f)

### Documentation

* fixed badges on README.md, again (b4996da990f80df4230abfe4fc929954931ba989)

### Miscellaneous Chores

* **deps:** updated dev dependencies and fixed package.json (6ee9c740653667b6f7f2ba5d26cab7280ae61b40)

## [3.0.1](https://github.com/D1g1talEntr0py/evicting-cache/compare/v3.0.0...v3.0.1) (2026-03-01)

### Bug Fixes

* fixed invalid flag for type-check script (808b4d21b02c22a46aeaa4b39ff1103dc70f7bc9)

### Continuous Integration

* added repository to package.json (1dc7b1b2e15432e1020752d740c99d31009336f1)

## [3.0.0](https://github.com/D1g1talEntr0py/evicting-cache/compare/v2.2.1...v3.0.0) (2026-03-01)

### ⚠ BREAKING CHANGES

* None - all changes are backward compatible

### Features

* add batch operations, statistics tracking, and performance optimizations (3dd757608e71e1d4d736cc7d2306ad5bec3392d2)
Added new API methods:
- delete(key) - explicit item removal matching Map API
- forEach(callback, thisArg) - iteration with proper this binding
- putAll/getAll/deleteAll - batch operations for multiple keys
- getStats/resetStats - cache hit/miss statistics tracking

Performance improvements:
- Optimized evict() by removing unsafe type assertion
- Optimized putAndEvict() by eliminating redundant has() check

Other improvements:
- Enhanced getOrPut() error handling documentation
- Improved type safety using 'unknown' instead of 'any'
- Added comprehensive test suite maintaining 100% coverage


### Documentation

* update badges on README.md (dfdde3bf8dd52f70035c376055fbcdfadd972f90)
* update README with comprehensive documentation (8476509c194e674cca5c033fa701a996e067c3dd)
- Add badges for npm version, downloads, license, TypeScript, and coverage
- Add detailed API reference and usage examples for all methods
- Add performance table showing O(1) operations
- Standardize code examples to 2-space indentation
- Fix import statement to use named export { EvictingCache }


### Miscellaneous Chores

* **deps:** Updates pnpm lockfile to reflect dependency upgrades (eb9bb5e7d07fecc581977be618cf3d2b0efe2810)
Refreshes the lockfile to match bumped devDependencies and toolchain updates so installs are reproducible and CI uses the exact updated dependency tree.

* **githooks:** Adds commit-msg hook (deb5d8a158283312172a043ee2ceb2b11fea13b6)
Adds an executable hook that enforces Conventional Commits for all commit messages to keep commit history structured and machine-readable for release tooling and CI validation.

* **package:** Updates package exports and devDependencies (ad8e4685fc938aae48baaa2fb254dfc2510a688d)
Updates the package exports to point to built artifacts and bumps a set of development tooling versions to align with newer runtime and linting ecosystems; removes an inline tsbuild entry to rely on external build tooling.


### Continuous Integration

* add packageManager to package.json file (49d43111e3a56f5a2fe34ac915089228b2ba7c90)
* Adds CI workflow (235caead19ce418229750e13b00ca768598916d5)
Adds a GitHub Actions CI pipeline that runs installs, linting, type checks, tests with coverage, and builds across a Node matrix to ensure quality and compatibility across supported Node versions.

* **release:** Adds release workflow & semantic-release config (0b8da372b6366b947d001a57e4415541e04105b7)
Automates releases on main by wiring a release workflow and configuring semantic-release so versioning and changelogs are generated from Conventional Commits and publishes artifacts accordingly.

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.1] - 2025-10-28

### Changed
- Updated README with comprehensive documentation of all features
- Added badges for npm version, downloads, license, TypeScript version, and test coverage
- Improved code examples in README for clarity
- Added detailed usage examples for all API methods
- Added performance characteristics table
- Added complete API reference section
- Enhanced TypeScript usage examples

### Fixed
- Fixed import statement in README to use named export `{ EvictingCache }` instead of default import

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

## [2.2.1] - Previous Release
