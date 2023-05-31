//
// name: ⚡️ Gimkit Lightning
// author: Nate Levin (https://natelev.in)
// desc: Auto-answer questions on Gimkit
//

let answers = null;
let room = null;

const decoder = new TextDecoder("utf-8");
const onWsMessage = function (event) {
    const { data } = event;
    const strData = decoder.decode(data);
    const readableStrData = JSON.stringify(strData, null, 2);

    // Gimkit uses a binary format, but we can just parse it as if it is text
    // With a bit of reverse engineering, you can find that it will send out the questions including their answers!
    if (!strData.includes("STATE_UPDATE�data��type�GAME_QUESTIONS")) return;
    console.log("🚨 Received msg: ", { data }, readableStrData);

    const [_roomMatch, matchedRoom] = strData.match(/�message-([^�]+)�/);
    room = matchedRoom;
    const questions = strData.split("position").slice(1);

    answers = [];

    for (const questionData of questions) {
        const [_idMatch, id] = questionData.match(/_id�([^�]+)�/);

        const correctAnswers = Array.from(
            questionData.matchAll(/correctã_id�([^�]+)�text�([^�]+)�/g)
        ).map(([_match, id, text]) => ({
            id,
            text,
        }));

        answers.push({ id, correctAnswers });
    }
};

let clapping = false;
const clickRepeatedly = (el) => {
    el.click();
    requestAnimationFrame(() => clickRepeatedly(el));
};

let answerIndex = 0;
setInterval(() => {
    if (
        !answers ||
        answers.length === 0 ||
        window.__gimkitLightningWebsocket.readyState > 1 ||
        clapping
    )
        return;

    const clapButton = document.querySelector("div.animated.pulse.infinite");
    if (clapButton && clapButton.textContent.startsWith("👏")) {
        // game over!
        console.log("Game over!");
        clickRepeatedly(clapButton);
        clapping = true;
        return;
    }

    const { id, correctAnswers } = answers[answerIndex];

    try {
        // TODO: handle multiple correct answers
        window.__gimkitLightningWebsocket.send(
            Uint8Array.from(
                `\u0004\u0084\u00A4type\u0002\u00A4data\u0092\u00B5blueboat_SEND_MESSAGE\u0083\u00A4room\u00AE${room}\u00A3key\u00B1QUESTION_ANSWERED\u00A4data\u0082\u00AAquestionId\u00B8${id}\u00A6answer\u00B8${correctAnswers[0].id}\u00A7options\u0081\u00A8compress\u00C3\u00A3nsp\u00A1/`,
                (ch) => ch.charCodeAt(0)
            )
        );
    } catch (err) {
        console.error("Error sending correct answer: " + err);
    }

    answerIndex = (answerIndex + 1) % answers.length;
}, 750);

// inject into WebSocket.send to track the game
let oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function (data) {
    // if we haven't gotten the answers after 5s, we should try to force a reconnection
    // so that Gimkit will send us the answers!
    setTimeout(() => {
        if (!answers) {
            this.close();
        }
    }, 5_000);

    const strData = JSON.stringify(decoder.decode(data), null, 2);
    console.log("📧 Sent msg: ", { data }, strData);
    this.addEventListener("message", onWsMessage.bind(this));
    window.__gimkitLightningWebsocket = this;
    return oldSend.call(this, data);
};
