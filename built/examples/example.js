const CF = require('../src/CF').default;
// If your machine uses python3, input "true" in the constructor.
// By default CF uses python.
const cf = new CF(true);
// Basic get request.
cf.get('https://www.wcofun.net/dubbed-anime-list').then((res) => {
    // Logs the response text.
    console.log(res.text());
}).catch((err) => {
    // Logs the error.
    console.error(err);
});
//# sourceMappingURL=example.js.map