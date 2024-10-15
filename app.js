const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");
const { getApi } = require("./controllers/endpoints.controller");
const { getArticleById } = require("./controllers/articles.controller");
const { psqlErrorHandler, customErrorHandler, serverErrorHandler } = require("./error-handling");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getApi);
app.get("/api/articles/:article_id", getArticleById);


app.all("*", (req, res) => {
  res.status(404).send({ msg: "Endpoint Does Not Exist" });
});

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;