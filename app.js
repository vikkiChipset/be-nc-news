const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");
const { getApi } = require("./controllers/endpoints.controller");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getApi);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Endpoint Does Not Exist" });
});

module.exports = app;
