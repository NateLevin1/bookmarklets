import fs from "node:fs/promises";
import glob from "glob";
import JS from "uglify-js";
import chalk from "chalk";
import path from "node:path";
import open from "open";

const specificFilename = process.argv[2];
if (specificFilename) {
    const { installUrl } = await getMinifiedInfoForFile(specificFilename);
    open(installUrl);
} else {
    glob("*.js", async (err, files) => {
        if (err) throw err;

        let readme = await fs.readFile("README.md", "utf-8");
        for (const fileName of files) {
            if (fileName === "build.js") continue;
            console.log(chalk.gray(`Building ${fileName}...`));

            const { asciiName, minified, bookmarklet, installUrl } =
                await getMinifiedInfoForFile(fileName);

            await fs.writeFile(
                path.join("dist", asciiName + ".min.js"),
                minified
            );
            await fs.writeFile(
                path.join("dist", asciiName + ".bookmarklet.txt"),
                bookmarklet
            );
            await fs.writeFile(
                path.join(
                    "installers",
                    "install-" + fileName.replace(".js", ".url")
                ),
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
}

async function getMinifiedInfoForFile(fileName) {
    const file = await fs.readFile(fileName, "utf-8");
    const [_match, name] = file.match(/\/\/\s*name:\s*(.+)/);
    const asciiName = fileName.replace(".js", "");
    const { code: minified, error } = JS.minify(file);
    if (error) throw error;
    const bookmarklet = createBookmarklet(minified);
    const installUrl = createInstallUrl(bookmarklet, name);
    return { asciiName, minified, bookmarklet, installUrl };
}

function createBookmarklet(js) {
    return "javascript:" + encodeURIComponent("!function(){" + js + "}()");
}

function createInstallUrl(bookmarklet, name) {
    return `https://install-bookmarklet.pages.dev/?url=${bookmarklet}&name=${encodeURIComponent(
        name
    )}`;
}
