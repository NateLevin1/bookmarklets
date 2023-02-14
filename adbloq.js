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
        "*[id^=ad_]",
        "*[id^=ad-]",
        "*[id^=ads_]",
        "*[id^=ads-]",
        "*[id*=google_ad]",
        "*[class*=google_ad]",
        "*[data-google-query-id]",
        "*[data-google-av-adk]",
        "*[aria-label*=Advertisement]",
        'iframe[title*=" ad "]',
        "cnx",

        // from: sporcle.com
        ".GoogleActiveViewElement",
        ".GoogleActiveViewInnerContainer",
        "iframe[id^=adRoot]",
        "video[src*=Aniview]",
        "iframe[srcDoc*=celtra]",
        "*[class*=bx-campaign]",
        ".ads-mode",

        // from: google.com
        "*[data-text-ad]",

        // from: conjuguemos.com
        "*[class*=primisslate]",
        "*[id*=primis_]",
        "*[title*=Primis]",

        // from: taboola.com
        "*[data-ad-unit-name]",
        "*[id*=taboola]",
        "*[class*=taboola]",

        // from: outbrain.com
        "phoenix-outbrain",
    ];
    rm(rootNode.querySelectorAll(removeIfQueryMatches.join(",")));

    // * Site-specific hacks
    const domain = window.location.hostname;
    if (domain.endsWith("wikipedia.org")) {
        const fundraisingBanner = document.querySelector(
            "div[aria-label^=fundraising]"
        );
        fundraisingBanner?.querySelector(".frb-inline-close")?.click?.();
    } else if (domain.endsWith("sporcle.com")) {
        document.querySelector(".avp-p-cn-close")?.click?.();
    }
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

// some evil websites put ads outside of the <body> element, but we don't want to force
// the browser to check all of <head> in the usual case, so we only do it if necessary
if (document.documentElement.children.length <= 2) {
    removeAds(document.body);
} else {
    removeAds(document.documentElement);
}
