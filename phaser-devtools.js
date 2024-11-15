//
// name: 🛟 Phaser DevTools
// author: Nate Levin (https://natelev.in)
//

console.log("Activated 🛟 Phaser DevTools bookmarklet.");

if (!window.Phaser)
    throw new Error("This page does not expose any Phaser object :(");

if (window.__phaser_devtools_injected)
    throw new Error("Phaser DevTools are already injected into this page.");

window.__phaser_devtools_injected = true;

// inject into .push to find a scene
let oldPush = Array.prototype.push;
let game;
Array.prototype.push = function (...arguments) {
    if (!!this?.[0]?.scene?.game || !!this?.[0]?.gameObject?.scene?.game) {
        game = this[0]?.scene?.game ?? this[0].gameObject.scene.game;
        window.phaserGame = game; // allow editing from devtools console
        console.log(`%cSuccessfully found Phaser game!`, "color: green");
        console.log(
            `%cRunning Phaser DevTools v0.1.0, Phaser v${Phaser.VERSION}`,
            "color: rebeccapurple"
        );
        Array.prototype.push = oldPush;
        startDevTools(game);
    }

    return oldPush.call(this, ...arguments);
};

// tell user to interact with game to try to trigger the injector
setTimeout(() => {
    if (!game)
        alert("Unable to quickly inject. Try interacting with the game!");
}, 2_000);

function startDevTools(game) {
    console.log("%cStarting Phaser DevTools...", "color: gray");
    game.scene.add("__phaser-devtools", PhaserDevTools, true);
}

// this manages all the devtools. only 1 should be loaded at a time
class PhaserDevTools extends Phaser.Scene {
    enabled = false;
    inspectOptions = {};

