//
// name: ⚡️ Gimkit Lightning
// author: Nate Levin (https://natelev.in)
// desc: Auto-answer questions on Gimkit
//

let answers = null;
let room = null;
let is2DGame = false;

const decoder = new TextDecoder("utf-8");
const onWsMessage = function (event) {
    const { data } = event;
    const strData = decoder.decode(data);
    const readableStrData = JSON.stringify(strData, null, 2);

    // Gimkit uses a binary format, but we can just parse it as if it is text
    // With a bit of reverse engineering, you can find that it will send out the questions including their answers!
    // console.log("🚨 Received msg: ", { data }, readableStrData);

    if (strData.includes("STATE_UPDATE�data��type�GAME_QUESTIONS")) {
        console.log("🚨📣 Received STATE_UPDATE: ", { data }, readableStrData);
        if (!room) {
            const [_roomMatch, matchedRoom] =
                strData.match(/�message-([^�]+)�/);
            room = matchedRoom;
        }
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
    } else if (strData.includes("DEVICES_STATES_CHANGES")) {
        // this is sent for all the 2d
        is2DGame = true;
        const jsonStartIndex = strData.indexOf('[{"type":"mc","position":0,');
        if (jsonStartIndex === -1) return;
        let strDataSliced = strData.slice(jsonStartIndex);
        const jsonEndIndex = strDataSliced.indexOf('__v":0}]');
        strDataSliced = strDataSliced.slice(0, jsonEndIndex + 8);
        console.log("🚨📣 Received DEVICES_STATES_CHANGES: ", strDataSliced);

        const questions = JSON.parse(strDataSliced);
        answers = new Map();
        for (const question of questions) {
            const id = question["_id"];
            const correctAnswers = question.answers
                .filter((ans) => !!ans.correct)
                .map((ans) => ({ id: ans["_id"], text: ans.text }));
            console.log(question);
            answers.set(question["text"], { id, correctAnswers });
        }
    }
};

let clapping = false;
const clickRepeatedly = (el) => {
    el.click();
    requestAnimationFrame(() => clickRepeatedly(el));
};

const game2DInterval = () => {
    if (
        !is2DGame ||
        !answers ||
        answers.size === 0 ||
        window.__gimkitLightningWebsocket.readyState > 1 ||
        clapping
    )
        return;

    const continueBtn = document.evaluate(
        "//div[text()='Continue']",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;
    if (continueBtn) {
        continueBtn.click();
        continueBtn.parentElement.style.color = "yellow";
        continueBtn.parentElement.parentElement.parentElement.style.transform =
            "scale(99)";
        return;
    }

    // keep fishing in the fish game
    const fishAgain = document.evaluate(
        "//span[text()='Fish Again']",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;
    if (fishAgain) {
        const backpackFull = document.evaluate(
            "//div[contains(text(),'However, your backpack cannot carry more of this fish.')]",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        if (!backpackFull) {
            fishAgain.click();
        }
    }

    const els = Array.from(document.querySelectorAll(".notranslate.lang-en"));
    if (els.length === 0) return;
    const question = els[0].textContent;
    const correctAns = answers.get(question);
    if (!correctAns) {
        console.warn("Encountered a question that we don't know: " + question);
        return;
    }
    for (const ans of correctAns.correctAnswers) {
        for (const el of els) {
            if (el.textContent === ans.text) {
                el.click();
                el.parentElement.style.color = "yellow";
                el.parentElement.parentElement.parentElement.parentElement.parentElement.style.transform =
                    "scale(99)";
            }
        }
    }
};
setInterval(game2DInterval, 50);

const clapChecker = () => {
    const clapButton = document.querySelector("div.animated.pulse.infinite");
    if (clapButton && clapButton.textContent.startsWith("👏")) {
        // game over!
        console.log("Game over!");
        clickRepeatedly(clapButton);
        clapping = true;
    }
};
setInterval(clapChecker, 250);

let answerIndex = 0;
const regularGameInterval = () => {
    if (
        is2DGame ||
        !answers ||
        answers.length === 0 ||
        window.__gimkitLightningWebsocket.readyState > 1 ||
        clapping
    )
        return;

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
};
setInterval(regularGameInterval, 750);

// inject into WebSocket.send to track the game
let oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function (data) {
    // if we haven't gotten the answers after 5s, we should try to force a reconnection
    // so that Gimkit will send us the answers!
    setTimeout(() => {
        if (!answers) {
            console.log("❌ Closing websocket for reconnection");
            this.close();
        }
    }, 5_000);

    const strData = JSON.stringify(decoder.decode(data), null, 2);
    if (is2DGame) {
        const deviceIdMatch = strData.match(/deviceId�([^�]+)�/);
        if (deviceIdMatch) room = deviceIdMatch[1];
    }
    // console.log("📧 Sent msg: ", { data }, strData);
    this.addEventListener("message", onWsMessage.bind(this));
    window.__gimkitLightningWebsocket = this;
    return oldSend.call(this, data);
};
