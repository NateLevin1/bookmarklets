//
// name: 🔇 AdBloq
// author: Nate Levin (https://natelev.in)
//

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
        // generic signal attributes used on many sites
        "*[id*=-ad-]",
        "*[class*=-ad-]",
        "*[id*=_ad_]",
        "*[class*=_ad_]",
        "*[id*=-ads-]",
        "*[class*=-ads-]",
        "*[id*=_ads_]",
        "*[class*=_ads_]",
        "*[id*=google_ad]",
        "*[class*=google_ad]",
        "*[data-google-query-id]",
        "*[data-google-av-adk]",
        "*[aria-label*=Advertisement]",

        // from: sporcle.com
        ".GoogleActiveViewElement",
        ".GoogleActiveViewInnerContainer",
        "iframe[id^=adRoot]",
        "video[src*=Aniview]",
        "iframe[srcDoc*=celtra]",
        "*[class*=bx-campaign]",

        // from: google.com
        "*[data-text-ad]",

        // from: conjuguemos.com
        "*[class*=primisslate]",
        "*[id*=primis_]",
        "*[title*=Primis]",
    ];
    rm(rootNode.querySelectorAll(removeIfQueryMatches.join(",")));
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

// * Site-specific hacks

if (window.location.hostname.endsWith("wikipedia.org")) {
    const fundraisingBanner = document.querySelector(
        "div[aria-label^=fundraising]"
    );
    fundraisingBanner?.querySelector(".frb-inline-close")?.click?.();
}