    constructor() {
        super();
    }
    preload() {}
    create() {
        if (!this.sys.game.device.os.desktop) {
            alert(
                'Please note that Phaser DevTools is not optimized for use on non-desktop browsers. Press "OK" to continue.'
            );
        }

        // add in the enable/disabler
        if (!game.domContainer) {
            // we have to add a domContainer if it doesn't exist!
            // ! this could be the source of compatibility problems
            game.domContainer = document.createElement("div");
            /**
             * Below originally from Phaser source -- CreateDOMContainerConfig.js:21, ScaleManager.js:609
             * With edits by Nate Levin
             * @author       Richard Davey <rich@photonstorm.com>
             * @copyright    2022 Photon Storm Ltd.
             * @license      {@link https://opensource.org/licenses/MIT|MIT License}
             */
            game.domContainer.style.cssText = [
                "display: block;",
                "width: " + game.canvas.clientWidth + "px;",
                "height: " + game.canvas.clientHeight + "px;",
                "padding: 0;",
                "margin: 0;",
                `margin-top: ${game.canvas.style.marginTop};`,
                `margin-left: ${game.canvas.style.marginLeft};`,
                "position: absolute;",
                "overflow: hidden;",
                "pointer-events: " +
                    (game.config.domPointerEvents ?? "none") +
                    ";",
                "transform: scale(1);",
                "transform-origin: left top;",
                "z-index: 999999999",
            ].join(" ");

            phaserGame.canvas.parentNode.prepend(game.domContainer);

            // get everything back in sync, shouldn't be needed but kept for compat
            game.scale.refresh();

            console.log(
                "Created DOM container as it didn't exist:",
                game.domContainer
            );
        }

        this.addOptionsDOMElements();

        if (!!HoverPipeline) {
            this.sys.game.renderer.pipelines.addPostPipeline(
                HoverPipeline.KEY,
                HoverPipeline
            );
        }

        console.log(
            "%c⭐️🧑‍💻 Phaser DevTools loaded successfully!",
            "color: green; font-size: 1.2em; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
        );

        if (!window.Phaser.Renderer.WebGL.Pipelines.PostFXPipeline)
            console.error(
                new Error(
                    "This Phaser game is too outdated! Must be on Phaser >3.5, this game is running " +
                        Phaser.VERSION +
                        ". Not all features will be supported!"
                )
            );
    }
    update(time, delta) {
        if (this.enabled) {
            this.loadAllGameObjects();
        }
    }
    addOptionsDOMElements() {
        const options = document.createElement("div");
        options.oncontextmenu = (event) => {
            // prevent stopping right clicking
            event.stopImmediatePropagation();
        };
        const optionsPhaser = this.add.dom(
            0,
            0,
            options,
            `width: 75px; height: 75px; opacity: 0.75; backdrop-filter: blur(2px); overflow: hidden; padding: 16px; border-radius: 0px 0px 53px 0px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; box-sizing: content-box;
            background-image: linear-gradient(45deg, hsl(219deg 100% 18% / 0.2) 0%, hsl(307deg 56% 28% / 0.2) 25%, hsl(343deg 60% 43% / 0.2) 50%, hsl(19deg 65% 48% / 0.2) 75%, hsl(49deg 100% 38% / 0.2) 100%);`
        );
        optionsPhaser.setOrigin(0, 0);
        optionsPhaser.setAlpha(0.75);
        optionsPhaser.setDepth(1);

        const header = document.createElement("div");
        header.style.cssText = "position: relative; width: 100%;";
        options.appendChild(header);

        const headerText = document.createElement("p");
        headerText.textContent = "Phaser DevTools";
        headerText.style.cssText =
            "font-size: 27px; color: white; position: absolute; right: 10px; opacity: 0; top: -150px; filter: drop-shadow(1px 1px 1px black); margin: 0;";

        const enabler = document.createElement("button");
        enabler.style.cssText = `width: 70px; height: 70px; border-radius: 99999px; backdrop-filter: blur(10px); filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.5)); border: none; outline: none; cursor: pointer; display: grid; place-items: center; font-size: 32px;
        background-image: linear-gradient(45deg, hsl(240deg 100% 20%) 0%, hsl(289deg 100% 21%) 6%, hsl(315deg 100% 27%) 14%, hsl(329deg 100% 36%) 23%, hsl(337deg 100% 43%) 35%, hsl(357deg 91% 59%) 47%, hsl(17deg 100% 59%) 60%, hsl(34deg 100% 53%) 74%, hsl(45deg 100% 50%) 88%, hsl(55deg 100% 50%) 100%);`;
        enabler.textContent = "🛟";
        enabler.onclick = () => {
            this.enabled = !this.enabled;

            if (this.inspectOptions.gameObject) {
                this.stopInspect();
            }

            const animOpts = {
                easing: "ease-out",
                duration: 300,
                fill: "forwards",
            };
            if (this.enabled) {
                options.animate(
                    [{ opacity: 1, width: "300px", height: "300px" }],
                    animOpts
                );
                headerText.animate([{ opacity: 1, top: "18px" }], animOpts);
            } else {
                options.animate(
                    [{ opacity: 0.75, width: "75px", height: "75px" }],
                    animOpts
                );
                headerText.animate([{ opacity: 0, top: "-150px" }], animOpts);
            }
        };
        this.input.addListener("pointerdown", () => {
            // allow users to press the spacebar without closing/opening the menu
            if (document.activeElement === enabler) {
                enabler.blur();
            }
        });

        header.appendChild(enabler);
        header.appendChild(headerText);

        const scrollableOptions = document.createElement("div");
        scrollableOptions.style.cssText =
            "overflow-y: auto; height: 215px; margin-top: 20px;";
        options.appendChild(scrollableOptions);

        scrollableOptions.appendChild(
            makeInfoText(
                "Injected successfully. You can now use `phaserGame` in the DevTools console to access the Phaser Game object."
            )
        );

        scrollableOptions.append(
            makeInfoText(
                "ℹ️ Shift+Click on a GameObject to lock/unlock the inspector",
                "margin: 10px 0;"
            )
        );

        this.inspector = document.createElement("div");
        this.inspector.style.marginTop = "20px";
        this.inspector.style.padding = "5px";
        this.inspector.style.border = "1px dotted white";

        this.inspectorText = makeInfoText("Inspector - Nothing Selected");
        this.inspector.append(this.inspectorText);

        this.inspectorItems = document.createElement("div");
        this.inspector.append(this.inspectorItems);

        scrollableOptions.append(this.inspector);

        this.scrollableOptions = scrollableOptions;

        setTimeout(() => {
            enabler.click();
        }, 300);
    }
    loadAllGameObjects() {
        this.forAllGameObjects((gameObject) => {
            const alreadyDebugging = gameObject.getData(
                "__phaser_devtools_loaded"
            );

            if (!alreadyDebugging && gameObject.active) {
                gameObject.setData("__phaser_devtools_loaded", true);
                if (!gameObject.input) {
                    gameObject.setInteractive();
                    if (gameObject.depth === 0) {
                        gameObject.setDepth(-1);
                    }
                }

                gameObject.addListener("pointerover", () => {
                    if (
                        this.enabled &&
                        !this.inspectOptions.locked &&
                        !isBackgroundItem(gameObject, this.sys)
                    )
                        this.inspect(gameObject, {
                            locked: false,
                        });
                });
                gameObject.addListener("pointerout", () => {
                    if (
                        this.enabled &&
                        this.inspectOptions.gameObject === gameObject &&
                        !this.inspectOptions.locked &&
                        !isBackgroundItem(gameObject, this.sys)
                    )
                        this.stopInspect();
                });
                gameObject.addListener("destroy", () => {
                    if (this.inspectOptions.gameObject === gameObject) {
                        this.stopInspect();
                    }
                });
                gameObject.addListener("pointerdown", (pointer) => {
                    if (pointer.event.shiftKey && this.enabled) {
                        // lock inspector
                        this.inspectOptions.locked =
                            !this.inspectOptions.locked;

                        if (
                            !this.inspectOptions.locked &&
                            this.inspectOptions.gameObject
                        ) {
                            this.stopInspect();
                        }
                    }
                });
            }
        });
    }
    inspect(gameObject, options = {}) {
        if (this.inspectOptions.gameObject) {
            this.stopInspect();
        }
        window.$gameObject = gameObject;
        this.inspectOptions = { gameObject, ...options };

        if (!!HoverPipeline && gameObject.setPostPipeline) {
            gameObject.setPostPipeline(HoverPipeline.KEY);
        }
        this.inspectorText.textContent =
            "Inspector - " +
            gameObject.type +
            (!!gameObject.name ? " - " + gameObject.name : "");

        if (gameObject.state) {
            this.inspectorItems.append(
                makeInfoText("State: " + gameObject.state)
            );
        }

        const dataValuesWithoutPhaserDevTools = gameObject.data.values
            ? Object.fromEntries(
                  Object.entries(gameObject.data.values).filter(
                      ([key, _value]) => !key.startsWith("__phaser_devtools")
                  )
              )
            : undefined;
        if (
            dataValuesWithoutPhaserDevTools &&
            Object.keys(dataValuesWithoutPhaserDevTools).length > 0
        ) {
            this.inspectorItems.append(
                makeInfoText(
                    "Data Values: " +
                        JSON.stringify(
                            dataValuesWithoutPhaserDevTools,
                            null,
                            2
                        ),
                    "white-space: pre-wrap;"
                )
            );
        }
    }
    stopInspect() {
        if (this.inspectOptions.gameObject.resetPostPipeline) {
            this.inspectOptions.gameObject.resetPostPipeline();
        }
        this.inspectOptions = {};
        this.inspectorText.textContent = "Inspector - Nothing Selected";
        while (this.inspectorItems.firstChild) {
            this.inspectorItems.removeChild(this.inspectorItems.firstChild);
        }
    }
    forAllGameObjects(callback) {
        const scenes = this.getActiveScenes();
        scenes.forEach((scene) => scene.children.list.forEach(callback));
    }
    getActiveScenes() {
        return game.scene
            .getScenes(true)
            .filter((scene) => !(scene instanceof PhaserDevTools));
    }
}

