const CF = require("../src/CF.js").default;
const cf = new CF(true);
cf.get("https://9anime.pl").then((data) => {
    console.log(data.text());
    console.log("Test successful!");
}).catch((err) => {
    console.error(err);
    console.log("Test failed...");
})