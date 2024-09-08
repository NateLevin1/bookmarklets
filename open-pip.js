//
// name: 🔲 Open PiP
// author: Nate Levin (https://natelev.in)
// desc: Open Picture-in-Picture on the first video on the page.
//

const video = document.querySelector("video");
if (!video) {
    alert("No video found on the page.");
    throw new Error("No video found on the page.");
}

const element = document.createElement("div");
element.style.cssText =
    "position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); z-index: 9999; display: flex; justify-content: center; align-items: center; color: white; font-size: 2rem;";
element.textContent = "Click to open Picture-in-Picture";
document.body.appendChild(element);

document.addEventListener(
    "click",
    () => {
        element.remove();
        video.requestPictureInPicture();
    },
    {
        once: true,
    }
);
