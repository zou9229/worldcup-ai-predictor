import { spawnSync } from 'node:child_process';
import { productionEnv } from './cf-env.mjs';

function run(command, args, env) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    env,
    shell: true,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const env = productionEnv({ NITRO_PRESET: 'cloudflare_module' });

run('pnpm', ['cf:build'], env);
run('wrangler', ['deploy'], env);
