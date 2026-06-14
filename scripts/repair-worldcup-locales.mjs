import { spawnSync } from 'node:child_process';

// Historical versions of this script embedded translated strings and could
// corrupt non-ASCII copy when run from a non-UTF-8 shell. Keep repair work
// explicit in messages/*.json and use the audit as the guardrail.
const result = spawnSync(process.execPath, ['scripts/audit-worldcup-locales.mjs'], {
  stdio: 'inherit',
});

if (result.status) {
  process.exit(result.status);
}

console.log('World Cup locale files are normalized. No automatic repair was needed.');
