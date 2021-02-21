import { mediaConstraints } from './connection'
import { handleGetUserMediaError, log } from './log'

export const closeVideoCall = function(user) {
  const { myPeerConnection, clientId } = user
  var localVideo = document.getElementById('video-' + clientId)

  log('Closing the call')

  // Close the RTCPeerConnection
  if (myPeerConnection) {
    log('--> Closing the peer connection')

    // Disconnect all our event listeners; we don't want stray events
    // to interfere with the hangup while it's ongoing.
    myPeerConnection.ontrack = null
    myPeerConnection.onnicecandidate = null
    myPeerConnection.oniceconnectionstatechange = null
    myPeerConnection.onsignalingstatechange = null
    myPeerConnection.onicegatheringstatechange = null
    myPeerConnection.onnotificationneeded = null

    // Stop all transceivers on the connection

    myPeerConnection.getTransceivers().forEach(transceiver => {
      transceiver.stop()
    })

    // Stop the webcam preview as well by pausing the <video>
    // element, then stopping each of the getUserMedia() tracks
    // on it.

    if (localVideo.srcObject) {
      localVideo.pause()
      localVideo.srcObject.getTracks().forEach(track => {
        track.stop()
      })
    }

    // Close the peer connection

    myPeerConnection.close()
    user.myPeerConnection = {}
    user.webcamStream = null
  }

  // Disable the hangup button
  // document.getElementById('hangup-button').disabled = true;
  user.targetUsername = null
}
export const openLocalVideo = async function(user) {
  try {
    var webcamStream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
    document.getElementById('video-' + user.clientId).srcObject = webcamStream
    user.webcamStream = webcamStream
  } catch (err) {
    handleGetUserMediaError(err, function(user) {
      closeVideoCall(user)
    })
  }
}
export const createVideoList = function (msg, user) {
  var listElem = document.querySelector('.chat-user-list')
  var needOpenLocalVideo = false

  msg.users.forEach(function(username) {
    var userCellId = 'user-' + user.clientId
    var videoCellId = 'video-' + user.clientId

    if (!document.querySelector('#' + userCellId)) {
      needOpenLocalVideo = username === user.myUsername

      var item = document.createElement('li')
      var videoStr = `<video id='${videoCellId}' autoplay ${needOpenLocalVideo ? 'muted' : ''}></video>`
      var nameText = `<b>${username}</b>`

      item.setAttribute('id', userCellId)
      item.innerHTML = videoStr + nameText
      listElem.appendChild(item)
    }
  })

  if (needOpenLocalVideo) {
    openLocalVideo(user)
  }
}
