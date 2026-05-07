import { spawn } from 'node:child_process';

const port = process.env.PORT || '3002';
const nextBin = new URL('../node_modules/next/dist/bin/next', import.meta.url);

const child = spawn(
  process.execPath,
  [nextBin.pathname, 'start', '-p', port],
  {
    stdio: 'inherit',
    env: process.env,
  }
);

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
