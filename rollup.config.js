import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';

module.exports = {
  input: './src/index.js',
  output: {
    exports: 'named',
    file: './dist/ReduxLess.js',
    format: 'umd',
  },
  name: 'ReduxLess',
  sourcemap: false,
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  // external: ['lodash-es', 'redux'],
};
