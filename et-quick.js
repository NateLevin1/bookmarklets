//
// name: 🚀 Et Quick
// author: Nate Levin (https://natelev.in)
// desc: Toolbar for Et
//

// this isn't meant to be complicated, just to avoid GH search
const encode = (str) => btoa(str.split("").reverse().join(""));
const decode = (str) => atob(str).split("").reverse().join("");

// state
let autoAdvance = false;
let autoMute = false;

// setup
function getRefs() {
    const iframe = document.querySelector(decode("ZW1hckZlZ2F0cyNlbWFyZmk="));
    const frameWindow = iframe.contentWindow;
    const frameDocument = frameWindow.document;
    const API = frameWindow.API;
    return { iframe, frameWindow, frameDocument, API };
}

createSidebar();

setInterval(() => {
    removeIVODiv();
    autoMuteElements();
    advanceIfCan();
}, 100);

function createSidebar() {
    const existing = document.querySelector("#eq-sidebar");
    if (existing) {
        console.warn("🚀 Et Quick has already been loaded on this page.");
        existing.remove();
    }

    const sidebar = document.createElement("div");
    sidebar.style.position = "fixed";
    sidebar.style.top = "42px";
    sidebar.style.left = "0";
    sidebar.style.width = "200px";
    sidebar.style.height = "100%";
    sidebar.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    sidebar.style.color = "white";
    sidebar.style.zIndex = "100000";
    sidebar.id = "eq-sidebar";
    sidebar.innerHTML = `
    <h1>🚀 Et Quick</h1>
    <button id="eq-toggle-visible">Hide</button>
    <h2>Settings</h2>
    <button id="eq-autoadvance">Enable Auto-Advance</button>
    <button id="eq-automute">Enable Auto-Mute</button>
    <h2>Lookups</h2>
    <button id="eq-lookup-g">Lookup G</button>
    <button id="eq-lookup-b">Lookup Br</button>
    <button id="eq-lookup-c">Lookup Ch</button>
    <style>
        .eq-sidebar {
            padding: 10px;
            overflow: hidden;
        }
        .eq-sidebar h1 {
            font-size: 24px;
        }
        .eq-sidebar h2 {
            font-size: 20px;
            margin-top: 12px;
        }
        .eq-sidebar button {
            background: white;
            border-radius: 4px;
            font-size: 16px;
            border: none;
            padding: 2px 6px;
            border: 1px solid rgb(221,221,221);
            display: block;
            margin-top: 10px;
        }
        .eq-sidebar button:hover {
            background: rgb(245,245,245);
        }
        .eq-sidebar button:active {
            color:white;
            background: linear-gradient(rgb(74,144,254), rgb(7,92,229));
            border-color: rgb(31,110,240);
            border-top-color: rgb(57,133,255);
            border-bottom-color: rgb(2, 86, 224);
        }
    </style>`;
    sidebar.classList.add("eq-sidebar");
    document.body.appendChild(sidebar);

    const toggleVisible = sidebar.querySelector("#eq-toggle-visible");
    let isOpen = true;
    toggleVisible.onclick = () => {
        isOpen = !isOpen;
        sidebar.style.height = isOpen ? "100%" : "80px";
        toggleVisible.textContent = isOpen ? "Hide" : "Show";
    };

    const autoAdvanceButton = sidebar.querySelector("#eq-autoadvance");
    autoAdvanceButton.onclick = () => {
        autoAdvance = !autoAdvance;
        autoAdvanceButton.textContent = autoAdvance
            ? "Disable Auto-Advance"
            : "Enable Auto-Advance";
    };

    const autoMuteButton = sidebar.querySelector("#eq-automute");
    autoMuteButton.onclick = () => {
        autoMute = !autoMute;
        autoMuteButton.textContent = autoMute
            ? "Disable Auto-Mute"
            : "Enable Auto-Mute";
    };

    // lookups
    const lookupG = sidebar.querySelector("#eq-lookup-g");
    const lookupBr = sidebar.querySelector("#eq-lookup-b");
    const lookupCh = sidebar.querySelector("#eq-lookup-c");
    const onLookup = (url) => {
        const previewFrame = getRefs().frameDocument.querySelector(
            decode("d2VpdmVyUGVtYXJGaSNlbWFyZmk=")
        );
        if (!previewFrame) return;
        const previewDocument = previewFrame.contentWindow.document;
        const element =
            previewDocument.querySelector(decode("XWRpcVt2aWQ=")) ??
            previewDocument.querySelector("form") ??
            previewDocument.querySelector("div#main") ??
            previewDocument.querySelector("div.content");
        const search = encodeURIComponent(element.innerText.trim());

        window.open(url + search, "_blank");
    };
    lookupG.onclick = () =>
        onLookup(decode("PXE/aGNyYWVzL21vYy5lbGdvb2cud3d3Ly86c3B0dGg="));
    lookupBr.onclick = () =>
        onLookup(decode("PXE/a3NhL3BwYS9tb2MueWxuaWFyYi8vOnNwdHRo"));
    lookupCh.onclick = () =>
        onLookup(decode("PXE/L21vYy50cGd0YWhjLy86c3B0dGg="));
}

function removeIVODiv() {
    const invis = getRefs().frameDocument.querySelector(
        decode("dmlkLW8tc2l2bmkj")
    );
    if (!invis) return;
    if (invis.style.pointerEvents === "none") return;
    console.log("🚀 Et Quick - Removing IVO Div");
    invis.style.pointerEvents = "none";
}

function autoMuteElements() {
    if (!autoMute) return;

    const frameDocument = getRefs().frameDocument;
    const elements = [
        ...frameDocument.querySelectorAll("video"),
        ...frameDocument.querySelectorAll("audio"),
    ];

    for (const element of elements) {
        if (element.volume == 0) continue;
        console.log("🚀 Et Quick - Muting audio");
        element.volume = 0;
    }
}

function advanceIfCan() {
    if (!autoAdvance) return;
    const API = getRefs().API;
    const isFComplete = API[decode("ZW1hckY=")].isComplete();
    const isFCComplete = API[decode("bmlhaENlbWFyRg==")].isComplete(); // there is a bug when this happens
    if (isFComplete && !isFCComplete) {
        console.log("🚀 Et Quick - Auto-advancing");
        API[decode("bmlhaENlbWFyRg==")].nextFrame();
    }
}
