import { execFileSync, spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export function isReleaseCommit(message) {
	const header = /^([^\s:()!]+)(?:\([^\r\n()]+\))?(!)?: .+/.exec(message);
	return header !== null && (header[2] === '!' || /^(feat|fix|perf|revert)$/.test(header[1]) || /^BREAKING(?: |-)CHANGE:/m.test(message));
}

export function parseBumpResult(result, latestTag) {
	if (result.error) {
		throw result.error;
	}
	if (result.stderr.includes('There is nothing to bump')) {
		return '';
	}
	if (result.status !== 0) {
		throw new Error(`git-cliff exited with status ${result.status}: ${result.stderr}`);
	}
	const version = result.stdout.trim().replace(/^v/, '');
	if (!version || version === latestTag.replace(/^v/, '')) {
		return '';
	}
	if (!/^\d+\.\d+\.\d+$/.test(version)) {
		throw new Error(`Unexpected git-cliff version: ${version}`);
	}
	return version;
}

export function getReleaseVersion() {
	const tags = execFileSync('git', ['tag', '--merged', 'HEAD', '--list', 'v*', '--sort=-version:refname'], { encoding: 'utf8' });
	const latestTag = tags.split('\n').find(tag => /^v\d+\.\d+\.\d+$/.test(tag)) ?? '';
	const commits = execFileSync('git', ['log', ...(latestTag ? [`${latestTag}..HEAD`] : ['HEAD']), '--format=%B%x00'], { encoding: 'utf8' });
	if (!commits.split('\0').some(message => isReleaseCommit(message.trim()))) {
		console.error('No release-worthy commits since the latest release tag.');
		return '';
	}
	if (!process.env.GITHUB_REPOSITORY) {
		throw new Error('GITHUB_REPOSITORY is required to generate repository-aware links.');
	}
	const result = spawnSync('git-cliff', ['--github-repo', process.env.GITHUB_REPOSITORY, '--bumped-version'], { encoding: 'utf8' });
	process.stderr.write(result.stderr ?? '');
	return parseBumpResult(result, latestTag);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	const version = getReleaseVersion();
	if (version) {
		console.log(version);
	}
}