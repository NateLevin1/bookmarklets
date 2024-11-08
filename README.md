# bookmarklets

All of my custom bookmarklets. Completely free &amp; MIT Licensed.

## Download

You can download the latest version of each bookmarklet by going to the links below.

-   [🔇 Adbloq: Instantly remove all ads on a page][adbloq]
-   [⏱ AnySpeed: Easily change video speed, even on sites that prevent you!][anyspeed]
-   [📵 No YT Shorts: Converts YouTube Shorts URLs to regular YouTube URLs][no-yt-shorts]
-   [🌫️ Unblur All: Remove blurring to bypass paywalls][unblur-all]
-   [🔲 Open PiP: Open Picture-in-Picture on the first video on the page.][open-pip]
-   [⚡️ Gimkit Lightning: Auto-answer questions on Gimkit][gimkit-lightning]
-   [🚫 AP Classroom Eliminator: Easily eliminate answer choices on AP Classroom][ap-classroom-eliminator]
-   [❄️ Gimkit Snowbrall Trick][gimkit-snowbrall-trick]
-   [🪛 Remove R&W Toolbar][remove-rw]

## Contributing

This project accepts code contributions. To prepare the development environment, clone the repo and run `npm i`. You can then build all bookmarklets using `npm run build`.

Alternatively, you can use `npm run dev [filename].js` to build the bookmarklet and then open the install page in the browser. This is useful for development.

