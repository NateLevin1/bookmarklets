//
// name: ⚡️ Gimkit Lightning
// author: Nate Levin (https://natelev.in)
// desc: Auto-answer questions on Gimkit
//

let answers = null;
let room = null;
let is2DGame = false;
let answerIndex = 0;

const decoder = new TextDecoder("utf-8");
const onWsMessage = function (event) {
    const { data } = event;
    const strData = decoder.decode(data);
    const readableStrData = JSON.stringify(strData, null, 2);

    // Gimkit uses a binary format, but we can just parse it as if it is text
    // With a bit of reverse engineering, you can find that it will send out the questions including their answers!
    // if (!readableStrData.startsWith('"\\u000f')) {
    //     console.log("🚨 Received msg: ", { data }, readableStrData);
    // }
    // if (readableStrData.length > 40) {
    //     console.log("🚨 Received msg: ", { data }, readableStrData);
    // }

    if (strData.includes("STATE_UPDATE�data��type�GAME_QUESTIONS")) {
        console.log("🚨📣 Received STATE_UPDATE: ", { data }, readableStrData);
        if (!room) {
            const [_roomMatch, matchedRoom] =
                strData.match(/�message-([^�]+)�/);
            room = matchedRoom;
        }
        const questions = strData.split("�_id�").slice(1);

        answers = [];

        for (const questionData of questions) {
            const [_idMatch, id] = questionData.match(/^([^�]+)�/);

            const correctAnswers = Array.from(
                questionData.matchAll(/correctã_id�([^�]+)�text�([^�]+)�/g)
            ).map(([_match, id, text]) => ({
                id,
                text,
            }));

            answers.push({ id, correctAnswers });
        }
        console.log("🚨 Found answers:", answers);
    } else if (strData.includes("DEVICES_STATES_CHANGES")) {
        // this is sent for all the 2d
        if (!is2DGame) is2DGame = true;
        // first let's check to see if this is telling us the next question
        const nextQuestionIdMatch = strData.match(
            /_nextQuestionId.changes���[^�]+�[^�]+��([^�]+)/
        );
        if (nextQuestionIdMatch != null) {
            const [_, nextQuestionId] = nextQuestionIdMatch;
            const newAnswerIndex = answers.findIndex(
                (ans) => ans.id === nextQuestionId
            );
            // console.log(
            //     "🚨📣 Received DEVICES_STATES_CHANGES, found next question id & index: ",
            //     { nextQuestionId, newAnswerIndex, strData }
            // );
            if (newAnswerIndex === -1) {
                console.error(
                    "❌ Couldn't find the next question id in the answers: ",
                    { nextQuestionId, newAnswerIndex, strData }
                );
            } else {
                answerIndex = newAnswerIndex;
            }
            // note that we don't return because we might also have to check for answers
        }
        // now let's check if it gives us the answers
        // sometimes the id comes first in the JSON, sometimes it comes at the end.
        // we handle both scenarios with this code.
        // e.g: [{"_id":"6478a86b0f02e00031b28c22","type":"mc","position":0, ...
        const indexOfMc = strData.indexOf('"type":"mc","position":0');
        if (indexOfMc === -1) {
            return;
        }
        const jsonStartIndex = strData.lastIndexOf("[", indexOfMc);
        let strDataSliced = strData.slice(jsonStartIndex);
        const jsonEndIndex = strDataSliced.indexOf('__v":0}]');
        strDataSliced = strDataSliced.slice(0, jsonEndIndex + 8);
        // console.log(
        //     "🚨📣 Received DEVICES_STATES_CHANGES, trying to read answers: ",
        //     strDataSliced
        // );

        const questions = JSON.parse(strDataSliced);
        answers = [];
        for (const question of questions) {
            const id = question["_id"];
            const correctAnswers = question.answers
                .filter((ans) => !!ans.correct)
                .map((ans) => ({ id: ans["_id"], text: ans.text }));
            answers.push({
                questionText: question["text"],
                id,
                correctAnswers,
            });
        }
        console.log("🚨 Found answers:", answers);
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
        answers.length === 0 ||
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
    const correctAns = answers.find((ans) => ans.questionText === question);
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

const sendAnswers = () => {
    if (
        !answers ||
        answers.length === 0 ||
        window.__gimkitLightningWebsocket.readyState > 1 ||
        clapping
    )
        return;

    if (answerIndex == -1) {
        console.warn("❌ Couldn't find the next question id in the answers");
        return;
    }

    const { id, correctAnswers } = answers[answerIndex];

    try {
        let sendStr;
        // TODO: handle multiple correct answers
        if (is2DGame) {
            sendStr = `\r\u00B2MESSAGE_FOR_DEVICE\u0083\u00A3key\u00A8answered\u00A8deviceId\u00B5${room}\u00A4data\u0081\u00A6answer\u00B8${correctAnswers[0].id}`;
        } else {
            sendStr = `\u0004\u0084\u00A4type\u0002\u00A4data\u0092\u00B5blueboat_SEND_MESSAGE\u0083\u00A4room\u00AE${room}\u00A3key\u00B1QUESTION_ANSWERED\u00A4data\u0082\u00AAquestionId\u00B8${id}\u00A6answer\u00B8${correctAnswers[0].id}\u00A7options\u0081\u00A8compress\u00C3\u00A3nsp\u00A1/`;
        }

        // console.log("🚨🚨🚨📧 Sending answer");
        window.__gimkitLightningWebsocket.send(
            Uint8Array.from(sendStr, (ch) => ch.charCodeAt(0))
        );
    } catch (err) {
        console.error("Error sending correct answer: " + err);
    }

    answerIndex = (answerIndex + 1) % answers.length;
};
setInterval(sendAnswers, 750);

// inject into WebSocket.send to track the game
let oldSend = WebSocket.prototype.send;
let lastTriedToCloseWebsocket = 0;
WebSocket.prototype.send = function (data) {
    // TODO: there is some bug with teleportation to 0,0 in the 2D game after the websocket reopens after our manual closure
    //       works fine if you run the bookmarklet before joining the game but not after

    // if we haven't gotten the answers after 5s, we should try to force a reconnection
    // so that Gimkit will send us the answers!
    setTimeout(() => {
        if (!answers && Date.now() - lastTriedToCloseWebsocket > 5000) {
            lastTriedToCloseWebsocket = Date.now();
            console.log("❌ Closing websocket for reconnection");
            this.close();
        }
    }, 5_000);

    const strData = JSON.stringify(decoder.decode(data), null, 2);
    if (is2DGame) {
        const deviceIdMatch = strData.match(/deviceId�([^�]+)�/);
        if (deviceIdMatch) room = deviceIdMatch[1];
    }

    // debug
    // if (!strData.slice(0, 10).includes("INPUT")) {
    //     console.log("📧 Sent msg: ", { data }, strData);
    // }

    if (window.__gimkitLightningWebsocket != this) {
        this.addEventListener("message", onWsMessage.bind(this));
        window.__gimkitLightningWebsocket = this;
        console.log("✅ Bound to websocket");
    }

    return oldSend.call(this, data);
};