function makeInfoText(text, css = "") {
    const node = document.createElement("p");
    node.style.cssText =
        "margin: 2px 0; color: white; filter: drop-shadow(1px 1px 1px black);" +
        css;
    node.textContent = text;
    return node;
}

// shaders
let HoverPipeline;
if (!!window.Phaser.Renderer.WebGL.Pipelines.PostFXPipeline) {
    HoverPipeline = class HoverPipeline extends (
        Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
    ) {
        static KEY = "__phaser_devtools_hover";

        constructor(game) {
            super({
                game: game,
                renderer: game.renderer,
                /**
 * Unminified shader:
#define SHADER_NAME PHASER_DEVTOOLS_HOVER
precision mediump float;
uniform sampler2D uMainSampler;
uniform vec2 uTextureSize;
varying vec2 outTexCoord;
uniform float time;
// seconds between rainbows
float rainbowSpeed = 3.0;
// see https://www.shadertoy.com/view/lsfBWs
vec3 rainbow(float level) {
    float r = float(level <= 2.0) + float(level > 4.0) * 1.0;
    float g = max(1.0 - abs(level - 2.0) * 0.4, 0.0);
    float b = (1.0 - (level - 4.0) * 0.5) * float(level >= 4.0);
    return vec3(r, g, b);
}
vec4 smoothRainbow(float x)
{
    float level1 = floor(x*6.0);
    float level2 = min(6.0, floor(x*6.0) + 1.0);
    
    vec3 a = rainbow(level1);
    vec3 b = rainbow(level2);
    
    return vec4(mix(a, b, fract(x*6.0)), 1);
}
void main(void) 
{
    vec4 texture = texture2D(uMainSampler, outTexCoord);
    vec4 color = texture;
    float level = (1.0 / rainbowSpeed) * mod(time, rainbowSpeed);
    color = smoothRainbow(level);
    // edge detection
    float surroundingAlphaSum =
        texture2D(uMainSampler, outTexCoord + vec2(-0.0001, -0.0001)).a + 
        texture2D(uMainSampler, outTexCoord + vec2( 0,      -0.0001)).a + 
        texture2D(uMainSampler, outTexCoord + vec2( 0,       -0.002)).a + 
        texture2D(uMainSampler, outTexCoord + vec2( 0.0001, -0.0001)).a + 
        texture2D(uMainSampler, outTexCoord + vec2(-0.0001,  0     )).a + 
        texture2D(uMainSampler, outTexCoord + vec2( -0.001,  0     )).a + 
        texture2D(uMainSampler, outTexCoord + vec2( 0.0001,  0     )).a + 
        texture2D(uMainSampler, outTexCoord + vec2(  0.001,  0     )).a + 
        texture2D(uMainSampler, outTexCoord + vec2(-0.0001,  0.0001)).a + 
        texture2D(uMainSampler, outTexCoord + vec2( 0,       0.0001)).a + 
        texture2D(uMainSampler, outTexCoord + vec2( 0,        0.002)).a + 
        texture2D(uMainSampler, outTexCoord + vec2( 0.0001,  0.0001)).a;
    
    if(texture.a == 0.0 && surroundingAlphaSum > 0.0) {
        // outline
        gl_FragColor = vec4(0.85,0.85,0.85,1) + color * 0.15;
    } else if(texture.a > 0.1) {
        // rainbow inside
        gl_FragColor = texture * 0.85 + color * 0.15;
    } else {
        // everything else
        gl_FragColor = texture;
    }
}
 */
                fragShader:
                    "#define SHADER_NAME PHASER_DEVTOOLS_HOVE\nprecision mediump float;uniform sampler2D uMainSampler;uniform vec2 uTextureSize;varying vec2 outTexCoord;uniform float time;float rainbowSpeed = 3.0;vec3 rainbow(float level) {\nfloat r = float(level <= 2.0) + float(level > 4.0) * 1.0;float g = max(1.0 - abs(level - 2.0) * 0.4, 0.0);float b = (1.0 - (level - 4.0) * 0.5) * float(level >= 4.0);return vec3(r, g, b);}\nvec4 smoothRainbow(float x)\n{\nfloat level1 = floor(x*6.0);float level2 = min(6.0, floor(x*6.0) + 1.0);vec3 a = rainbow(level1);vec3 b = rainbow(level2);return vec4(mix(a, b, fract(x*6.0)), 1);}\nvoid main(void) \n{\nvec4 texture = texture2D(uMainSampler, outTexCoord);vec4 color = texture;float level = (1.0 / rainbowSpeed) * mod(time, rainbowSpeed);color = smoothRainbow(level);float surroundingAlphaSum =\ntexture2D(uMainSampler, outTexCoord + vec2(-0.0001, -0.0001)).a + \ntexture2D(uMainSampler, outTexCoord + vec2( 0,      -0.0001)).a + \ntexture2D(uMainSampler, outTexCoord + vec2( 0,       -0.002)).a + \ntexture2D(uMainSampler, outTexCoord + vec2( 0.0001, -0.0001)).a + \ntexture2D(uMainSampler, outTexCoord + vec2(-0.0001,  0     )).a + \ntexture2D(uMainSampler, outTexCoord + vec2( -0.001,  0     )).a + \ntexture2D(uMainSampler, outTexCoord + vec2( 0.0001,  0     )).a + \ntexture2D(uMainSampler, outTexCoord + vec2(  0.001,  0     )).a + \ntexture2D(uMainSampler, outTexCoord + vec2(-0.0001,  0.0001)).a + \ntexture2D(uMainSampler, outTexCoord + vec2( 0,       0.0001)).a + \ntexture2D(uMainSampler, outTexCoord + vec2( 0,        0.002)).a + \ntexture2D(uMainSampler, outTexCoord + vec2( 0.0001,  0.0001)).a;if(texture.a == 0.0 && surroundingAlphaSum > 0.0) {\ngl_FragColor = vec4(0.85,0.85,0.85,1) + color * 0.15;} else if(texture.a > 0.1) {\ngl_FragColor = texture * 0.85 + color * 0.15;} else {\ngl_FragColor = texture;}}",
            });
        }

        onRender(scene, camera) {
            this.set1f("time", scene.time.now / 1000);
        }
    };
}

function isBackgroundItem(gameObject, sys) {
    return (
        gameObject?.displayWidth > sys.scale.width ||
        gameObject?.displayHeight > sys.scale.height
    );
}
