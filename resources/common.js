function changeTheme(style) {
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
    changeTheme(window.localStorage.getItem("theme"));
}
