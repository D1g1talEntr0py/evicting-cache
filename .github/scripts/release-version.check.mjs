import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { copyFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { isReleaseCommit, parseBumpResult } from './release-version.mjs';

test('release eligibility is independent of changelog inclusion', () => {
	for (const type of ['feat', 'fix', 'perf', 'revert']) {
		for (const scope of ['', '(cache)']) {
			assert.equal(isReleaseCommit(`${type}${scope}: update behavior`), true);
		}
	}
	for (const type of ['docs', 'style', 'chore', 'refactor', 'test', 'build', 'ci', 'custom', 'custom_type', 'DEPS']) {
		for (const scope of ['', '(cache)']) {
			assert.equal(isReleaseCommit(`${type}${scope}: update behavior`), false);
			assert.equal(isReleaseCommit(`${type}${scope}!: update behavior`), true);
			for (const footer of ['BREAKING CHANGE:', 'BREAKING-CHANGE:']) {
				assert.equal(isReleaseCommit(`${type}${scope}: update behavior\n\n${footer} incompatible API`), true);
			}
		}
	}
	for (const message of ['Merge pull request #1', 'fixup: not a fix', 'feature: not a feat', 'docs: mention feat: in prose', 'legacy message\n\nBREAKING CHANGE: not conventional', 'docs: prose\n\nThis mentions BREAKING CHANGE: inline']) {
		assert.equal(isReleaseCommit(message), false);
	}
});

test('bump output handles no-op cases without masking genuine failures', () => {
	const result = { status: 0, stdout: 'v3.1.0\n', stderr: '' };
	assert.equal(parseBumpResult(result, 'v3.0.6'), '3.1.0');
	assert.equal(parseBumpResult({ ...result, stdout: '' }, 'v3.0.6'), '');
	assert.equal(parseBumpResult(result, 'v3.1.0'), '');
	assert.equal(parseBumpResult({ ...result, status: 1, stderr: 'There is nothing to bump' }, 'v3.0.6'), '');
	assert.throws(() => parseBumpResult({ ...result, status: 1, stderr: 'Invalid configuration' }, 'v3.0.6'), /Invalid configuration/);
	assert.throws(() => parseBumpResult({ ...result, stdout: 'invalid' }, 'v3.0.6'), /Unexpected git-cliff version/);
	assert.throws(() => parseBumpResult({ ...result, error: new Error('spawn failed') }, 'v3.0.6'), /spawn failed/);
});

const hasGitCliff = spawnSync('git-cliff', ['--version']).status === 0;

function fixture(context) {
	const directory = mkdtempSync(join(tmpdir(), 'evicting-cache-release-'));
	context.after(() => rmSync(directory, { recursive: true, force: true }));
	const env = { ...process.env, GITHUB_REPOSITORY: 'fixture/cache', GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1' };
	const run = (command, args) => execFileSync(command, args, { cwd: directory, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
	const git = (...args) => run('git', args);
	git('init', '--initial-branch=main');
	git('config', 'user.name', 'Release Fixture');
	git('config', 'user.email', 'fixture@example.com');
	git('config', 'commit.gpgsign', 'false');
	git('config', 'tag.gpgsign', 'false');
	copyFileSync(new URL('../../cliff.toml', import.meta.url), join(directory, 'cliff.toml'));
	const commit = message => {
		git('commit', '--allow-empty', '-m', message);
		return git('rev-parse', 'HEAD');
	};
	const initialCommit = commit('chore: initial history');
	git('tag', 'v1.2.3');
	const version = () => run(process.execPath, [fileURLToPath(new URL('./release-version.mjs', import.meta.url))]);
	const cliff = (...args) => run('git-cliff', ['--github-repo', 'fixture/cache', ...args]);
	return { commit, git, version, cliff, initialCommit };
}

test('real git-cliff honors release bumps and no-release types', { skip: !hasGitCliff }, context => {
	for (const [message, expected] of [
		['feat: new API', '1.3.0'],
		['feat(cache): new API', '1.3.0'],
		['fix: repair API', '1.2.4'],
		['fix(cache): repair API', '1.2.4'],
		['perf: faster API', '1.2.4'],
		['perf(cache): faster API', '1.2.4'],
		['revert: undo API', '1.2.4'],
		['revert(cache): undo API', '1.2.4'],
		['docs!: incompatible change', '2.0.0'],
		['refactor(cache)!: incompatible change', '2.0.0'],
		['custom_type!: incompatible change', '2.0.0'],
		['DEPS(cache)!: incompatible change', '2.0.0'],
		['chore: change\n\nBREAKING CHANGE: incompatible API', '2.0.0'],
		['ci(cache): change\n\nBREAKING-CHANGE: incompatible API', '2.0.0'],
		['refactor: internal only', ''],
		['Merge pull request #123', ''],
		['legacy change\n\nBREAKING CHANGE: not conventional', ''],
	]) {
		const repository = fixture(context);
		assert.equal(repository.version(), '', 'No commits since tag must not release');
		repository.commit('docs: deferred documentation');
		assert.equal(repository.version(), '', 'Documentation alone must not release');
		repository.commit(message);
		assert.equal(repository.version(), expected, message);
	}
});

test('full changelog includes every commit while release notes include only unreleased history', { skip: !hasGitCliff }, context => {
	const repository = fixture(context);
	const messages = [
		'feat(cache): new API', 'fix: repair API', 'perf: faster API', 'revert: undo API',
		'docs: deferred documentation', 'style: formatting', 'chore: maintenance',
		'refactor: internal changes', 'test: coverage', 'build: tooling', 'ci: workflow',
		'custom: additional category', 'Merge pull request #123', 'legacy message',
		'docs(cache)!: incompatible docs', 'chore: incompatible\n\nBREAKING-CHANGE: new contract',
	];
	const commits = messages.map(repository.commit);
	assert.equal(repository.version(), '2.0.0');
	const changelog = repository.cliff('--tag', 'v2.0.0');
	const notes = repository.cliff('--tag', 'v2.0.0', '--unreleased', '--strip', 'header');
	for (const commit of commits) {
		const link = `https://github.com/fixture/cache/commit/${commit}`;
		assert.equal(changelog.split(link).length - 1, 1, `Full changelog includes ${commit} exactly once`);
		assert.equal(notes.split(link).length - 1, 1, `Release notes include ${commit} exactly once`);
	}
	assert.ok(changelog.includes(repository.initialCommit));
	assert.ok(!notes.includes(repository.initialCommit));
	assert.ok(!notes.startsWith('# Changelog'));
	assert.ok(changelog.includes('**cache:** new API'));
	assert.ok(changelog.includes('compare/v1.2.3...v2.0.0'));
	for (const group of ['Breaking Changes', 'Features', 'Bug Fixes', 'Performance Improvements', 'Reverts', 'Documentation', 'Styles', 'Chores', 'Code Refactoring', 'Tests', 'Build System', 'Continuous Integration', 'Other Changes']) {
		assert.equal(notes.split(`### ${group}\n`).length - 1, 1, group);
	}
});