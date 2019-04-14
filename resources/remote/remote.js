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
    "Backquote":"select",
    "Period": "fwd",
    "Comma": "rev",
    "Backspace": "backspace",
    "Enter": "enter",
    "Escape": "back",
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
        icon.setAttribute("style","background: #121212; border-radius:4px;");
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