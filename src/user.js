import { createVideoList } from './video-list'
import { Connection } from './connection'

const User = class {
  constructor() {
    this.clientId = 0
    this.myUsername = ''
    this.connections = {}
    this.targetUsers = {}
    this.offers = {}
    this.myPeerConnection = {}
    this.webcamStream = null
    this.socket = null
  }

  setUserId(id) {
    this.clientId = id
  }

  setUserName(name) {
    this.myUsername = name
  }

  async createUserList(msg) {
    await createVideoList(msg, this)
  }

  createPeerConnection(targetUserInfo) {
    const { clientId } = targetUserInfo
    this.myPeerConnection[clientId] = new Connection({
      user: this,
      targetUserInfo
    })
    this.targetUsers[clientId] = targetUserInfo
  }

  invite(msg) {
    setTimeout(() => {
      const {id, name} = msg
      if (id === this.clientId) {
        return false
      }

      if (!this.myPeerConnection[id]) {
        const targetUserInfo = {
          clientId: id,
          username: name
        }
        this.createPeerConnection(targetUserInfo)
      }
    }, 3000)
  }

  handleNewICECandidateMsg(msg) {
    const { id } = msg
    const peerCon = this['myPeerConnection'][id]
    if (peerCon) {
      peerCon.handleNewICECandidateMsg(msg)
    }
  }

  handleVideoOfferMsg(msg) {
    const { id, name } = msg

    if (id === this.clientId) {
      return false
    }

    let peerCon = this['myPeerConnection'][id]

    if (peerCon) {
      peerCon.handleVideoOfferMsg(msg)
    } else {
      this.createPeerConnection({
        clientId: id,
        username: name
      })
      this['offers'][id] = true
      peerCon = this['myPeerConnection'][id]
      peerCon.handleVideoOfferMsg(msg)
    }
  }

  handleVideoAnswerMsg(msg) {
    const { id } = msg

    if (id === this.clientId) {
      return false
    }

    const peerCon = this['myPeerConnection'][id]
    // let offer = this['offers'][id]

    if (peerCon) {
      peerCon.handleVideoAnswerMsg(msg)
    }
  }
}

export default User
