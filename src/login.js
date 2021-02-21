export const addEvents = function(options) {
  const userInput = document.querySelector('#name')
  const btnLogin = document.querySelector('#btn-login')

  const {enterEvent, loginEvent} = options

  userInput.addEventListener('keyup', function(evt) {
    if (evt.keyCode === 13 || evt.keyCode === 14) {
      enterEvent({
        userName: userInput.value,
        evt
      })
    }
  })

  btnLogin.addEventListener('click', function(evt) {
    loginEvent({
      userName: userInput.value,
      evt
    })
  })
}

export const getUserName = function() {
  return document.querySelector('#name').value
}
