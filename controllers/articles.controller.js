const {
  fetchArticleById,
  fetchAllArticles,
  updateArticleVotes,
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;

  fetchAllArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (isNaN(article_id)) {
    return res
      .status(400)
      .send({ msg: "Bad Request: article_id must be a number" });
  }

  if (typeof inc_votes === "undefined") {
    return res.status(400).send({ msg: "Bad Request: inc_votes is required" });
  }
  if (typeof inc_votes !== "number") {
    return res
      .status(400)
      .send({ msg: "Bad Request: inc_votes must be a number" });
  }

  updateArticleVotes(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};
