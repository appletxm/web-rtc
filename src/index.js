// import 'core-js/stable'
import 'regenerator-runtime/runtime'

import User from './user'
import Socket from './socket'
import { addEvents as loginEvent } from './login'
import { addEvents as logoutEvent } from './logout'
import Chat from './chat'

function bootStrap() {
  let user = new User()
  let chat = new Chat(
    { user }
  )
  let socket = new Socket({
    user,
    exploreSocket(socket) {
      chat.setSocket(socket)
      user.setSocket(socket)
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
    },
    handleHangUpMsg(msg) {
      user.removeUser(msg)
    }
  })

  loginEvent({
    socket,
    login(opts) {
      user.login(opts)
    }
  })

  logoutEvent({
    socket,
    logout() {
      user.logout()
    }
  })
}

bootStrap()
