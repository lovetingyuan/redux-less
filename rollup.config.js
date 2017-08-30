import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

module.exports = {
  entry: './src/index.js',
  output: {
    exports: 'named'
  },
  dest: './dist/reduxLess.js',
  format: 'umd',
  name: 'ReduxLess',
  sourceMap: true,
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ],
  // external: ['lodash-es', 'redux'],
};