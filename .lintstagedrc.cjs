// Ref: https://nextjs.org/docs/pages/building-your-application/configuring/eslint#lint-staged
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');
const buildEslintCommand = (filenames) =>
  `next lint --fix --max-warnings 0 --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;

module.exports = {
  '*.{cjs,js,mjs,ts,tsx}': 'tsc --noEmit',
  '*.{cjs,js,mjs,ts,tsx}': [buildEslintCommand],
  '*.{cjs,json,md,mjs,ts,tsx}': 'prettier -w',
};
