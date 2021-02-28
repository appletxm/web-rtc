// import 'core-js/stable'
import 'regenerator-runtime/runtime'

import User from './user'
import Socket from './socket'
import { addEvents as loginEvent } from './login'
import Chat from './chat'

function bootStrap() {
  const user = new User()
  const chat = new Chat(
    {
      user
    }
  )
  const socket = new Socket({
    user,
    setSocket(socket) {
      chat.socket = socket
    },
    exploreSocket(socket) {
      user.socket = socket
    },
    handleUserListMsg(msg) {
      user.createUserList(msg)
    },
    invite(msg) {
      user.invite(msg)
    },
    handleNewICECandidateMsg(msg) {
      user.handleNewICECandidateMsg(msg)
    },
    handleVideoOfferMsg(msg) {
      user.handleVideoOfferMsg(msg)
    },
    handleVideoAnswerMsg(msg) {
      user.handleVideoAnswerMsg(msg)
    },
    handleChatMessage(msg) {
      chat.showMessage(msg)
    }
  })

  loginEvent({
    enterEvent(opts) {
      user.setUserName(opts.userName)
      socket.connect()
    },
    loginEvent(opts) {
      // console.info('-===loginEvent===', opts)
      user.setUserName(opts.userName)
      socket.connect()
    }
  })
}

bootStrap()
