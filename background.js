chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
        chrome.scripting.insertCSS({
            target: {tabId: tabId},
            files: ["./styles.css"]
        })
            .then(() => {
                console.log("INJECTED THE FOREGROUND STYLES.");

                chrome.scripting.executeScript({
                    target: {tabId: tabId},
                    files: ["./foreground.js"]
                })
                    .then(() => {
                        console.log("INJECTED THE FOREGROUND SCRIPT.");
                    });
            })
            .catch(err => console.log(err));
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'get_token') {
        chrome.identity.getAuthToken({interactive: true}, function (token) {
            console.log("Token: ", token);
            sendResponse({
                message: 'success',
                payload: token
            });
        });
        return true;
    } else if (request.message === 'open_ifc_viewer') {
        const url = `http://localhost:5000/examples/web-ifc-viewer/google-drive-viewer/?id=${request.text}&name=${request.name}`
        chrome.tabs.create({ url });
        return true;
    }
});