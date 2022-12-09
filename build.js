import fs from "node:fs/promises";
import path from "node:path";
import glob from "glob";
import JS from "uglify-js";
import chalk from "chalk";

glob("*.js", async (err, files) => {
    if (err) throw err;

    for (const fileName of files) {
        if (fileName === "build.js") continue;
        console.log(chalk.gray(`Building ${fileName}...`));
        const file = await fs.readFile(fileName, "utf-8");
        const { code: minified, error } = JS.minify(file);
        if (error) throw error;
        const bookmarklet = createBookmarklet(minified);
        await fs.writeFile(path.join(fileName.replace(".js", "")), bookmarklet);
    }

    console.log(chalk.green("✓ Built all bookmarklets successfully."));
});

/**
 * @param {string} js
 */
function createBookmarklet(js) {
    return encodeURI("javascript:!function(){" + js + "}()");
}
