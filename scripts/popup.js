const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const captureBtn = document.getElementById("capture");

chrome.storage.sync.get("state", (session) => {
    if(session.state == false){
        stopBtn.style.display = "none";
        captureBtn.style.display = "none";
        startBtn.style.display = "block";
    }
    else if(session.state == true){
        startBtn.style.display = "none";
        stopBtn.style.display = "block";
        captureBtn.style.display = "block";
    }
})

startBtn.onclick = () => {
    startBtn.style.display = "none";
    stopBtn.style.display = "block";
    captureBtn.style.display = "block";
    chrome.storage.sync.set({"state": true});
    newTabUrl = chrome.extension.getURL('../html/snapDeckTextEditor.html');
    window.open(newTabUrl, '_blank');
}

stopBtn.onclick = () => {
    stopBtn.style.display = "none";
    captureBtn.style.display = "none";
    startBtn.style.display = "block";
    chrome.storage.sync.set({"state": false});
}

captureBtn.onclick = () => {
    chrome.tabs.captureVisibleTab((screenshotUrl) => {
        chrome.runtime.sendMessage({"screenshotUrl": screenshotUrl});
    });
}