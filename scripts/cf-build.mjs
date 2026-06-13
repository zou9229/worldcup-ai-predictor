import { spawnSync } from 'node:child_process';
import { productionEnv } from './cf-env.mjs';

const result = spawnSync('vite', ['build'], {
  cwd: process.cwd(),
  env: productionEnv({ NITRO_PRESET: 'cloudflare_module' }),
  shell: true,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
