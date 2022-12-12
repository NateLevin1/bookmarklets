import fs from "node:fs/promises";
import glob from "glob";
import JS from "uglify-js";
import chalk from "chalk";

glob("*.js", async (err, files) => {
    if (err) throw err;

    let readme = await fs.readFile("README.md", "utf-8");
    for (const fileName of files) {
        if (fileName === "build.js") continue;
        console.log(chalk.gray(`Building ${fileName}...`));

        const file = await fs.readFile(fileName, "utf-8");
        const [_match, name] = file.match(/\/\/\s*name:\s*(.+)/);
        const asciiName = fileName.replace(".js", "");
        const { code: minified, error } = JS.minify(file);
        if (error) throw error;
        const bookmarklet = createBookmarklet(minified);
        const installUrl = createInstallUrl(bookmarklet, name);

        await fs.writeFile(asciiName, bookmarklet);
        await fs.writeFile(
            "install-" + fileName.replace(".js", ".url"),
            "[InternetShortcut]\r\nURL=" + installUrl
        );
        readme = readme.replace(
            new RegExp(`(\\[${asciiName}\\]: ).+`),
            "$1" + installUrl
        );
    }
    await fs.writeFile("README.md", readme);

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
