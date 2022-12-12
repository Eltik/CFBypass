const CF = require("../src/CF.js").default;
const cf = new CF();
cf.get("https://google.com/", { headers: { Referer: "https://google.com/" }}).then((data) => {
    console.log(data.text());
})