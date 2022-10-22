console.log('background script')

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // read changeInfo data and do something with it (like read the url)
  // console.log({ tabId, changeInfo, tab })
  if (isUrl(tab.url, 'youtube') && changeInfo.status === 'complete') {
    // do something here
    console.log('in chrome tabs', changeInfo)
    chrome.tabs.sendMessage(tabId, {
      TAB_RELOADED: true,
    })
  }
})

const isUrl = (url, value) => {
  return url.split('.').includes(value)
}
