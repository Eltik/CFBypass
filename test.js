const CF = require("./built/CF.js").default;
const cf = new CF(true);
cf.request({
    url: "https://api.anify.tv", options: {
        method: "GET"
    }
}).then((data) => {
    console.log(data);
    console.log(data.text());
})