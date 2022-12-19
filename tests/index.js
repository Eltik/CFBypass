const CF = require("../src/CF.js").default;
const cf = new CF(true);
/*
cf.install().then((data) => {
    console.log(data);
}).catch((err) => {
    console.error(err);
})
*/
cf.get("https://animixplay.to/api/cW9TVRrMk16Y3pMVFhzM0dyVTh3ZTlPVFZSck1rMTZZM289", { allowRedirect: true }).then((data) => {
    console.log(data.text());
    console.log("Test successful!");
}).catch((err) => {
    console.error(err);
    console.log("Test unsuccessful!");
})