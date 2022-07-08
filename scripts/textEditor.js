const textEditor = document.getElementById("textEditor");
const fonts = document.querySelectorAll("select#fonts > option");
let image;
textEditor.focus();

for(let i = 0; i < fonts.length; i++){
    fonts[i].style.fontFamily = fonts[i].value;
}
for(let i = 1; i <= 7; i++){
    let newOption = document.createElement("option");
    newOption.value = i;
    newOption.innerHTML = i;
    fontSize.append(newOption);

    if(i == 3){
        newOption.selected = true;
    }
}

// ################################# Context Menu ##################
const contextMenu = document.getElementById("contextmenu");
const scope = document.querySelector("body");
const options = document.querySelectorAll("#contextmenu .item");

//if context menu is out of the screen, this will reposition it so that the context menu is visible.
const normalizePosition = (mouseX, mouseY) => {
    const {
        left: scopeOffsetX,
        top: scopeOffsetY,
    } = scope.getBoundingClientRect();

    const scopeX = mouseX - scopeOffsetX;
    const scopeY = mouseY - scopeOffsetY;

    const outOfBoundsOnX = scopeX + contextMenu.clientWidth > scope.clientWidth;

    const outOfBoundsOnY = scopeY + contextMenu.clientHeight > scope.clientHeight;

    let normalizedX = mouseX;
    let normalizedY = mouseY;

    if(outOfBoundsOnX) {
        normalizedX = scopeOffsetX + scope.clientWidth - contextMenu.clientWidth;
    }

    if(outOfBoundsOnY) {
        normalizedY = scopeOffsetY + scope.clientHeight - contextMenu.clientHeight;
    }

    return {normalizedX, normalizedY};
}

//add eventlistener on the image tag in text editor to show the custom context menu
textEditor.addEventListener("contextmenu", (event) => {
    if(event.target.tagName == "IMG"){
        event.preventDefault()
        const {clientX: mouseX, clientY: mouseY} = event;

        const {normalizedX, normalizedY} = normalizePosition(mouseX, mouseY);

        contextMenu.style.top = `${normalizedY}px`;
        contextMenu.style.left = `${normalizedX}px`;

        contextMenu.classList.remove("visible");

        setTimeout(() => {
            contextMenu.classList.add("visible");
        });
    }
});

// Hide the custom context menu when left or right clicked outside the contexet menu
scope.addEventListener("click", (e) => {
    if(e.target.offsetParent != contextMenu) {
        contextMenu.classList.remove("visible");
    }
});
scope.addEventListener("contextmenu", (e) => {
    if(e.target.offsetParent != contextMenu) {
        contextMenu.classList.remove("visible");
    }
});

//Functioning of the context menu's option;
textEditor.addEventListener("contextmenu", (event) => {
    if(event.target.tagName == "IMG"){
        for(let i = 0; i < options.length; i++){
            if(options[i].innerHTML == "Download"){
                options[i].onclick = () => {
                    console.log(event.target.src);
                    options[i].setAttribute("href", event.target.src);
                    contextMenu.classList.remove("visible")
                }
                continue;
            }
            
            options[i].onclick = () => {
                event.target.setAttribute("width", options[i].innerHTML);
                contextMenu.classList.remove("visible")
            }
        }
    }
});
// ###################################################

// ############################ Tools ##################
const buttons = document.querySelectorAll("button");
const textColors = document.querySelectorAll(".textColors div");
const highlighterColors = document.querySelectorAll(".highlighterColors div");

for(let i = 0; i < buttons.length; i++){
    if(buttons[i].id == "link"){
        buttons[i].onclick = () => {
            let link = prompt("Add http:\/\/ or https:\/\/ before the link\nLink: ");
            document.execCommand("createLink", false, link);
            textEditor.focus();
        }
        continue;
    }
    if(buttons[i].id == "unlink"){
        buttons[i].onclick =() => {
            document.execCommand("unlink", false, false);
            textEditor.focus();
        }
        continue;
    }

    buttons[i].onclick = () => {
        document.execCommand(buttons[i].id)
        textEditor.focus();
    }
}

document.getElementById("fonts").onchange = () => {
    document.execCommand("fontName", false, document.getElementById("fonts").value);
    textEditor.focus();
}

document.getElementById("fontSize").onchange = () => {
    document.execCommand("fontSize", false, document.getElementById("fontSize").value);
    textEditor.focus();
}

for(let i = 0; i < textColors.length; i++){
    textColors[i].onclick = () => {
        document.execCommand("foreColor", false, textColors[i].style.background);
        textEditor.focus();
    }
}

for(let i = 0; i < highlighterColors.length; i++){
    highlighterColors[i].onclick = () => {
        document.execCommand("backColor", false, highlighterColors[i].style.background);
        textEditor.focus();
    }
}
// ############################

// It will stop the session if the textEditor closes or refresed
window.addEventListener('beforeunload', () => {
    chrome.storage.sync.set({"state": false});
})

// This will insert the screenshot in the textEditor
chrome.runtime.onMessage.addListener((request, sender, sendRequest) => {
    const newImage = document.createElement("img");
    const para = document.createElement("p");
    para.innerHTML = "Type Here";
    newImage.src = request.screenshotUrl;
    newImage.setAttribute("width", "100%");
    document.getElementById("textEditor").append(newImage);
    document.getElementById("textEditor").append(para);
})