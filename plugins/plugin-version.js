const path = require('path')

export default function hotReload (options = {}) {
  return {
    name: 'hot-reload',
    transform (code, id) {
      if (id.indexOf(path.resolve('./src/index.js')) >= 0) {
        code = code.replace('{{version}}', (options.version || '0.0.1'))
        // console.info('************', code)
      }
      return code
    }
  }
}
