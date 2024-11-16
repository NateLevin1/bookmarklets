//
// name: 🗑️ Clear Site Data
// author: Nate Levin (https://natelev.in)
// desc: Clear all data stored by the current website and reload the page
//

localStorage.clear();
sessionStorage.clear();
indexedDB.databases().then((dbs) => {
    for (const db of dbs) {
        indexedDB.deleteDatabase(db.name);
    }
});
document.cookie.split(";").forEach((cookie) => {
    document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
});

location.reload();
