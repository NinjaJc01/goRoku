function changeTheme(style) { //TODO fix buttons for onload theming
    const inverseStyle = style === "light" ? "dark" : "light"
    window.localStorage.setItem("theme",style);
        document.body.classList.remove(`${inverseStyle}bg`,`${inverseStyle}text`);
        document.body.classList.add(`${style}bg`,`${style}text`);
        document.querySelectorAll(".vector").forEach(function (elem) {
            if (style === "dark") {
                elem.classList.add("darkimg");
            } else {
                elem.classList.remove("darkimg");
            }
        });
        document.querySelectorAll(".foreground").forEach(function (elem) {
            elem.classList.remove(`${inverseStyle}fg`);
            elem.classList.add(`${style}fg`);
        });
}
function onload() {
    //console.log(window.localStorage.getItem("theme"));
    if (window.localStorage.getItem("theme") === null) {
        window.localStorage.setItem("theme","light")
    }
    changeTheme(window.localStorage.getItem("theme"));
}
function detectMobile() {
    const ua = navigator.userAgent;
    const isMobile = ua.indexOf( "Mobile" ) !== -1 || 
    ua.indexOf( "iPhone" ) !== -1 || 
    ua.indexOf( "Android" ) !== -1 || 
    ua.indexOf( "Windows Phone" ) !== -1 ;
    return isMobile;
}