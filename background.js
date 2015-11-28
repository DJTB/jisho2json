chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {
    //Set Content
    document.getElementById("tmpClipboard").value = msg.text;
    //Get Input Element
    document.getElementById("tmpClipboard").select();

    //Copy Content
    document.execCommand("Copy", false, null);
});
