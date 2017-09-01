import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import commonjs from 'rollup-plugin-commonjs';

const env = process.env.NODE_ENV

const config = {
  input: './src/index.js',
  output: {
    exports: 'named',
    file: './dist/ReduxLess.js',
    format: 'umd',
  },
  name: 'ReduxLess',
  sourcemap: true,
  plugins: [
    resolve({
      jsnext: true
    }),
    commonjs({
      namedExports: {
        // left-hand side can be an absolute path, a path
        // relative to the current directory, or the name
        // of a module in node_modules
        'node_modules/lodash/isPlainObject.js': [ 'named' ]
      }
    }),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ],
  // external: ['lodash-es', 'redux'],
};

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  )
  config.output.file = './dist/ReduxLess.min.js'
}

module.exports = config