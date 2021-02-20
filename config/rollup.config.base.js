import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import { eslint } from "rollup-plugin-eslint"
import version from '../plugins/plugin-version'

const pkg = require('../package.json')

console.info('pkg:', pkg.version)

const plugins = [
  eslint({
    exclude: 'node_modules/**',
    runtimeHelpers: true,
    fix: true
  }),

  commonjs(),

  resolve(),

  babel({
    exclude: 'node_modules/**',
    runtimeHelpers: true
  }),

  version({
    version: pkg.version
  })
]


export default {
  input: 'src/index.js',
  output: [],
  plugins: plugins
}
