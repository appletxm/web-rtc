export const addEvents = function(options) {
  const userInput = document.querySelector('#name')
  const btnLogin = document.querySelector('#btn-login')
  const { login } = options

  userInput.addEventListener('keyup', function(evt) {
    if (evt.keyCode === 13 || evt.keyCode === 14) {
      login({
        userName: userInput.value,
        evt
      })
    }
  })

  btnLogin.addEventListener('click', function(evt) {
    login({
      userName: userInput.value,
      evt
    })
  })
}

export const getUserName = function() {
  return document.querySelector('#name').value
}