[adbloq]: https://install-bookmarklet.pages.dev/?url=javascript:!function()%7Bconsole.log(%22Activated%20%F0%9F%94%87%20AdBloq%20bookmarklet.%22)%3Bconst%20rm%3Dfunction(e)%7Bfor(const%20o%20of%20e)o.remove()%7D%2CremoveAds%3De%3D%3E%7Brm(e.querySelectorAll(%5B%22*%5Bid*%3D-ad-%5D%22%2C%22*%5Bclass*%3D-ad-%5D%22%2C%22*%5Bid*%3D_ad_%5D%22%2C%22*%5Bclass*%3D_ad_%5D%22%2C%22*%5Bid*%3D-ads-%5D%22%2C%22*%5Bclass*%3D-ads-%5D%22%2C%22*%5Bid*%3D_ads_%5D%22%2C%22*%5Bclass*%3D_ads_%5D%22%2C%22*%5Bid%5E%3Dad_%5D%22%2C%22*%5Bid%5E%3Dad-%5D%22%2C%22*%5Bid%5E%3Dads_%5D%22%2C%22*%5Bid%5E%3Dads-%5D%22%2C%22*%5Bid*%3Dgoogle_ad%5D%22%2C%22*%5Bclass*%3Dgoogle_ad%5D%22%2C%22*%5Bdata-google-query-id%5D%22%2C%22*%5Bdata-google-av-adk%5D%22%2C%22*%5Baria-label*%3DAdvertisement%5D%22%2C'iframe%5Btitle*%3D%22%20ad%20%22%5D'%2C%22cnx%22%2C%22.GoogleActiveViewElement%22%2C%22.GoogleActiveViewInnerContainer%22%2C%22iframe%5Bid%5E%3DadRoot%5D%22%2C%22video%5Bsrc*%3DAniview%5D%22%2C%22iframe%5BsrcDoc*%3Dceltra%5D%22%2C%22*%5Bclass*%3Dbx-campaign%5D%22%2C%22.ads-mode%22%2C%22video%5Bsrc*%3Dadnxs-simple%5D%22%2C%22*%5Bdata-text-ad%5D%22%2C%22*%5Bclass*%3Dprimisslate%5D%22%2C%22*%5Bid*%3Dprimis_%5D%22%2C%22*%5Btitle*%3DPrimis%5D%22%2C%22*%5Bdata-ad-unit-name%5D%22%2C%22*%5Bid*%3Dtaboola%5D%22%2C%22*%5Bclass*%3Dtaboola%5D%22%2C%22phoenix-outbrain%22%5D.join(%22%2C%22)))%3Be%3Dwindow.location.hostname%3Be.endsWith(%22wikipedia.org%22)%3Fdocument.querySelector(%22div%5Baria-label%5E%3Dfundraising%5D%22)%3F.querySelector(%22.frb-inline-close%22)%3F.click%3F.()%3Ae.endsWith(%22sporcle.com%22)%26%26document.querySelector(%22.avp-p-cn-close%22)%3F.click%3F.()%7D%2Cobserver%3Dnew%20MutationObserver(e%3D%3E%7Bfor(const%20o%20of%20e)o.addedNodes%26%26o.addedNodes.forEach(e%3D%3EremoveAds(e.parentElement))%7D)%3Bobserver.observe(document.body%2C%7BchildList%3A!0%2Csubtree%3A!0%7D)%2Cdocument.documentElement.children.length%3C%3D2%3FremoveAds(document.body)%3AremoveAds(document.documentElement)%3B%7D()&name=%F0%9F%94%87%20AdBloq
[gimkit-snowbrall-trick]: https://install-bookmarklet.pages.dev/?url=javascript:!function()%7Bif(!window.location.hostname.endsWith(%22gimkit.com%22))throw%20alert(%22This%20bookmarklet%20only%20works%20on%20gimkit.com!%22)%2Cnew%20Error(%22This%20bookmarklet%20only%20works%20on%20gimkit.com!%22)%3Blet%20oldPush%3DArray.prototype.push%2Cgame%3BArray.prototype.push%3Dfunction(...arguments)%7Breturn(this%5B0%5D%3F.scene%7C%7Cthis%5B0%5D%3F.gameObject%3F.scene)%26%26(game%3Dthis%5B0%5D%3F.scene%3F.game%3F%3Fthis%5B0%5D.gameObject.scene.game%2Cwindow.phaserGame%3Dgame%2Cconsole.log(%22%25cSuccessfully%20found%20Phaser%20game!%22%2C%22color%3A%20green%22)%2CArray.prototype.push%3DoldPush)%2ColdPush.call(this%2C...arguments)%7D%3Bconst%20move%3D(e%2Co%2Cs)%3D%3E%7BphaserGame.scene.scenes%5B0%5D.worldManager.physics.bodiesManager.movableBodies%5B0%5D.pos%5Bo%5D%2B%3Ds%3F48%3A-48%2Ce%3C5%26%26setTimeout(()%3D%3Emove(e%2B1%2Co%2Cs)%2C115)%7D%3Bwindow.onkeydown%3De%3D%3E%7Bswitch(e.key.toLowerCase())%7Bcase%22j%22%3Amove(0%2C%22x%22%2C!0)%3Bbreak%3Bcase%22g%22%3Amove(0%2C%22x%22%2C!1)%3Bbreak%3Bcase%22y%22%3Amove(0%2C%22y%22%2C!1)%3Bbreak%3Bcase%22h%22%3Amove(0%2C%22y%22%2C!0)%7D%7D%3B%7D()&name=%E2%9D%84%EF%B8%8F%20Gimkit%20Snowbrall%20Trick
[anyspeed]: https://install-bookmarklet.pages.dev/?url=javascript:!function()%7Bconst%20domain%3Dwindow.location.hostname%3Bif(%22drive.google.com%22%3D%3D%3Ddomain)%7Bconst%20a%3Ddocument.getElementById(%22drive-viewer-video-player-object-0%22)%3Bthrow%20alert(%22Please%20re-activate%20AnySpeed%20in%20the%20URL%20that%20will%20open%20shortly%22)%2Cwindow.open(a.src%2C%22_blank%22)%2Cnew%20Error(%22Can't%20use%20AnySpeed%20on%20Google%20Drive.%22)%7Dconst%20videos%3DArray.from(document.querySelectorAll(%22video%22))%2CnewPlaybackRate%3DNumber(prompt(%22What%20rate%20do%20you%20want%3F%22))%3Bif(!newPlaybackRate%7C%7CisNaN(newPlaybackRate))throw%20new%20Error(%22Canceled%20change%20of%20playback%20rate%22)%3Bwindow.anySpeedPlaybackRate%3DnewPlaybackRate%3Bconst%20timeWhenChanged%3DDate.now()%3Bfor(const%20b%20of%20videos)b.playbackRate%3DnewPlaybackRate%2Cb.addEventListener(%22ratechange%22%2C()%3D%3E%7Bvar%20e%3DDate.now()-timeWhenChanged%3Bb.playbackRate!%3DnewPlaybackRate%26%26e%3C500%26%26(console.info(%22%E2%8F%B1%20AnySpeed%20-%20This%20website%20is%20automatically%20changing%20the%20playback%20speed...%20Bypassing%20the%20defenses!%22)%2CrepeatedlySpeedUp(b))%7D)%3Bfunction%20repeatedlySpeedUp(e)%7Be.playbackRate%3Dwindow.anySpeedPlaybackRate%2CrequestAnimationFrame(()%3D%3ErepeatedlySpeedUp(e))%7Dconst%20possibleYouTubePlayers%3DArray.from(document.querySelectorAll(%22iframe%5Bsrc*%3D'youtube.com'%5D%2C%20iframe%5Bsrc*%3D'youtubeeducation.com'%5D%22))%3Bfor(const%20e%20of%20possibleYouTubePlayers)try%7Be%3F.contentWindow%3F.postMessage%26%26repeatedlySendYouTubeMessage(e)%7Dcatch(e)%7Bconsole.error(%22AnySpeed%20detected%20YouTube%20on%20this%20page%2C%20but%20something%20went%20wrong%20controlling%20the%20speed%3A%20%22%2Ce)%7Dfunction%20repeatedlySendYouTubeMessage(e)%7Bvar%20a%3D%7Bevent%3A%22command%22%2Cfunc%3A%22setPlaybackRate%22%2Cargs%3A%5Bwindow.anySpeedPlaybackRate%5D%2Cid%3A1%2Cchannel%3A%22widget%22%7D%3Be.contentWindow.postMessage(JSON.stringify(a)%2C%22*%22)%2CrequestAnimationFrame(()%3D%3ErepeatedlySendYouTubeMessage(e))%7D%7D()&name=%E2%8F%B1%20AnySpeed
[no-yt-shorts]: https://install-bookmarklet.pages.dev/?url=javascript:!function()%7Bif(!window.location.href.includes(%22youtube.com%2Fshorts%22))throw%20alert(%22You%20are%20not%20browsing%20a%20short%20right%20now.%22)%2Cnew%20Error(%22Not%20on%20YT%20Shorts%22)%3Bwindow.location.href%3Dwindow.location.href.replace(%22youtube.com%2Fshorts%2F%22%2C%22youtube.com%2Fwatch%3Fv%3D%22)%3B%7D()&name=%F0%9F%93%B5%20No%20YT%20Shorts
[gimkit-lightning]: https://install-bookmarklet.pages.dev/?url=javascript:!function()%7Blet%20answers%3Dnull%2Croom%3Dnull%2Cis2DGame%3D!1%2CanswerIndex%3D0%3Bif(!window.location.hostname.endsWith(%22gimkit.com%22))throw%20alert(%22This%20bookmarklet%20only%20works%20on%20gimkit.com!%22)%2Cnew%20Error(%22This%20bookmarklet%20only%20works%20on%20gimkit.com!%22)%3BshowStatusMsg(%22Started.%20Take%20any%20action%20to%20begin%20injection.%22)%3Bconst%20decoder%3Dnew%20TextDecoder(%22utf-8%22)%2ConWsMessage%3Dfunction(t)%7Bvar%20t%3Dt%5B%22data%22%5D%2Cn%3Ddecoder.decode(t)%2Cs%3DJSON.stringify(n%2Cnull%2C2)%3Bif(n.includes(%22STATE_UPDATE%EF%BF%BDdata%EF%BF%BD%EF%BF%BDtype%EF%BF%BDGAME_QUESTIONS%22))%7Bconsole.log(%22%F0%9F%9A%A8%F0%9F%93%A3%20Received%20STATE_UPDATE%3A%20%22%2C%7Bdata%3At%7D%2Cs)%2Croom%7C%7C(%5Be%2Ct%5D%3Dn.match(%2F%EF%BF%BDmessage-(%5B%5E%EF%BF%BD%5D%2B)%EF%BF%BD%2F)%2Croom%3Dt)%3Bvar%20e%2Cs%3Dn.split(%22%EF%BF%BD_id%EF%BF%BD%22).slice(1)%3Banswers%3D%5B%5D%3Bfor(const%20l%20of%20s)%7Bvar%5B%2Co%5D%3Dl.match(%2F%5E(%5B%5E%EF%BF%BD%5D%2B)%EF%BF%BD%2F)%2Ca%3DArray.from(l.matchAll(%2Fcorrect%C3%A3_id%EF%BF%BD(%5B%5E%EF%BF%BD%5D%2B)%EF%BF%BDtext%EF%BF%BD(%5B%5E%EF%BF%BD%5D%2B)%EF%BF%BD%2Fg)).map((%5B%2Ce%2Ct%5D)%3D%3E(%7Bid%3Ae%2Ctext%3At%7D))%3Banswers.push(%7Bid%3Ao%2CcorrectAnswers%3Aa%7D)%7Dconsole.log(%22%F0%9F%9A%A8%20Found%20answers%3A%22%2Canswers)%2CshowStatusMsg(%22Found%20answers.%20Beginning%20auto-answer.%22)%7Delse%20if(n.includes(%22DEVICES_STATES_CHANGES%22))%7Bis2DGame%3Dis2DGame%7C%7C!0%3Bt%3Dn.match(%2F_nextQuestionId.changes%EF%BF%BD%EF%BF%BD%EF%BF%BD%5B%5E%EF%BF%BD%5D%2B%EF%BF%BD%5B%5E%EF%BF%BD%5D%2B%EF%BF%BD%EF%BF%BD(%5B%5E%EF%BF%BD%5D%2B)%2F)%3Bif(null!%3Dt)%7Bconst%5B%2Cd%5D%3Dt%3Bs%3Danswers.findIndex(e%3D%3Ee.id%3D%3D%3Dd)%3B-1%3D%3D%3Ds%3Fconsole.error(%22%E2%9D%8C%20Couldn't%20find%20the%20next%20question%20id%20in%20the%20answers%3A%20%22%2C%7BnextQuestionId%3Ad%2CnewAnswerIndex%3As%2CstrData%3An%7D)%3AanswerIndex%3Ds%7Dt%3Dn.indexOf('%22type%22%3A%22mc%22%2C%22position%22%3A0')%3Bif(-1!%3D%3Dt)%7Bs%3Dn.lastIndexOf(%22%5B%22%2Ct)%3Blet%20e%3Dn.slice(s)%3Bt%3De.indexOf('__v%22%3A0%7D%5D')%2Cn%3D(e%3De.slice(0%2Ct%2B8)%2CJSON.parse(e))%3Banswers%3D%5B%5D%3Bfor(const%20c%20of%20n)%7Bvar%20i%3Dc._id%2Cr%3Dc.answers.filter(e%3D%3E!!e.correct).map(e%3D%3E(%7Bid%3Ae._id%2Ctext%3Ae.text%7D))%3Banswers.push(%7BquestionText%3Ac.text%2Cid%3Ai%2CcorrectAnswers%3Ar%7D)%7Dconsole.log(%22%F0%9F%9A%A8%20Found%20answers%3A%22%2Canswers)%2CshowStatusMsg(%22Found%20answers.%20Answer%20a%20question%20to%20begin%20auto-answer%2C%20press%20'b'%20to%20toggle.%22)%7D%7D%7D%3Blet%20clapping%3D!1%3Bconst%20clickRepeatedly%3De%3D%3E%7Be.click()%2CrequestAnimationFrame(()%3D%3EclickRepeatedly(e))%7D%2Cgame2DInterval%3D()%3D%3E%7Bif(is2DGame%26%26answers%26%260!%3D%3Danswers.length%26%26!(1%3Cwindow.__gimkitLightningWebsocket.readyState)%26%26!clapping)%7Bvar%20e%3Ddocument.evaluate(%22%2F%2Fdiv%5Btext()%3D'Continue'%5D%22%2Cdocument%2Cnull%2CXPathResult.FIRST_ORDERED_NODE_TYPE%2Cnull).singleNodeValue%3Bif(e)e.click()%2Ce.parentElement.style.color%3D%22yellow%22%2Ce.parentElement.parentElement.parentElement.style.transform%3D%22scale(99)%22%3Belse%7Bvar%20e%3Ddocument.evaluate(%22%2F%2Fspan%5Btext()%3D'Fish%20Again'%5D%22%2Cdocument%2Cnull%2CXPathResult.FIRST_ORDERED_NODE_TYPE%2Cnull).singleNodeValue%2Ct%3D(e%26%26!document.evaluate(%22%2F%2Fdiv%5Bcontains(text()%2C'However%2C%20your%20backpack%20cannot%20carry%20more%20of%20this%20fish.')%5D%22%2Cdocument%2Cnull%2CXPathResult.FIRST_ORDERED_NODE_TYPE%2Cnull).singleNodeValue%26%26e.click()%2CArray.from(document.querySelectorAll(%22.notranslate.lang-en%22)))%3Bif(0!%3D%3Dt.length)%7Bconst%20n%3Dt%5B0%5D.textContent%3Be%3Danswers.find(e%3D%3Ee.questionText%3D%3D%3Dn)%3Bif(e)for(const%20s%20of%20e.correctAnswers)for(const%20o%20of%20t)o.textContent%3D%3D%3Ds.text%26%26(o.click()%2Co.parentElement.style.color%3D%22yellow%22%2Co.parentElement.parentElement.parentElement.parentElement.parentElement.style.transform%3D%22scale(99)%22)%3Belse%20console.warn(%22Encountered%20a%20question%20that%20we%20don't%20know%3A%20%22%2Bn)%7D%7D%7D%7D%2CclapChecker%3D(setInterval(game2DInterval%2C50)%2C()%3D%3E%7Bvar%20e%3Ddocument.querySelector(%22div.animated.pulse.infinite%22)%3Be%26%26e.textContent.startsWith(%22%F0%9F%91%8F%22)%26%26(console.log(%22Game%20over!%22)%2CclickRepeatedly(e)%2Cclapping%3D!0)%7D)%3BsetInterval(clapChecker%2C250)%3Blet%20disableSendAnswers%3D!1%3Bwindow.addEventListener(%22keydown%22%2Ce%3D%3E%7B%22b%22%3D%3De.key%26%26(answers%3FshowStatusMsg((disableSendAnswers%3D!disableSendAnswers)%3F%22Auto-Answer%20Disabled%22%3A%22Auto-Answer%20Enabled%22)%3AshowStatusMsg(%22Answers%20not%20found%20yet.%20Answer%20a%20question%20to%20begin%20auto-answer.%22))%7D)%3Bconst%20sendAnswers%3D()%3D%3E%7Bif(!(disableSendAnswers%7C%7C!answers%7C%7C0%3D%3D%3Danswers.length%7C%7C1%3Cwindow.__gimkitLightningWebsocket.readyState%7C%7Cclapping))if(-1%3D%3DanswerIndex)console.warn(%22%E2%9D%8C%20Couldn't%20find%20the%20next%20question%20id%20in%20the%20answers%22)%3Belse%7Bvar%7Bid%3At%2CcorrectAnswers%3An%7D%3Danswers%5BanswerIndex%5D%3Btry%7Blet%20e%3Be%3Dis2DGame%3F%60%5Cr%C2%B2MESSAGE_FOR_DEVICE%C2%83%C2%A3key%C2%A8answered%C2%A8deviceId%C2%B5%24%7Broom%7D%C2%A4data%C2%81%C2%A6answer%C2%B8%60%2Bn%5B0%5D.id%3A%60%04%C2%84%C2%A4type%02%C2%A4data%C2%92%C2%B5blueboat_SEND_MESSAGE%C2%83%C2%A4room%C2%AE%24%7Broom%7D%C2%A3key%C2%B1QUESTION_ANSWERED%C2%A4data%C2%82%C2%AAquestionId%C2%B8%24%7Bt%7D%C2%A6answer%C2%B8%24%7Bn%5B0%5D.id%7D%C2%A7options%C2%81%C2%A8compress%C3%83%C2%A3nsp%C2%A1%2F%60%2Cwindow.__gimkitLightningWebsocket.send(Uint8Array.from(e%2Ce%3D%3Ee.charCodeAt(0)))%7Dcatch(e)%7Bconsole.error(%22Error%20sending%20correct%20answer%3A%20%22%2Be)%7DanswerIndex%3D(answerIndex%2B1)%25answers.length%7D%7D%3BsetInterval(sendAnswers%2C750)%3Blet%20oldSend%3DWebSocket.prototype.send%2ClastTriedToCloseWebsocket%3D0%3Bfunction%20showStatusMsg(e)%7Bdocument.getElementById(%22gimkit-lightning-overlay%22)%3F.remove()%3Bvar%20t%3Ddocument.createElement(%22div%22)%3Bt.id%3D%22gimkit-lightning-overlay%22%2Ct.style.position%3D%22fixed%22%2Ct.style.top%3D%220%22%2Ct.style.left%3D%220%22%2Ct.style.width%3D%22100%25%22%2Ct.style.height%3D%225rem%22%2Ct.style.backgroundColor%3D%22rgba(0%2C%200%2C%200%2C%200.5)%22%2Ct.style.color%3D%22white%22%2Ct.style.display%3D%22flex%22%2Ct.style.justifyContent%3D%22center%22%2Ct.style.alignItems%3D%22center%22%2Ct.style.zIndex%3D%22999999999%22%2Ct.style.pointerEvents%3D%22none%22%2Ct.style.fontSize%3D%221.3em%22%2Ct.textContent%3D%22%E2%9A%A1%EF%B8%8F%20Gimkit%20Lightning%3A%20%22%2Be%2Cdocument.body.appendChild(t)%2Ct.animate(%7Bopacity%3A%5B1%2C0%5D%7D%2C%7Bdelay%3A3e3%2Cduration%3A1e3%2Ceasing%3A%22ease-in-out%22%2Cfill%3A%22forwards%22%7D)%7DWebSocket.prototype.send%3Dfunction(e)%7BsetTimeout(()%3D%3E%7B!answers%26%265e3%3CDate.now()-lastTriedToCloseWebsocket%26%26(lastTriedToCloseWebsocket%3DDate.now()%2Cconsole.log(%22%E2%9D%8C%20Closing%20websocket%20for%20reconnection%22)%2Cthis.close())%7D%2C5e3)%3Bvar%20t%3DJSON.stringify(decoder.decode(e)%2Cnull%2C2)%3Breturn%20is2DGame%26%26(t%3Dt.match(%2FdeviceId%EF%BF%BD(%5B%5E%EF%BF%BD%5D%2B)%EF%BF%BD%2F))%26%26(room%3Dt%5B1%5D)%2Cwindow.__gimkitLightningWebsocket!%3Dthis%26%26(this.addEventListener(%22message%22%2ConWsMessage.bind(this))%2Cwindow.__gimkitLightningWebsocket%3Dthis%2Cconsole.log(%22%E2%9C%85%20Bound%20to%20websocket%22))%2ColdSend.call(this%2Ce)%7D%3B%7D()&name=%E2%9A%A1%EF%B8%8F%20Gimkit%20Lightning
[ap-classroom-eliminator]: https://install-bookmarklet.pages.dev/?url=javascript:!function()%7Bconst%20answers%3DArray.from(document.querySelectorAll(%22.lrn-label%22))%3Bfor(const%20a%20of%20answers)if(!a.querySelector(%22.eliminator%22))%7Bconst%20b%3Ddocument.createElement(%22button%22)%3Bb.style.color%3D%22red%22%2Cb.style.fontSize%3D%221.4em%22%2Cb.style.height%3D%2226px%22%2Cb.style.width%3D%2226px%22%2Cb.style.display%3D%22flex%22%2Cb.style.justifyContent%3D%22center%22%2Cb.style.alignItems%3D%22center%22%2Cb.textContent%3D%22%F0%90%84%82%22%2Cb.classList.add(%22eliminator%22)%2Cb.onclick%3Dt%3D%3E%7Bt.stopPropagation()%2C.4%3D%3Da.style.opacity%3F(a.style.opacity%3D1%2Ca.style.textDecoration%3D%22none%22)%3A(a.style.opacity%3D.4%2Ca.style.textDecoration%3D%22line-through%22)%7D%2Ca.appendChild(b)%7D%7D()&name=%F0%9F%9A%AB%20AP%20Classroom%20Eliminator
[remove-rw]: https://install-bookmarklet.pages.dev/?url=javascript:!function()%7Bdocument.querySelector(%22gw-toolbar%22)%3F.remove()%2Cdocument.querySelector(%22gw-toolbarear%22)%3F.remove()%3B%7D()&name=%F0%9F%AA%9B%20Remove%20R%26W%20Toolbar
[unblur-all]: https://install-bookmarklet.pages.dev/?url=javascript:!function()%7Bconst%20style%3Ddocument.createElement(%22style%22)%3Bstyle.textContent%3D%60%0A%20%20*%20%7B%0A%20%20%20%20filter%3A%20none%20!important%3B%0A%20%20%20%20backdrop-filter%3A%20none%20!important%3B%0A%20%20%20%20-webkit-backdrop-filter%3A%20none%20!important%3B%0A%20%20%7D%0A%60%2Cdocument.head.appendChild(style)%3B%7D()&name=%F0%9F%8C%AB%EF%B8%8F%20Unblur%20All
[open-pip]: https://install-bookmarklet.pages.dev/?url=javascript:!function()%7Bconst%20video%3Ddocument.querySelector(%22video%22)%3Bif(!video)throw%20alert(%22No%20video%20found%20on%20the%20page.%22)%2Cnew%20Error(%22No%20video%20found%20on%20the%20page.%22)%3Bconst%20element%3Ddocument.createElement(%22div%22)%3Belement.style.cssText%3D%22position%3A%20fixed%3B%20top%3A%200%3B%20left%3A%200%3B%20right%3A%200%3B%20bottom%3A%200%3B%20background%3A%20rgba(0%2C%200%2C%200%2C%200.5)%3B%20z-index%3A%209999%3B%20display%3A%20flex%3B%20justify-content%3A%20center%3B%20align-items%3A%20center%3B%20color%3A%20white%3B%20font-size%3A%202rem%3B%22%2Celement.textContent%3D%22Click%20to%20open%20Picture-in-Picture%22%2Cdocument.body.appendChild(element)%2Cdocument.addEventListener(%22click%22%2C()%3D%3E%7Belement.remove()%2Cvideo.requestPictureInPicture()%7D%2C%7Bonce%3A!0%7D)%3B%7D()&name=%F0%9F%94%B2%20Open%20PiP
