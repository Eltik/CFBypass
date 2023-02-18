const API = require("./built/API").default;
const bypass = new API();
/*
bypass.request("https://www.justlightnovels.com/").then((data) => {
    console.log(data.data);
    console.log(data.headers);
})
*/
//bypass.getHeaders("https://www.justlightnovels.com/").then(console.log)
bypass.test().then(console.log)