import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		typecheck: { enabled: false },
		coverage: { reporter: [ 'lcov', 'text' ], reportsDirectory: 'tests/coverage', include: [ 'src' ], exclude: [ 'src/index.ts' ] },
		outputFile: 'coverage/sonar-report.xml'
	},
	resolve: {
		alias: [ { find: '@/', replacement: fileURLToPath(new URL('./', import.meta.url)) } ]
	}
});