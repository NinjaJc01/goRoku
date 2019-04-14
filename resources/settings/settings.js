async function fillSettings() {
    document.querySelector("#darkslider").checked = (window.localStorage.getItem("theme") === "dark");
    const req = await fetch("/api/roku/ipaddr");
    const ipAddr = await req.text();
    //console.log(ipAddr);
    document.querySelector("#ipaddr").value = ipAddr;
}
function selectTheme() {
    window.localStorage.setItem("theme", document.querySelector("#darkslider").checked ? "dark" : "light");
    changeTheme(window.localStorage.getItem("theme"));
}
async function updateIP(ip) {
    //console.log(ip);
    document.querySelector("#ipaddr").value = ip;
    const req = await fetch("/api/roku/ipaddr",
        {
            method: "POST",
            headers: {
                "content-type": "plain"
            },
            body: ip
        });
    //console.log(await req.text());
}