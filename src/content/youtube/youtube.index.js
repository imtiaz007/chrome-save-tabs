const searchBox = document.querySelector('#search')
const playButton = document.querySelector('.ytp-play-button')
const muteButton = document.querySelector('.ytp-mute-button')
const video = document.querySelector('video')

const fullscreenButton = document.querySelector('.ytp-fullscreen-button')
setTimeout(() => {
  const recc = document
    .querySelector('ytd-item-section-renderer')
    .querySelector('#contents').children

  console.log(recc)
}, 5000)

const getMediaData = () => {
  if ('mediaSession' in navigator) {
    return {
      title: navigator.mediaSession.metadata.title,
      art: navigator.mediaSession.metadata.artwork[0].src,
      artist: navigator.mediaSession.artist,
    }
  }
}
var peer = new Peer('nesivrnj')
var dataConnectionValue

peer.on('open', function (id) {
  // console.log('My peer ID is: ' + id)

  peer.on('connection', function (dataConnection) {
    dataConnection.on('data', (data) => {
      dataConnectionValue = dataConnection
      let mediaData = getMediaData()
      let volume = video.volume
      dataConnection.send({ mediaData, volume })
      doAction(data)
    })
  })
})
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // listen for messages sent from background.js
  if (request.TAB_RELOADED) {
    setTimeout(() => {
      let mediaData = getMediaData()
      console.log({ dataConnectionValue, mediaData })
      if (dataConnectionValue) dataConnectionValue.send({ mediaData })
    }, 1000)
  }
})

const doAction = (data) => {
  switch (data.action) {
    case 'play':
      playButton.click()
      break
    case 'mute':
      muteButton.click()
      break
    case 'fullscreen':
      fullscreenButton.click()
      break
    case 'volume':
      video.volume = data.volume
      break
    case 'forward':
      video.currentTime = video.currentTime + 5
      break
    case 'rewind':
      video.currentTime = video.currentTime - 5
      break
    case 'search':
      console.log(searchBox)
      searchBox.value = data.data
      console.log(data)
      break

    case 'openlink':
      break
  }
}
