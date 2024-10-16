const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `
      SELECT 
        comment_id, 
        votes, 
        created_at, 
        author, 
        body, 
        article_id 
      FROM comments 
      WHERE article_id = $1
      ORDER BY created_at DESC;
    `,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return db
          .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
          .then(({ rows }) => {
            if (rows.length === 0) {
              return Promise.reject({ status: 404, msg: "Article not found" });
            }
            return [];
          });
      }
      return rows;
    });
};

exports.insertComment = (article_id, username, body) => {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: "Missing required fields: username and body",
    });
  }
  if (typeof username !== "string" || typeof body !== "string") {
    return Promise.reject({
      status: 400,
      msg: "Invalid data type for username or body",
    });
  }
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return db.query("SELECT * FROM users WHERE username = $1", [username]);
    })
    .then(({ rows: userRows }) => {
      if (userRows.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
      return db.query(
        "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *",
        [article_id, username, body]
      );
    })
    .then(({ rows: commentRows }) => {
      return commentRows[0];
    });
};
