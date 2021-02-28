const Chat = class {
  constructor(options) {
    this.user = options.user
    this.socket = options.socket
    this.addEvents()
  }

  addEvents() {
    const chatPanel = document.querySelector('.chat-box')
    const btnDom = document.querySelector('#chat-send')
    chatPanel.addEventListener('keyup', (event) => {
      if (event.keyCode === 13 || event.which === 13) {
        this.sendMessage()
      }
      event.stopPropagation()
    })

    btnDom.addEventListener('click', (event) => {
      this.sendMessage()
      event.stopPropagation()
    })
  }

  sendMessage() {
    const inputDom = document.querySelector('#chat-text')
    let value = inputDom.value

    value = value && value.trim()

    if (!value) {
      return false
    }

    const msg = {
      text: value,
      type: 'message',
      id: this.user.clientId,
      date: Date.now()
    }
    this.socket.sendToServer(msg)
    inputDom.value = ''
  }

  showMessage(text) {
    const chatBox = document.querySelector('.chat-content')
    if (text.length) {
      chatBox.innerHTML += text
      chatBox.scrollTop = chatBox.scrollHeight - chatBox.clientHeight
    }
  }
}

export default Chat
