//
// name: ⏱ AnySpeed
// author: Nate Levin (https://natelev.in)
// desc: Easily change the speed of all videos on a page, even on sites that prevent you!
//

const videos = Array.from(document.querySelectorAll("video"));

const newPlaybackRate = Number(prompt("What rate do you want?"));
if (!newPlaybackRate || isNaN(newPlaybackRate)) {
    throw new Error("Canceled change of playback rate");
}

// to allow this to be used more than once,
// we read the value from the window from now on
window.anySpeedPlaybackRate = newPlaybackRate;

const timeWhenChanged = Date.now();

for (const video of videos) {
    video.playbackRate = newPlaybackRate;
    video.addEventListener("ratechange", () => {
        // make sure evil websites can't prevent this!
        const timeSinceChange = Date.now() - timeWhenChanged;
        if (video.playbackRate != newPlaybackRate && timeSinceChange < 500) {
            // the website has automatically changed it -- evil!
            console.info(
                "⏱ AnySpeed - This website is automatically changing the playback speed... Bypassing the defenses!"
            );
            repeatedlySpeedUp(video);
        }
    });
}

function repeatedlySpeedUp(video) {
    video.playbackRate = window.anySpeedPlaybackRate;
    requestAnimationFrame(() => repeatedlySpeedUp(video));
}
