#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the commit message file path from command line arguments
const commitMsgFile = process.argv[2];

if (!commitMsgFile) {
  console.error('❌ No commit message file provided');
  process.exit(1);
}

// Read the commit message
const commitMsg = fs.readFileSync(commitMsgFile, 'utf8').trim();

// Define the conventional commit regex pattern
const conventionalCommitRegex = /^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\([a-z0-9-]+\))?: [a-z][^:]*$/;

// Check if the commit message matches the conventional format
if (!conventionalCommitRegex.test(commitMsg)) {
  console.error('❌ Invalid commit message format!');
  console.error('');
  console.error('Please follow the conventional commit format:');
  console.error('  <type>(<scope>): <description>');
  console.error('');
  console.error('Examples:');
  console.error('  feat(auth): add user authentication');
  console.error('  fix(ui): resolve button alignment issue');
  console.error('  docs(readme): update installation instructions');
  console.error('  chore: update dependencies');
  console.error('');
  console.error('Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert');
  console.error('Scope: optional, lowercase with hyphens (e.g., auth, ui, api)');
  console.error('Description: lowercase, no period at end');
  console.error('');
  console.error('Your commit message:');
  console.error(`  ${commitMsg}`);
  console.error('');
  process.exit(1);
}

console.log('✅ Commit message format is valid!');
process.exit(0); 