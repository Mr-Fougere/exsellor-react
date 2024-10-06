chrome.offscreen.createDocument({
    url: chrome.runtime.getURL("index.html"),
    reasons: [chrome.offscreen.Reason.CLIPBOARD],
    justification: 'testing the offscreen API',
  });
  
window.close();
