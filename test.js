const CF = require("./built/CF.js").default;
const cf = new CF(true);
cf.request({
    url: "https://9anime.gs", options: {
        method: "GET"
    }
}).then((data) => {
    console.log(data.text());
})