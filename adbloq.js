/**
 * * 🔇 AdBloq
 */
console.log("Activated 🔇 AdBloq bookmarklet.");

const rm = function removeNodes(nodes) {
    for (const node of nodes) {
        node.remove();
    }
};

/**
 * @param {HTMLElement} rootNode
 */
const removeAds = (rootNode) => {
    const removeIfQueryMatches = [
        "*[id*=-ad-]",
        "*[class*=-ad-]",
        ".GoogleActiveViewElement",
        ".GoogleActiveViewInnerContainer",
        "*[data-google-av-adk]",
        "iframe[id^=adRoot]",
        "video[src*=Aniview]",
        "*[aria-label*=Advertisement]",
        "iframe[srcDoc*=celtra]",
        "*[class*=bx-campaign]",
    ];
    rm(rootNode.querySelectorAll(removeIfQueryMatches.join(",")));

    // * OTHER DETECTORS
};

// re-run on mutation of DOM
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.addedNodes) {
            mutation.addedNodes.forEach((el) => removeAds(el.parentElement));
        }
    }
});
observer.observe(document.body, { childList: true, subtree: true });

removeAds(document.body);
