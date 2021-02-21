import { createVideoList } from './video-list'

const User = class {
  constructor() {
    this.clientId = 0
    this.myUsername = ''
    this.connections = {}
    this.targetUsername = {}
    this.myPeerConnection = {}
    this.webcamStream = null
  }

  setUserId(id) {
    this.clientId = id
  }

  setUserName(name) {
    this.myUsername = name
  }

  createUserList(msg) {
    createVideoList(msg, this)
  }
}

export default User
