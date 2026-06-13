import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function parseEnvValue(rawValue) {
  let value = rawValue.trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    const quote = value[0];
    value = value.slice(1, -1);

    if (quote === '"') {
      value = value
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
    }

    return value;
  }

  return value.replace(/\s+#.*$/, '').trim();
}

export function loadProductionEnv() {
  const envPath = resolve(process.cwd(), '.env.production');

  if (!existsSync(envPath)) {
    return {};
  }

  const parsed = {};
  const file = readFileSync(envPath, 'utf8');

  for (const rawLine of file.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);

    if (!match) {
      continue;
    }

    parsed[match[1]] = parseEnvValue(match[2]);
  }

  return parsed;
}

export function productionEnv(extra = {}) {
  return {
    ...process.env,
    ...loadProductionEnv(),
    ...extra,
  };
}
