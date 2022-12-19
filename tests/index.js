const CF = require("../src/CF.js").default;
const cf = new CF(true);
/*
cf.install().then((data) => {
    console.log(data);
}).catch((err) => {
    console.error(err);
})
*/
cf.get("https://wcofun.net/").then((data) => {
    console.log(data.text());
    console.log("Test successful!");
}).catch((err) => {
    console.error(err);
    console.log("Test unsuccessful!");
})