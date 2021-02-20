// import { uglify } from 'rollup-plugin-uglify'
import baseConfig from './rollup.config.base'

// baseConfig.plugins.push(uglify())

baseConfig.output.push(
  {
    file: 'build/chat-client.js',
    format: 'umd',
    name: 'ChatClient',
    sourceMap: 'inline'
  },

  {
    file: `build/chat-client.common.js`,
    format: 'cjs'
  },

  {
    file: `build/chat-client.amd.js`,
    format: 'amd'
  },

  {
    file: `build/chat-client.esm.js`,
    format: 'es'
  }
)

export default baseConfig
