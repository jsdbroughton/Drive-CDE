
function openIfcByName(name) {
    chrome.runtime.sendMessage({
        message: "get_token"
    }, response => {
        if (response.message === 'success') {
            const token = response.payload;
            openFileNamed(token, name)
        }
    });
}

function openFileNamed(token, name) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://www.googleapis.com/drive/v3/files?q=fullText%20contains%20'${name}'&key=AIzaSyCFPmfIxRHgo0UtZgBannU6LwdqidxsriQ`);
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.responseType = 'json';
    xhr.onload = () => {
        const fileID = xhr.response.files[0].id;
        chrome.runtime.sendMessage({message: "open_ifc_viewer", name, text: fileID});
    };
    xhr.send();
}

const logoContainer = document.createElement('div');
const logo = document.createElement('img');
const ifcjsLogo = chrome.runtime.getURL('/images/logo.png');

function createLoadingGUI() {
    logoContainer.classList.add('loader-container');
    logo.classList.add('landing-logo');
    logo.src = ifcjsLogo;
    logoContainer.appendChild(logo);
}

createLoadingGUI();

function showLoadingGUI() {
    document.querySelector('body').appendChild(logoContainer);
}

function hideLoadingGUI() {
    document.querySelector('body').removeChild(logoContainer);
}

let currentFileName = "";

window.oncontextmenu = (event) => {
    removeOpenButton();
    if(event.target && event.target.outerText && event.target.outerText.includes(".ifc") && !/\n/.test(event.target.outerText)){
        currentFileName = event.target.outerText;
        createOpenButton(event.clientX, event.clientY);
    }
};

const openButton = document.createElement('button');
const openButtonLogo = document.createElement('img');
openButtonLogo.src = ifcjsLogo;
openButtonLogo.classList.add("open-button-logo");
openButton.appendChild(openButtonLogo);

openButton.onclick = () => {
    showLoadingGUI();
    setTimeout(() => openIfcByName(currentFileName), 2000);
    setTimeout(() => hideLoadingGUI(), 3000);
}

function createOpenButton(mouseX, mouseY){
    openButton.classList.add('open-file-button');
    openButton.style.left = mouseX - 80 + 'px';
    openButton.style.top = mouseY + 'px';
    document.querySelector('body').appendChild(openButton);
}

window.onclick = () => {
    removeOpenButton();
}

function removeOpenButton() {
    const body = document.querySelector('body');
    if(body.contains(openButton)) {
        body.removeChild(openButton);
    }
}
