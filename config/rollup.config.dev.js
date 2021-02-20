import baseConfig from './rollup.config.base'

baseConfig.output.push(
  {
    file: 'build/chat-client.js',
    format: 'iife',
    name: 'ChatClient',
    sourceMap: 'inline'
  }
)

export default  baseConfig

