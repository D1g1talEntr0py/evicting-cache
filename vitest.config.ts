import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		server: {
			deps: {
				inline: [ '@d1g1tal/collections' ]
			}
		},
		environment: 'node',
		typecheck: { enabled: false },
		coverage: { reporter: [ 'lcov', 'text' ], reportsDirectory: 'tests/coverage', include: [ 'src' ], exclude: [ 'src/index.ts' ] },
		outputFile: 'coverage/sonar-report.xml'
	},
	resolve: {
		extensions: [ '.js', '.json', '.ts' ],
		alias: { '@/': new URL('./', import.meta.url).pathname }
	}
});