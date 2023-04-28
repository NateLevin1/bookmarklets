//
// name: 📵 No YT Shorts
// author: Nate Levin (https://natelev.in)
// desc: Converts YouTube Shorts URLs to regular YouTube URLs
//

if (!window.location.href.includes("youtube.com/shorts")) {
    alert("You are not browsing a short right now.");
    throw new Error("Not on YT Shorts");
}
window.location.href = window.location.href.replace(
    "youtube.com/shorts/",
    "youtube.com/watch?v="
);
