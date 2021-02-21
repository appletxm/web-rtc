// import 'core-js/stable'
import 'regenerator-runtime/runtime'

import User from './user'
import Socket from './socket'
import { addEvents } from './login'

function bootStrap() {
  const user = new User()
  const socket = new Socket({
    user,
    handleUserListMsg(msg) {
      user.createUserList(msg)
    }
  })

  addEvents({
    enterEvent(opts) {
      user.setUserName(opts.userName)
      socket.connect()
    },
    loginEvent(opts) {
      user.setUserName(opts.userName)
      socket.connect()
    }
  })
}

bootStrap()
