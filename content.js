const counter = document.createElement("div");
counter.appendChild(document.createTextNode("0 sec"));
counter.setAttribute("id", "counter");
counter.setAttribute("style", "position: absolute; left: 0px; top: 0px; background: black; z-index: 1000000; color: crimson; font-size: 24px;");

document.body.appendChild(counter);
console.log("done");