chrome.action.onClicked.addListener(function() {
    chrome.runtime.openOptionsPage();
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({"redirect_url": "https://www.google.com/"});
});
