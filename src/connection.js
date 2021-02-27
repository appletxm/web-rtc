/* globals RTCPeerConnection, RTCIceCandidate, RTCSessionDescription */
import { log, reportError, handleGetUserMediaError } from './log'
import { getHostName as utilGetHostName } from './utils'
import { closeVideoCall, openLocalVideo } from './video-list'
// import { MEDIA_CONSTRAINTS } from './consts'

export const Connection = class {
  constructor(options) {
    const {user, targetUserInfo} = options
    this.connect = null
    this.targetUserInfo = targetUserInfo
    this.user = user
    this.transceiver = null

    this.createConnect()
  }

  handleICECandidateEvent(event) {
    if (event.candidate) {
      log('*** Outgoing ICE candidate: ' + event.candidate.candidate)

      const {clientId, username} = this.targetUserInfo
      const {socket} = this.user

      socket.sendToServer({
        type: 'new-ice-candidate',
        id: clientId,
        target: username,
        candidate: event.candidate
      })
    }
  }

  handleICEConnectionStateChangeEvent(event) {
    log('*** ICE connection state changed to ' + this.connect.iceConnectionState)

    switch (this.connect.iceConnectionState) {
      case 'closed':
      case 'failed':
      case 'disconnected':
        closeVideoCall(this.user, this.targetUserInfo)
        break
    }
  }

  handleICEGatheringStateChangeEvent(event) {
    log('*** ICE gathering state: ' + this.connect.iceGatheringState)
    log('*** ICE gathering event:', event)
  }

  handleSignalingStateChangeEvent(event) {
    log('*** WebRTC signaling state : ' + this.connect.signalingState)
    log('*** WebRTC signaling event : ', event)
    switch (this.connect.signalingState) {
      case 'closed':
        closeVideoCall(this.user, this.targetUserInfo)
        break
    }
  }

  async handleNegotiationNeededEvent() {
    log('*** Negotiation needed')

    try {
      log('---> Creating offer')

      const offer = await this.connect.createOffer()

      // If the connection hasn't yet achieved the 'stable' state,
      // return to the caller. Another negotiationneeded event
      // will be fired when the state stabilizes.

      if (this.connect.signalingState !== 'stable') {
        log('    -- The connection isn\'t stable yet; postponing...')
        return
      }

      // Establish the offer as the local peer's current
      // description.

      log('---> Setting local description to the offer')
      await this.connect.setLocalDescription(offer)

      // Send the offer to the remote peer.

      log('---> Sending the offer to the remote peer')
      const {username} = this.targetUserInfo
      const {socket, myUsername, clientId} = this.user
      const targetId = this.targetUserInfo.clientId

      // debugger

      if (clientId !== targetId && this['user']['myPeerConnection'][targetId]) {
        socket.sendToServer({
          id: clientId,
          targetId,
          name: myUsername,
          targetUsername: username,
          type: 'video-offer',
          sdp: this.connect.localDescription
        })
      }
    } catch (err) {
      log('*** The following error occurred while handling the negotiationneeded event:')
      reportError(err)
    }
  }

  handleTrackEvent(event) {
    log('=============*** Track event:', this.user.myUsername, ':', ('video-' + this.targetUserInfo.username))
    document.getElementById('video-' + this.targetUserInfo.clientId).srcObject = event.streams[0]
  }

  async handleNewICECandidateMsg(msg) {
    var candidate = new RTCIceCandidate(msg.candidate)

    log('*** Adding received ICE candidate: ' + JSON.stringify(candidate))
    try {
      await this.connect.addIceCandidate(candidate)
    } catch (err) {
      reportError(err)
    }
  }

  async handleVideoOfferMsg(msg) {
    // msg content belows
    // id: clientId,
    // targetId: this.targetUserInfo.clientId,
    // name: myUsername,
    // target: username,
    // type: 'video-offer',
    // sdp: this.connect.localDescription

    const { targetId, targetUsername } = msg

    // If we're not already connected, create an RTCPeerConnection
    // to be linked to the caller.

    log('Received video chat offer from ' + targetUsername)
    if (!this.connect) {
      this.targetUserInfo = {
        clientId: targetId,
        username: targetUsername
      }
      this.createPeerConnection()
      this['user']['myPeerConnection'][targetId] = this
      this['user']['targetUsers'][targetId] = {
        clientId: targetId,
        username: targetUsername
      }
    }

    // We need to set the remote description to the received SDP offer
    // so that our local WebRTC layer knows how to talk to the caller.

    var desc = new RTCSessionDescription(msg.sdp)

    // If the connection isn't stable yet, wait for it...

    if (this.connect.signalingState !== 'stable') {
      log('  - But the signaling state isn\'t stable, so triggering rollback')

      // Set the local and remove descriptions for rollback; don't proceed
      // until both return.
      await Promise.all([
        this.connect.setLocalDescription({type: 'rollback'}),
        this.connect.setRemoteDescription(desc)
      ])
      return
    } else {
      log('  - Setting remote description')
      await this.connect.setRemoteDescription(desc)
    }

    // Get the webcam stream if we don't already have it

    if (!this.user.webcamStream) {
      this.setMediaStream()
    }

    log('---> Creating and sending answer to caller')

    await this.connect.setLocalDescription(await this.connect.createAnswer())

    const {socket, myUsername, clientId} = this.user

    // debugger

    socket.sendToServer({
      id: clientId,
      name: myUsername,
      targetId,
      targetUsername,
      type: 'video-answer',
      sdp: this.connect.localDescription
    })
  }

  async handleVideoAnswerMsg(msg) {
    log('*** Call recipient has accepted our call')

    // Configure the remote description, which is the SDP payload
    // in our 'video-answer' message.

    var desc = new RTCSessionDescription(msg.sdp)
    await this.connect.setRemoteDescription(desc).catch(reportError)
  }

  async createPeerConnection() {
    log('Setting up a connection...')

    // Create an RTCPeerConnection which knows to use our chosen
    // STUN server.
    this.connect = new RTCPeerConnection({
      iceServers: [ // Information about ICE servers - Use your own!
        {
          urls: 'turn:' + utilGetHostName(), // A TURN server
          username: 'webrtc',
          credential: 'turnserver'
        }
      ]
    })

    // Set up event handlers for the ICE negotiation process.
    this.connect.onicecandidate = this.handleICECandidateEvent.bind(this)
    this.connect.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent.bind(this)
    this.connect.onicegatheringstatechange = this.handleICEGatheringStateChangeEvent.bind(this)
    this.connect.onsignalingstatechange = this.handleSignalingStateChangeEvent.bind(this)
    this.connect.onnegotiationneeded = this.handleNegotiationNeededEvent.bind(this)
    this.connect.ontrack = this.handleTrackEvent.bind(this)
  }

  async setMediaStream() {
    try {
      // this.usr.webcamStream = await navigator.mediaDevices.getUserMedia(MEDIA_CONSTRAINTS)
      // document.getElementById('video-' + this.user.clientId).srcObject = this.user.webcamStream
      openLocalVideo(this.user)
    } catch (err) {
      handleGetUserMediaError(err)
    }
  }

  setTrackStream() {
    try {
      if (!this.user.webcamStream) {
        this.setMediaStream()
      }
      this.user.webcamStream.getTracks().forEach(
        track => this.connect.addTransceiver(track, {streams: [this.user.webcamStream]})
      )
    } catch (err) {
      handleGetUserMediaError(err, () => {
        closeVideoCall(this.user, this.targetUserInfo)
      })
    }
  }

  createConnect() {
    const { username } = this.targetUserInfo
    log('Inviting user ' + username)
    log('Setting up connection to invite user: ' + username)

    this.createPeerConnection()
    this.setTrackStream()
  }
}
