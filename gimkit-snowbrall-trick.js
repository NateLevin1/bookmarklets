//
// name: ❄️ Gimkit Snowbrall Trick
// author: Nate Levin (https://natelev.in)
// desc: Use y,g,h,j as WASD to move extra fast and while in menus
//

if (!window.location.hostname.endsWith("gimkit.com")) {
    alert("This bookmarklet only works on gimkit.com!");
    throw new Error("This bookmarklet only works on gimkit.com!");
}

// inject into .push to find a scene
let oldPush = Array.prototype.push;
let game;
Array.prototype.push = function (...arguments) {
    if (!!this[0]?.scene || !!this[0]?.gameObject?.scene) {
        game = this[0]?.scene?.game ?? this[0].gameObject.scene.game;
        window.phaserGame = game; // allow editing from devtools console
        console.log(`%cSuccessfully found Phaser game!`, "color: green");
        Array.prototype.push = oldPush;
    }

    return oldPush.call(this, ...arguments);
};

const move = (times, type, positive) => {
    phaserGame.scene.scenes[0].worldManager.physics.bodiesManager.movableBodies[0].pos[
        type
    ] += positive ? 48 : -48;
    if (times < 5) {
        setTimeout(() => move(times + 1, type, positive), 115);
    }
};

window.onkeydown = (event) => {
    switch (event.key.toLowerCase()) {
        case "j":
            move(0, "x", true);
            break;
        case "g":
            move(0, "x", false);
            break;
        case "y":
            move(0, "y", false);
            break;
        case "h":
            move(0, "y", true);
            break;
    }
};
