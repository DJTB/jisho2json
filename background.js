chrome.extension.onMessage.addListener((msg, sender, sendResponse) => { // eslint-disable-line no-undef, no-unused-vars
  // Set Content
  document.getElementById('tmpClipboard').value = msg.text;
  // Get Input Element
  document.getElementById('tmpClipboard').select();
  // Copy Content
  document.execCommand('Copy', false, null);
});
