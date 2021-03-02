function doLogout(options, evt) {
  const { logout } = options

  if (logout && typeof logout === 'function') {
    logout()
  }
  evt.stopPropagation()
  window.location.reload()
}

export const addEvents = function(options) {
  const btnExit = document.querySelector('#exit-meeting')

  btnExit.addEventListener('click', function(evt) {
    doLogout(options, evt)
  })

  window.addEventListener('unload', function(evt) {
    doLogout(options, evt)
  })
}
