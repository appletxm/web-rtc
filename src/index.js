// import 'core-js/stable'
import 'regenerator-runtime/runtime'

import User from './user'
import Socket from './socket'
import { addEvents as loginEvent } from './login'

function bootStrap() {
  const user = new User()
  const socket = new Socket({
    user,
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
