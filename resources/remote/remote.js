let textBox;
let boxContent = "" ;
async function sendKeypress(keyname) {
    let response = await fetch(("/api/roku/proxy/keypress/" + keyname), { method: "post", mode: "no-cors", })
    console.log(await response.text())
}
const allowedToType = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890 ";
const keyMap = {
    "ArrowUp": "up",
    "ArrowDown": "down",
    "ArrowLeft": "left",
    "ArrowRight": "right",
    "Backquote": "select",
    "Period": "fwd",
    "Comma": "rev",
    "Backspace": "backspace",
    "Enter": "enter",
    "Escape": "back",
}
function remoteOnload() {
    textBox = document.querySelector("#bottomBox");
    if (detectMobile()) {
        //textBox.setAttribute("style", "");
    }
}

function textInput() { //TODO this needs a fix, I need to be smarter about this
    const textContent = textBox.value;
    //alert(textContent);
    //find length delta if they deleted a char, so see how many backspaces to send
    
    if (textContent != boxContent) {
        if (textContent.length > boxContent.length) {
            sendString(textContent.charAt(textContent.length - 1))
        } else {
            //send backspaces
            const backspaces = boxContent.length - textContent.length;
            for (let i = 0; i < backspaces; i++) {
                sendKeypress("backspace");
            }
        }
    }
    boxContent = textContent;
}
function sendString(string) {
    string.forEach(char => {
        sendKeypress("lit_"+encodeURI(char))
    });
    
}
var keyPressEnabled = true;
function handleKey(e) {
    if (keyMap[e.code] !== undefined) {
        sendKeypress(keyMap[e.code]);
    } else {
        if (allowedToType.indexOf(e.key) > -1) {
            sendKeypress("lit_" + encodeURI(e.key));
        }
    }
}
function toggleKeypress() {
    const icon = document.querySelector("#keyboard")
    if (keyPressEnabled) {
        icon.setAttribute("style", "background: #121212; border-radius:4px;");
        disableBinding();
        keyPressEnabled = false;
    } else {
        icon.removeAttribute("style");
        keyPressEnabled = true;
        attachKeypress();
    }
    return keyPressEnabled
}
function attachKeypress() {
    document.querySelector("body").addEventListener('keydown', handleKey);
}
function disableBinding() {
    document.querySelector("body").removeEventListener('keydown', handleKey);
}