/* globals WebSocket */

import { log, logError } from './log'

const Socket = class {
  constructor(options) {
    this.ws = null
    this.myHostname = 'localhost'
    this.options = options
    this.user = options.user

    this.getHostName()
  }

  getHostName() {
    var myHostname = window.location.hostname

    if (myHostname) {
      this.myHostname = myHostname
    }

    log('Hostname: ' + this.myHostname)
  }

  connect() {
    var serverUrl
    var scheme = 'ws'

    if (document.location.protocol === 'https:') {
      scheme += 's'
    }
    serverUrl = scheme + '://' + this.myHostname + ':6503'

    log(`Connecting to server: ${serverUrl}`)
    this.ws = new WebSocket(serverUrl, 'json')

    this.ws.onopen = (evt) => {
      console.info('onopen evt:', evt)
      document.querySelector('.login').style.display = 'none'
      document.querySelector('.container').style.display = 'block'
    }

    this.ws.onerror = (evt) => {
      console.dir(evt)
    }

    this.ws.onmessage = (evt) => {
      this.handleConnectMessage(evt)
    }
  }

  sendToServer(msg) {
    var msgJSON = JSON.stringify(msg)
    // log("Sending '" + msg.type + "' message: " + msgJSON);
    this.ws.send(msgJSON)
  }

  setUsername() {
    this.sendToServer({
      name: this.user.myUsername,
      date: Date.now(),
      id: this.user.clientID,
      type: 'username'
    })
  }

  handleConnectMessage(evt) {
    var chatBox = document.querySelector('.chat-content')
    var text = ''
    var msg = JSON.parse(evt.data)
    var time = new Date(msg.date)
    var timeStr = time.toLocaleTimeString()

    const { handleUserListMsg } = this.options

    switch (msg.type) {
      case 'id':
        this.user.setUserId(msg.id)
        this.setUsername()
        break

      case 'username':
        text = '<em>' + msg.name + '</em> signed in at ' + timeStr + '<br>'
        break

      case 'message':
        text = '(' + timeStr + ') <b>' + msg.name + '</b>: ' + msg.text + '<br>'
        break

      case 'rejectusername':
        this.user.setUserName(msg.name)
        text = '<b>Your username has been set to <em>' + msg.name +
          '</em> because the name you chose is in use.</b><br>'
        break

      case 'userlist': // Received an updated user list
        handleUserListMsg(msg)
        break

        // Signaling messages: these messages are used to trade WebRTC
        // signaling information during negotiations leading up to a video
        // call.

      case 'invite':
        // invite(msg.name)
        break

      case 'video-offer': // Invitation and offer to chat
        // handleVideoOfferMsg(msg)
        break

      case 'video-answer': // Callee has answered our offer
        // handleVideoAnswerMsg(msg);
        break

      case 'new-ice-candidate': // A new ICE candidate has been received
        // handleNewICECandidateMsg(msg)
        break

      case 'hang-up': // The other peer has hung up the call
        // handleHangUpMsg(msg)
        break

        // Unknown message; output to console for debugging.

      default:
        logError('Unknown message received:')
        logError(msg)
    }

    // If there's text to insert into the chat buffer, do so now, then
    // scroll the chat panel so that the new text is visible.

    if (text.length) {
      chatBox.innerHTML += text
      chatBox.scrollTop = chatBox.scrollHeight - chatBox.clientHeight
    }
  }
}

export default Socket
