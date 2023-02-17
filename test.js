const CF = require("./built/CF.js").default;
const cf = new CF(true);
cf.request({
    url: "https://justlightnovels.com", options: {
        method: "GET",
        headers: {
            Referer: "https://justlightnovels.com",
        }
    }
}).then((data) => {
    console.log(data.text());
}).catch(console.error)