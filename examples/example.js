const CF = require('../src/CF').default;

// If your machine uses python3, input "true" in the constructor.
// By default CF uses python.
const cf = new CF(true);

cf.install().then(() => {
    // Installs all modules.
}).catch((err) => {
    // If modules are already installed or if there is an error, it will be logged here.
    console.error(err);
})

// Basic get request.
cf.get('https://www.wcofun.net/dubbed-anime-list').then((res) => {
    // Logs the response text.
    console.log(res.text());
}).catch((err) => {
    // Logs the error.
    console.error(err);
});

// For solving captcha3, you need to pass the url of the page, the sitekey and an example anchor URL.
cf.solveCaptcha3("https://4anime.gg/baka-test-summon-the-beasts-2-840", "6LcJeB8eAAAAAK9SJTPy75A2v4iIEOa-iNIpDzJM", "https://www.google.com/recaptcha/api2/anchor?ar=1&k=6LcJeB8eAAAAAK9SJTPy75A2v4iIEOa-iNIpDzJM&co=aHR0cHM6Ly80YW5pbWUuZ2c6NDQz&hl=en&v=5qcenVbrhOy8zihcc2aHOWD4&size=invisible&cb=43vxlhw87qvp").then((data) => {
    console.log(data);
}).catch((err) => {
    console.error(err);
})