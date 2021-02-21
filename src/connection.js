export const mediaConstraints = {
  audio: true, // We want an audio track
  video: {
    aspectRatio: {
      ideal: 1.333333 // 3:2 aspect is preferred
    },
    width: 300,
    height: 150
  }
}

export const Connect = class {}
