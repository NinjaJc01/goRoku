function addChannel(id, channelName) {
    const flexItem = document.createElement("div");
    flexItem.id = `ch${id}`;
    flexItem.className = "flex-item channel";
    const link = document.createElement("a");
    const image = document.createElement("img");
    image.src = `/api/roku/image/${id}`;
    image.alt = channelName;
    image.className = "channelImage";
    link.onclick = function () { //Launch a channel w/ no feedback
        console.log(id);
        fetch(("/api/roku/proxy/launch/" + id), { method: "POST" });
    }
    link.setAttribute("href","javascript:void(0);")
    link.append(image);
    flexItem.append(link);
    document.querySelector("#channelBox").append(flexItem);
}
async function getAndParseApps() {
    const parser = new DOMParser();
    const channelsXMLrequest = await fetch("/api/roku/proxy/query/apps");
    const channelsXML = await channelsXMLrequest.text();
    const doc = parser.parseFromString(channelsXML, "application/xml");
    //console.log(doc);
    if (doc.getRootNode().nodeType === "parsererror") {
        alert("Parsing error ocurred");
    } else {
        //console.log(doc);
        const apps = doc.getElementsByTagName("apps")[0];
        //console.log(apps.childNodes);
        apps.childNodes.forEach(function (x) {
            //console.log(x)
            if (x.id !== undefined) {
                addChannel(x.id, x.textContent);
            }
        });
    }
}
