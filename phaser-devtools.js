//
// name: 🛟 Phaser Devtools
// author: Nate Levin (https://natelev.in)
//

console.log("Activated 🛟 Phaser Devtools bookmarklet.");

if (!window.Phaser)
    throw new Error("This page does not expose any Phaser object :(");

if (!window.Phaser.Renderer.WebGL.Pipelines.PostFXPipeline)
    throw new Error(
        "This Phaser game is too outdated! Must be on Phaser >3.5, this game is running " +
            Phaser.VERSION
    );

if (window.__phaser_devtools_injected)
    throw new Error("Phaser DevTools are already injected into this page.");

window.__phaser_devtools_injected = true;

// inject into .push to find a scene
let oldPush = Array.prototype.push;
let game;
Array.prototype.push = function (...arguments) {
    if (!!this[0]?.scene || !!this[0]?.gameObject?.scene) {
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

function startDevTools(game) {
    console.log("%cStarting Phaser DevTools...", "color: gray");
    game.scene.add("__phaser-devtools", PhaserDevTools, true);
}

// this manages all the devtools. only 1 should be loaded at a time
class PhaserDevTools extends Phaser.Scene {
    enabled = false;

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
                "pointer-events: " + game.config.domPointerEvents + ";",
                "transform: scale(1);",
                "transform-origin: left top;",
            ].join(" ");

            document.body.prepend(game.domContainer);

            document.body.style.overflow = "hidden";
            document.body.style.width = "100%";
            document.body.style.height = "100%";

            // get everything back in sync, shouldn't be needed but kept for compat
            game.scale.refresh();
        }

        // TODO: make interactive, add logo
        const enabler = document.createElement("button");
        enabler.onclick = () => {
            this.enabled = !this.enabled;
        };

        this.add.dom(
            50,
            50,
            enabler,
            "background-color: rgba(50,0,50, 0.5); width: 70px; height: 70px; border-radius: 99999px; backdrop-filter: blur(10px); filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.5)); border: none; outline: none; cursor: pointer;"
        );

        this.sys.game.renderer.pipelines.addPostPipeline(
            HoverPipeline.KEY,
            HoverPipeline
        );
        console.log(
            "%c⭐️🧑‍💻 Phaser DevTools loaded successfully!",
            "color: green; font-size: 1.2em; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
        );
    }
    update(time, delta) {
        if (this.enabled) {
            this.loadAllGameObjects();
        }
    }
    loadAllGameObjects() {
        this.forAllGameObjects((gameObject) => {
            const alreadyDebugging = gameObject.getData(
                "__phaser_devtools_loaded"
            );

            if (!alreadyDebugging && gameObject.active) {
                gameObject.setData("__phaser_devtools_loaded", true);
                gameObject.setInteractive();

                gameObject.on("pointerover", () => {
                    if (
                        this.enabled &&
                        gameObject.setPostPipeline &&
                        !isBackgroundItem(gameObject, this.sys)
                    )
                        gameObject.setPostPipeline(HoverPipeline.KEY);
                });
                gameObject.on("pointerout", () => {
                    if (
                        this.enabled &&
                        gameObject.resetPostPipeline &&
                        !isBackgroundItem(gameObject, this.sys)
                    )
                        gameObject.resetPostPipeline();
                });
            }
        });
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

// shaders
class HoverPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
    static KEY = "__phaser_devtools_hover";

    constructor(game) {
        super({
            game: game,
            renderer: game.renderer,
            fragShader: `
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
      `,
        });
    }

    onRender(scene, camera) {
        this.set1f("time", scene.time.now / 1000);
    }
}

function isBackgroundItem(gameObject, sys) {
    return (
        gameObject?.displayWidth > sys.scale.width ||
        gameObject?.displayHeight > sys.scale.height
    );
}
