import { MEDIA_CONSTRAINTS } from './consts'
import { handleGetUserMediaError, log } from './log'

export const closeVideoCall = function(user, targetUserInfo) {
  const { myPeerConnection } = user
  const targetUserId = targetUserInfo.clientId
  const pConInstance = myPeerConnection[targetUserId]

  if (!pConInstance) {
    return false
  }

  const pCon = pConInstance.connect
  const localVideo = document.getElementById('video-' + targetUserId)

  log('Closing the call', targetUserInfo)

  // Close the RTCPeerConnection
  if (pCon) {
    log('--> Closing the peer connection')

    // Disconnect all our event listeners; we don't want stray events
    // to interfere with the hangup while it's ongoing.
    pCon.ontrack = null
    pCon.onnicecandidate = null
    pCon.oniceconnectionstatechange = null
    pCon.onsignalingstatechange = null
    pCon.onicegatheringstatechange = null
    pCon.onnotificationneeded = null

    // Stop all transceivers on the connection

    if (pCon.getTransceivers) {
      pCon.getTransceivers().forEach(transceiver => {
        transceiver.stop()
      })
    }

    // Stop the webcam preview as well by pausing the <video>
    // element, then stopping each of the getUserMedia() tracks
    // on it.

    if (localVideo && localVideo.srcObject) {
      const tracks = localVideo.srcObject.getTracks()
      localVideo.pause()
      tracks.forEach((track, index) => {
        track.stop()
      })
    }

    // Close the peer connection
    if (pCon) {
      pCon.close()
    }

    const cellDom = localVideo.parentElement
    const listDom = cellDom.parentElement

    if (listDom && cellDom) {
      listDom.removeChild(cellDom)
    }
  }

  if (user['myPeerConnection'][targetUserId]) {
    delete user['myPeerConnection'][targetUserId]
  }

  if (user['targetUsers'][targetUserId]) {
    delete user['targetUsers'][targetUserId]
  }
  // user.targetUsers = {}

  if (user['offers'][targetUserId]) {
    delete user['offers'][targetUserId]
  }

  if (user['answers'][targetUserId]) {
    delete user['offers'][targetUserId]
  }
}
export const openLocalVideo = async function(user) {
  try {
    user.webcamStream = await navigator.mediaDevices.getUserMedia(MEDIA_CONSTRAINTS)
    document.getElementById('video-' + user.clientId).srcObject = user.webcamStream
  } catch (err) {
    handleGetUserMediaError(err, function(user) {
      closeVideoCall(user)
    })
  }
}
export const createVideoList = async function (msg, user) {
  var listElem = document.querySelector('.chat-user-list')
  var needOpenLocalVideo = false

  msg.users.forEach(function(userItem) {
    var userCellId = 'user-' + userItem.clientId
    var videoCellId = 'video-' + userItem.clientId

    if (!document.querySelector('#' + userCellId)) {
      needOpenLocalVideo = userItem.clientId === user.clientId

      var item = document.createElement('li')
      var videoStr = `<video id='${videoCellId}' autoplay ${needOpenLocalVideo ? 'muted' : ''} width="320"></video>`
      var nameText = `<b>${userItem.username}</b>`

      item.setAttribute('id', userCellId)
      item.innerHTML = videoStr + nameText
      listElem.appendChild(item)
    }
  })

  if (needOpenLocalVideo) {
    await openLocalVideo(user)
  }
}
