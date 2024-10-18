const app = require("./app.js");
const { PORT = 9092} = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));