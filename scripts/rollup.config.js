import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import pkg from '../package.json';

const dependencies = Object.keys(pkg.dependencies);

// 以下内容会添加到打包结果中
const footer = `
// _KOA_LOGGER_VERSION_: ${pkg.version}
if(typeof window !== 'undefined') {
  window._KOA_LOGGER_VERSION_ = '${pkg.version}'
}`;

const config = {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      footer
    },
    {
      file: pkg.module,
      format: 'esm',
      footer
    }
  ],
  // 如果使用 dependencies里的，则 @babel/runtime/helpers/get无效
  // Rollup will only exclude modules that match strings exactly.
  external: [...dependencies, /@babel\/runtime/],
  plugins: [
    commonjs(),
    nodeResolve(),
    babel({
      exclude: 'node_modules/**',
      // 使用自定义配置，默认取的是根目录的配置
      babelrc: false,
      // babelHelpers: 'bundled',
      // 使用runtime进行打包，让代码更完整，第三方不用强制使用babel
      babelHelpers: 'runtime',
      plugins: ['@babel/plugin-transform-runtime'],
      presets: [
        [
          '@babel/preset-env',
          {
            // targets: {
            //   node: 'current'
            // },
            loose: true
          }
        ]
      ]
    })
  ]
};

export default config;
