import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';

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
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  // external: ['lodash-es', 'redux'],
};
