import fs from "node:fs/promises";
import glob from "glob";
import JS from "uglify-js";
import chalk from "chalk";

glob("*.js", async (err, files) => {
    if (err) throw err;

    for (const fileName of files) {
        if (fileName === "build.js") continue;
        console.log(chalk.gray(`Building ${fileName}...`));
        const file = await fs.readFile(fileName, "utf-8");
        const [_match, name] = file.match(/\/\/\s*name:\s*(.+)/);
        const { code: minified, error } = JS.minify(file);
        if (error) throw error;
        const bookmarklet = createBookmarklet(minified);
        await fs.writeFile(fileName.replace(".js", ""), bookmarklet);
        await fs.writeFile(
            "install-" + fileName.replace(".js", ".url"),
            "[InternetShortcut]\r\nURL=" + createInstallUrl(bookmarklet, name)
        );
    }

    console.log(chalk.green("✓ Built all bookmarklets successfully."));
});

/**
 * @param {string} js
 */
function createBookmarklet(js) {
    return encodeURIComponent("javascript:!function(){" + js + "}()");
}

function createInstallUrl(bookmarklet, name) {
    return `https://install-bookmarklet.pages.dev/?url=${bookmarklet}&name=${encodeURIComponent(
        name
    )}`;
}
