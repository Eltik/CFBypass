const CF = require("../src/CF.js").default;
const cf = new CF(true);
/*
cf.install().then((data) => {
    console.log(data);
}).catch((err) => {
    console.error(err);
})
*/
cf.get("https://crunchyroll.com/login", { allowRedirect: true }).then((data) => {
    console.log(data);
    console.log("Test successful!");
}).catch((err) => {
    console.error(err);
    console.log("Test unsuccessful!");
})
/*
cf.get("https://4anime.gg/baka-test-summon-the-beasts-2-840").then((data) => {
    const html = data.text();
    cf.solveCaptcha3FromHTML("https://4anime.gg/baka-test-summon-the-beasts-2-840", html, "https://www.google.com/recaptcha/api2/anchor?ar=1&k=6LcJeB8eAAAAAK9SJTPy75A2v4iIEOa-iNIpDzJM&co=aHR0cHM6Ly80YW5pbWUuZ2c6NDQz&hl=en&v=5qcenVbrhOy8zihcc2aHOWD4&size=invisible&cb=43vxlhw87qvp").then((data) => {
        console.log(data);
    }).catch((err) => {
        console.error(err);
    })
})
*/