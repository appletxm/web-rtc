
/* globals alert */

export const log = function (text) {
  var time = new Date()
  console.log('[' + time.toLocaleTimeString() + '] ' + text)
}

export const logError = function (text) {
  var time = new Date()
  console.trace('[' + time.toLocaleTimeString() + '] ' + text)
}

export const reportError = function (errMessage) {
  logError(`Error ${errMessage.name}: ${errMessage.message}`)
}

export const handleGetUserMediaError = function (e, cb) {
  logError(e)

  switch (e.name) {
    case 'NotFoundError':
      alert('Unable to open your call because no camera and/or microphone' + 'were found.')
      break
    case 'SecurityError':
    case 'PermissionDeniedError':
      // Do nothing; this is the same as the user canceling the call.
      break
    default:
      alert('Error opening your camera and/or microphone: ' + e.message)
      break
  }
  // closeVideoCall()
  if (cb && typeof cb === 'function') {
    cb()
  }
}
