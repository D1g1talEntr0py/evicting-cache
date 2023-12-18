import ESBuildLibrary from 'esbuild-library';

await ESBuildLibrary.cleanAndBuild({ entryPoints: [ './src' ] });