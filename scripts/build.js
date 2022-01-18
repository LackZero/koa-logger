const { execSync } = require('child_process');
const path = require('path');

// 更改当前工作目录为根目录，虽没有什么大用
process.chdir(path.resolve(__dirname, '..'));

const exec = (command, extraEnv) => execSync(command, {
  stdio: 'inherit',
  env: { ...process.env, ...extraEnv }
});

console.log('\nBuilding modules...');

exec('rollup -c scripts/rollup.config.js');
