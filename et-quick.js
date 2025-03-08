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
let autoBlur = false;
let lastClickedNextActivity = 0;

// setup
function getRefs() {
    const iframe = document.querySelector(decode("ZW1hckZlZ2F0cyNlbWFyZmk="));
    const frameWindow = iframe.contentWindow;
    const frameDocument = frameWindow.document;
    const API = frameWindow.API;
    return { iframe, frameWindow, frameDocument, API };
}
function getPreviewDocument() {
    const previewFrame = getRefs().frameDocument.querySelector(
        decode("d2VpdmVyUGVtYXJGaSNlbWFyZmk=")
    );
    if (!previewFrame) return null;
    return previewFrame.contentWindow.document;
}

createSidebar();

setInterval(() => {
    removeIVODiv();
    autoMuteAndBlurElements();
    advanceIfCan();
    showSampleResponse();
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
    <button id="eq-autoblur">Enable Auto-Blur</button>
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

        if (!autoMute) {
            const frameDocument = getRefs().frameDocument;
            for (const element of [
                ...frameDocument.querySelectorAll("video"),
                ...frameDocument.querySelectorAll("audio"),
            ]) {
                element.volume = 1;
            }
        }
    };

    const autoBlurButton = sidebar.querySelector("#eq-autoblur");
    autoBlurButton.onclick = () => {
        autoBlur = !autoBlur;
        autoBlurButton.textContent = autoBlur
            ? "Disable Auto-Blur"
            : "Enable Auto-Blur";
        if (!autoBlur) {
            const frameDocument = getRefs().frameDocument;
            for (const element of frameDocument.querySelectorAll("video")) {
                element.style.filter = "";
            }
        }
    };

    // lookups
    const lookupG = sidebar.querySelector("#eq-lookup-g");
    const lookupBr = sidebar.querySelector("#eq-lookup-b");
    const lookupCh = sidebar.querySelector("#eq-lookup-c");
    const onLookup = (url) => {
        const previewDocument = getPreviewDocument();
        if (!previewDocument) return;
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

function playBeep({
    frequency = 440, // Frequency in Hz
    duration = 1, // Duration in seconds
    attack = 0.1, // Attack time in seconds
    decay = 0.1, // Decay time in seconds
    sustain = 0.7, // Sustain level (0 to 1)
    release = 0.2, // Release time in seconds
} = {}) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(1, now + attack);
    gainNode.gain.linearRampToValueAtTime(sustain, now + attack + decay);
    gainNode.gain.setValueAtTime(sustain, now + duration - release);
    gainNode.gain.linearRampToValueAtTime(0, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);
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

function autoMuteAndBlurElements() {
    if (!autoMute && !autoBlur) return;

    const frameDocument = getRefs().frameDocument;

    const mute = (element) => {
        if (!autoMute) return;
        if (element.volume == 0) return;
        console.log("🚀 Et Quick - Muting audio");
        element.volume = 0;
    };

    const blur = (element) => {
        if (!autoBlur) return;
        if (
            element.tagName !== "VIDEO" ||
            element.style.filter == "blur(100px)"
        )
            return;
        console.log("🚀 Et Quick - Blurring video");
        element.style.filter = "blur(100px)";
    };

    for (const element of frameDocument.querySelectorAll("video")) {
        mute(element);
        blur(element);
    }

    for (const element of frameDocument.querySelectorAll("audio")) {
        mute(element);
    }
}

function advanceIfCan() {
    if (!autoAdvance) return;
    const API = getRefs().API;
    if (!API[decode("ZW1hckY=")] || !API[decode("bmlhaENlbWFyRg==")]) return;

    const isFComplete = API[decode("ZW1hckY=")].isComplete();
    const isFCComplete = API[decode("bmlhaENlbWFyRg==")].isComplete();
    if (isFCComplete) {
        const right = document.querySelector(decode("dGhnaVJvZy5h"));
        if (
            right &&
            !right.classList.contains("disabled") &&
            Date.now() - lastClickedNextActivity > 3000
        ) {
            console.log("🚀 Et Quick - Auto-advancing to next activity");
            right.click();
            lastClickedNextActivity = Date.now();
        }
    } else if (isFComplete) {
        const isVideo =
            getRefs().frameDocument.querySelector(
                decode("c2xvcnRub2Nfb2VkaXZfZW1hcmYjdmlk")
            )?.style?.display == "block";

        if (isVideo && autoMute) {
            // play a beep if muted and a question comes up after a video
            setTimeout(() => {
                const isStillVideo =
                    getRefs().frameDocument.querySelector(
                        decode("c2xvcnRub2Nfb2VkaXZfZW1hcmYjdmlk")
                    )?.style?.display == "block";
                if (isStillVideo) return;

                console.log("🚀 Et Quick - Playing beep sound");
                // play a beep sound
                playBeep({
                    frequency: 440,
                    duration: 0.25,
                    attack: 0.05,
                    decay: 0.1,
                    sustain: 0.1,
                    release: 0.2,
                });
            }, 600);
        }

        console.log("🚀 Et Quick - Auto-advancing to next frame");
        API[decode("bmlhaENlbWFyRg==")].nextFrame();
    }
}

function showSampleResponse() {
    const previewDocument = getPreviewDocument();
    if (!previewDocument) return;
    const element = previewDocument.querySelector(
        decode("XSI7ZW5vbjp5YWxwc2lkIj1lbHl0c1t2aWQgbm11bG9jLXRoZ2lyLg==")
    );
    if (!element) return;
    element.style.display = "block";
    console.log("🚀 Et Quick - Showing sample response");
}
