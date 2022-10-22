console.log('in disney')
setTimeout(() => {
  main()
}, 3000)
function main() {
  var peer = new Peer('nesivrnj')
  var dataConnectionValue

  peer.on('open', function (id) {
    console.log('My peer ID is: ' + id)

    peer.on('connection', function (dataConnection) {
      dataConnection.on('data', (data) => {
        console.log(data)
        dataConnectionValue = dataConnection
        let mediaData = getMediaData()
        let video = document.querySelector('video')
        let volume = video.volume
        console.log({ mediaData })
        dataConnection.send({ mediaData, volume })
        doAction(data)
      })
    })
  })
}

const getMediaData = () => {
  const title = document.querySelector(
    '#hudson-wrapper > div > div > div.btm-media-overlays-container > div > div > div.controls__header > div.title-bug-area > div > button.control-icon-btn.title-btn > div.title-field.body-copy',
  ).textContent
  const subText = document.querySelector(
    '#hudson-wrapper > div > div > div.btm-media-overlays-container > div.overlay.overlay__controls.overlay__controls--visually-hide > div > div.controls__header > div.title-bug-area > div > button.control-icon-btn.title-btn > div.subtitle-field',
  ).textContent
  return {
    title: title,
    artist: subText,
  }
}
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
  let video = document.querySelector('video')
  switch (data.action) {
    case 'play':
      video.click()
      break
    case 'mute':
      if (video.volume === 0) {
        video.volume = 1
      } else {
        video.volume = 0
      }
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

// const hasClass = (el, className) => el.classList.contains(className)

// setInterval(() => {
//   if (
//     hasClass(
//       document.querySelector('.btm-media-overlays-container'),
//       'skip__button',
//     )
//   ) {
//     console.log('in dis', skip)
//   }
// }, 3000)
