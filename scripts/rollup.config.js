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
  external: [...dependencies],
  plugins: [
    commonjs(),
    nodeResolve(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      // 使用自定义配置，默认取的是根目录的配置
      babelrc: false,
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
