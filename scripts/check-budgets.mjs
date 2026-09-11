import { readdir, readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const files = await readdir('dist/assets');
const metrics = await Promise.all(
  files.map(async (name) => {
    const body = await readFile(`dist/assets/${name}`);
    return { name, bytes: body.byteLength, gzip: gzipSync(body).byteLength };
  }),
);
const sum = (filter) => metrics.filter(filter).reduce((total, file) => total + file.gzip, 0);
const fontFiles = (await readdir('dist/fonts')).filter((name) => name.endsWith('.woff2'));
const fontBytes = (await Promise.all(fontFiles.map((name) => stat(`dist/fonts/${name}`)))).reduce(
  (total, file) => total + file.size,
  0,
);
const checks = [
  ['All JavaScript / gzip', sum((file) => file.name.endsWith('.js')), 460 * 1024],
  ['Lazy Three engine / gzip', sum((file) => file.name.startsWith('three-')), 250 * 1024],
  ['Main entry + content / gzip', sum((file) => /^index-.*\.js$/.test(file.name)), 100 * 1024],
  ['Styles / gzip', sum((file) => file.name.endsWith('.css')), 20 * 1024],
  ['Self-hosted fonts / raw', fontBytes, 100 * 1024],
];
let failed = false;
for (const [name, actual, limit] of checks) {
  const pass = actual <= limit;
  console.log(
    `${pass ? 'PASS' : 'FAIL'} ${name}: ${(actual / 1024).toFixed(1)} / ${limit / 1024} KiB`,
  );
  failed ||= !pass;
}
if (failed) process.exitCode = 1;
