# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.7](https://github.com/D1g1talEntr0py/evicting-cache/compare/v3.0.6...v3.0.7) - 2026-10-17


### Bug Fixes

* **cache:** preserve null and undefined values ([609c42d](https://github.com/D1g1talEntr0py/evicting-cache/commit/609c42dd57abf274322dc9910cb4f607dd34c7df))


### Build System

* **toolchain:** upgrade TypeScript and development tooling ([4831def](https://github.com/D1g1talEntr0py/evicting-cache/commit/4831defc2be9931732420912bd5040790e5e496a))


### Continuous Integration

* **release:** automate git-cliff releases ([c4f7754](https://github.com/D1g1talEntr0py/evicting-cache/commit/c4f7754e4628f1da174b27f1dc8da955f0cc9053))



## [3.0.6](https://github.com/D1g1talEntr0py/evicting-cache/compare/v3.0.5...v3.0.6) - 2026-04-07


### Bug Fixes

* **deps:** updates vitest and dependencies to resolve CVE-2026-39363 ([b7cd41c](https://github.com/D1g1talEntr0py/evicting-cache/commit/b7cd41c89cf3fd2b4f51b60a6b1cc0f92785dafb))

* **ci:** remove setting from ci and publish GitHub actions having to do with peer dependencies ([60094d5](https://github.com/D1g1talEntr0py/evicting-cache/commit/60094d539d10288ca1a0d2520b730a6a82c78516))


### Chores

* **release:** 3.0.6 [skip ci] ([2327a13](https://github.com/D1g1talEntr0py/evicting-cache/commit/2327a13c23ab7c2d3c8a20a6803f78ea48f504c0))


### Code Refactoring

* enables isolatedDeclarations and adds explicit return types ([1d5d945](https://github.com/D1g1talEntr0py/evicting-cache/commit/1d5d945ee36d40ae1e7556de6d30cd36c9ac58a6))


### Build System

* configures allowed builds in pnpm workspace ([3c8fcd3](https://github.com/D1g1talEntr0py/evicting-cache/commit/3c8fcd3dbc375156223643b11b5b32c0c0d21114))


### Continuous Integration

* updates github actions and semantic release rules ([9f84557](https://github.com/D1g1talEntr0py/evicting-cache/commit/9f8455732a1ade0c5f86d46b6a085fb7230d1da3))



## [3.0.5](https://github.com/D1g1talEntr0py/evicting-cache/compare/v3.0.4...v3.0.5) - 2026-03-27


### Bug Fixes

* **deps:** update to TypeScript 6 and resolve security vulnerabilities ([4b995c0](https://github.com/D1g1talEntr0py/evicting-cache/commit/4b995c0ad8c74a0ff7096f886afc668479270743))

* **ci:** pnpm and their lockfile can go kick rocks ([e9b5972](https://github.com/D1g1talEntr0py/evicting-cache/commit/e9b59724aab96bba173129279673c73e207381a7))


### Styles

* **evicting-cache:** remove redundant type annotations from code and JSDoc ([e462d45](https://github.com/D1g1talEntr0py/evicting-cache/commit/e462d45da67ffd4c3473f7655293af638ad8919e))


### Chores

* **release:** 3.0.5 [skip ci] ([332e1d4](https://github.com/D1g1talEntr0py/evicting-cache/commit/332e1d4d0730442c8a4bbb38b9072843d581c96e))


### Build System

* **typescript:** simplify tsconfig compiler options ([b44b1f6](https://github.com/D1g1talEntr0py/evicting-cache/commit/b44b1f65c137c80f19503829420e6598f7f2033e))



## [3.0.4](https://github.com/D1g1talEntr0py/evicting-cache/compare/v3.0.3...v3.0.4) - 2026-03-16


### Bug Fixes

* **release:** updated invalid node version ([7d22732](https://github.com/D1g1talEntr0py/evicting-cache/commit/7d2273211f13e5369698bfe2cb8d4455c5798c98))


### Chores

* fix license ([62279e5](https://github.com/D1g1talEntr0py/evicting-cache/commit/62279e557ef3289fcdaf693abc9bcb6d9c9499c0))

* **publish:** remove /src folder from package ([0d5fd53](https://github.com/D1g1talEntr0py/evicting-cache/commit/0d5fd5302b50ac7013cd7fee88d311a5dac2e389))

* **release:** 3.0.4 [skip ci] ([53bdf9b](https://github.com/D1g1talEntr0py/evicting-cache/commit/53bdf9b836ef508c1842aace36dbfa8f63e33947))



## [3.0.3](https://github.com/D1g1talEntr0py/evicting-cache/compare/v3.0.2...v3.0.3) - 2026-03-16


### Bug Fixes

* **release:** I just want this to work... ([6a8b410](https://github.com/D1g1talEntr0py/evicting-cache/commit/6a8b4103f7720c00c502ca9cf50c4f262d35afb0))

* **release:** kill me now ([f8d2196](https://github.com/D1g1talEntr0py/evicting-cache/commit/f8d2196a740389ea0acec8b9deedf408a2784c42))


### Chores

* **release:** 3.0.3 [skip ci] ([9713942](https://github.com/D1g1talEntr0py/evicting-cache/commit/9713942ad1680066a098e70ac9f4a30d12d61b41))



## [3.0.2](https://github.com/D1g1talEntr0py/evicting-cache/compare/v3.0.1...v3.0.2) - 2026-03-16


### Bug Fixes

* **ci:** Fix publishing to include a valid release ([997fa6a](https://github.com/D1g1talEntr0py/evicting-cache/commit/997fa6a8f56d9b3fe91f8cc2206b1169607ddb25))

* **ci:** fixed autoInstallPeers mismatch ([c8778b6](https://github.com/D1g1talEntr0py/evicting-cache/commit/c8778b682546bd9767a3664a858435776b59f1b3))

* **ci:** more GitHub actions nonsense ([e211d1a](https://github.com/D1g1talEntr0py/evicting-cache/commit/e211d1ad81397f4b720dc534e4f8cbe9f02ce44f))

* **ci:** more fun with peer install conflicts ([53fa74b](https://github.com/D1g1talEntr0py/evicting-cache/commit/53fa74b13e0688059722ad8634c1bf8bfa596de5))


### Documentation

* fixed badges on README.md, again ([b4996da](https://github.com/D1g1talEntr0py/evicting-cache/commit/b4996da990f80df4230abfe4fc929954931ba989))


### Chores

* **deps:** updated dev dependencies and fixed package.json ([6ee9c74](https://github.com/D1g1talEntr0py/evicting-cache/commit/6ee9c740653667b6f7f2ba5d26cab7280ae61b40))

* **release:** 3.0.2 [skip ci] ([94d5af3](https://github.com/D1g1talEntr0py/evicting-cache/commit/94d5af313e870429b109214f71d5fc90366ce13c))



## [3.0.1](https://github.com/D1g1talEntr0py/evicting-cache/compare/v3.0.0...v3.0.1) - 2026-03-01


### Bug Fixes

* fixed invalid flag for type-check script ([808b4d2](https://github.com/D1g1talEntr0py/evicting-cache/commit/808b4d21b02c22a46aeaa4b39ff1103dc70f7bc9))


### Chores

* **release:** 3.0.1 [skip ci] ([d426f6e](https://github.com/D1g1talEntr0py/evicting-cache/commit/d426f6e698e9410ca4cacfc79683a52a403ec26e))


### Continuous Integration

* added repository to package.json ([1dc7b1b](https://github.com/D1g1talEntr0py/evicting-cache/commit/1dc7b1b2e15432e1020752d740c99d31009336f1))



## [3.0.0](https://github.com/D1g1talEntr0py/evicting-cache/compare/v2.2.1...v3.0.0) - 2026-03-01


### Features

* add batch operations, statistics tracking, and performance optimizations ([3dd7576](https://github.com/D1g1talEntr0py/evicting-cache/commit/3dd757608e71e1d4d736cc7d2306ad5bec3392d2))


### Documentation

* update README with comprehensive documentation ([8476509](https://github.com/D1g1talEntr0py/evicting-cache/commit/8476509c194e674cca5c033fa701a996e067c3dd))

* update badges on README.md ([dfdde3b](https://github.com/D1g1talEntr0py/evicting-cache/commit/dfdde3bf8dd52f70035c376055fbcdfadd972f90))


### Chores

* **githooks:** Adds commit-msg hook ([deb5d8a](https://github.com/D1g1talEntr0py/evicting-cache/commit/deb5d8a158283312172a043ee2ceb2b11fea13b6))

* **package:** Updates package exports and devDependencies ([ad8e468](https://github.com/D1g1talEntr0py/evicting-cache/commit/ad8e4685fc938aae48baaa2fb254dfc2510a688d))

* **deps:** Updates pnpm lockfile to reflect dependency upgrades ([eb9bb5e](https://github.com/D1g1talEntr0py/evicting-cache/commit/eb9bb5e7d07fecc581977be618cf3d2b0efe2810))

* **release:** 3.0.0 [skip ci] ([939495a](https://github.com/D1g1talEntr0py/evicting-cache/commit/939495a65a92bad19276cd9aa930f4b1beff74c7))


### Continuous Integration

* Adds CI workflow ([235caea](https://github.com/D1g1talEntr0py/evicting-cache/commit/235caead19ce418229750e13b00ca768598916d5))

* **release:** Adds release workflow & semantic-release config ([0b8da37](https://github.com/D1g1talEntr0py/evicting-cache/commit/0b8da372b6366b947d001a57e4415541e04105b7))

* add packageManager to package.json file ([49d4311](https://github.com/D1g1talEntr0py/evicting-cache/commit/49d43111e3a56f5a2fe34ac915089228b2ba7c90))


### Other Changes

* 2.3.0 ([9dc520d](https://github.com/D1g1talEntr0py/evicting-cache/commit/9dc520d6abeeeef10076576ba4a926e0b7079365))

* 2.3.1 ([372f014](https://github.com/D1g1talEntr0py/evicting-cache/commit/372f014ff904de7f768cec08d042d54b7498f08a))



## [2.2.1](https://github.com/D1g1talEntr0py/evicting-cache/compare/v2.2.0...v2.2.1) - 2025-10-10


### Other Changes

* Maintenance release. Dev dependency updates ([d10acad](https://github.com/D1g1talEntr0py/evicting-cache/commit/d10acada031e8d80a8b7030e299f64183d148e8d))



## [2.2.0](https://github.com/D1g1talEntr0py/evicting-cache/compare/v2.1.0...v2.2.0) - 2025-07-31


### Other Changes

* New iterable methods and tests.
- Added methods for iterating over cache entries.
- Added new tests for thee iterable methods.
- Updated development dependencies. ([a18d4c9](https://github.com/D1g1talEntr0py/evicting-cache/commit/a18d4c999dac22cf611a02dfeefff2535959022d))



## [2.1.0](https://github.com/D1g1talEntr0py/evicting-cache/compare/v2.0.4...v2.1.0) - 2025-07-27


### Other Changes

* Removed dependency on the collections package and added new tests ([e18cff9](https://github.com/D1g1talEntr0py/evicting-cache/commit/e18cff946cdf06e130057e477dcd5df311ba3645))



## [2.0.4](https://github.com/D1g1talEntr0py/evicting-cache/compare/v2.0.3...v2.0.4) - 2025-07-21


### Other Changes

* Fixed missing eslint package ([0528715](https://github.com/D1g1talEntr0py/evicting-cache/commit/05287150fe628b4a7a6db9aaf9ca0c22bad3021a))



## [2.0.3](https://github.com/D1g1talEntr0py/evicting-cache/compare/v2.0.2...v2.0.3) - 2025-07-21


### Other Changes

* Added peek method and fixed testing setup ([c8a718f](https://github.com/D1g1talEntr0py/evicting-cache/commit/c8a718fe90d7f733c20aa392c9e8906747947a71))



## [2.0.2](https://github.com/D1g1talEntr0py/evicting-cache/compare/v2.0.0...v2.0.2) - 2025-07-20


### Other Changes

* Maintenance update: updated dependencies and tsconfig.json ([d7e910c](https://github.com/D1g1talEntr0py/evicting-cache/commit/d7e910c1396fe021d9488ce211f294e58fd6f620))

* Dependency Updates ([b336c64](https://github.com/D1g1talEntr0py/evicting-cache/commit/b336c64e4d305fd719c651f71dca5d2568b951da))



## [2.0.0](https://github.com/D1g1talEntr0py/evicting-cache/compare/v1.0.1...v2.0.0) - 2024-09-08


### Other Changes

* Maitenance release ([bd1b12f](https://github.com/D1g1talEntr0py/evicting-cache/commit/bd1b12f745f7528baaf1171068a03e49491456d7))

* Project is now using TypeScript and Vitest
- Converted source to TypeScript.
- Migrated from Jest to Vitest for unit testing.
- Updated esbuild to use the new flat config format. ([84fab4b](https://github.com/D1g1talEntr0py/evicting-cache/commit/84fab4bc3d98775efdab20971c3cdf7877742cef))



## [1.0.1](https://github.com/D1g1talEntr0py/evicting-cache/compare/v1.0.0...v1.0.1) - 2023-12-18


### Other Changes

* Updated README ([6b02c8b](https://github.com/D1g1talEntr0py/evicting-cache/commit/6b02c8b512ff5b28f3904dfca0283d5c165dd0f1))



## [1.0.0](https://github.com/D1g1talEntr0py/evicting-cache/releases/tag/v1.0.0) - 2023-12-18


### Other Changes

* Initial commit ([bf5106e](https://github.com/D1g1talEntr0py/evicting-cache/commit/bf5106e7e001def44911a5f3b502ec05cf0e1144))

* Initial commit with working code ([dcc9aac](https://github.com/D1g1talEntr0py/evicting-cache/commit/dcc9aace437b3e93bb261033a421c9dbab2b62e6))


