const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const endpoints = require("../endpoints.json");
require("jest-sorted");

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("GET /api", () => {
  test("responds with 200 and returns an object describing all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints);
      });
  });
});

describe("GET /api/topics", () => {
  test("responds with 200 and an array containing data for all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        body.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});

describe("GET /api/nonexistent", () => {
  test("responds with 404 if passed incorrect name", () => {
    return request(app)
      .get("/api/noname")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Endpoint Does Not Exist");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("responds with 200 and an article object with the key 'article'", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.article).toBe("object");
        expect(body.article.author).toBe("butter_bridge");
        expect(body.article.title).toBe("Living in the shadow of a great man");
        expect(body.article.article_id).toBe(1);
        expect(body.article.body).toBe("I find this existence challenging");
        expect(body.article.topic).toBe("mitch");
        expect(body.article.created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(body.article.votes).toBe(100);
        expect(body.article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("responds 400 with an error message for an invalid article type", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid data type");
      });
  });
  test("responds 404 with an error message when given an article_id is valid, but does not exist", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api/articles", () => {
  test("responds with 200 and an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
          expect(article).not.toHaveProperty("body");
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
      });
  });
  test("responds with 200 and sorts articles by any valid column", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("votes", { descending: true });
      });
  });
  test("responds with 200 and sorts articles in ascending order when order=asc", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { ascending: true });
      });
  });
  test("responds with 400 when sort_by column is invalid", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid_column")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort_by query");
      });
  });
  test("responds with 400 when order is invalid", () => {
    return request(app)
      .get("/api/articles?order=invalid_order")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order query");
      });
  });

  test("responds 404 with an error message when the endpoint is invalid", () => {
    return request(app)
      .get("/api/articlessssss")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Endpoint Does Not Exist");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("responds with 200 and an array of comments for the given article_id", () => {
    const article_id = 1;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toEqual(11);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
          expect(comments).toBeSortedBy("created_at", { descending: true });
        });
      });
  });
  test("responds with 200 and an empty array when there are no comments for the given article_id", () => {
    const article_id = 4;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("responds with 404 when the article_id does not exist", () => {
    const article_id = 999;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("responds with 400 when the article_id is not an integer", () => {
    return request(app)
      .get(`/api/articles/invalidID/comments`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid data type");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("responds with 201 and add a new comment to the the comments with a username and body keys", () => {
    return request(app)
      .post(`/api/articles/4/comments`)
      .send({ username: "butter_bridge", body: "I've been amazed!" })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          author: "butter_bridge",
          body: "I've been amazed!",
          article_id: 4,
          votes: 0,
          comment_id: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("responds with 400 when the article_id is not a valid number", () => {
    return request(app)
      .post("/api/articles/invalidID/comments")
      .send({ username: "butter_bridge", body: "This is a comment" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid data type");
      });
  });
  test("responds with 404 when the article_id is valid but does not exist", () => {
    return request(app)
      .post("/api/articles/999/comments")
      .send({ username: "butter_bridge", body: "This is a comment" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("responds with 400 when the username or body is missing from the request body", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({ username: "butter_bridge" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required fields: username and body");
      });
  });
  test("responds with 400 when the username or body is not of the correct data type", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({ username: 123, body: "My comment here" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid data type for username or body");
      });
  });
  test("responds with 404 when the username does not exist", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({ username: "non_existent_user", body: "My comment here" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("responds with 200 and the updated article when inc_votes is positive", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          votes: expect.any(Number),
        });
        expect(body.article.votes).toBe(101);
      });
  });
  test("responds with 200 and the updated article when inc_votes is negative", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          votes: expect.any(Number),
        });
        expect(body.article.votes).toBe(99);
      });
  });
  test("responds with 400 when inc_votes is missing", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: inc_votes is required");
      });
  });
  test("responds with 400 when inc_votes is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "not-a-number" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: inc_votes must be a number");
      });
  });
  test("responds with 404 when article_id is valid but does not exist", () => {
    return request(app)
      .patch("/api/articles/999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("responds with 400 when article_id is invalid", () => {
    return request(app)
      .patch("/api/articles/not-a-number")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: article_id must be a number");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("responds with 204 and no content when the comment is successfully deleted", () => {
    return request(app).delete("/api/comments/4").expect(204);
  });
  test("responds with 404 when the comment_id is valid but does not exist", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });
  test("responds with 400 when the comment_id is invalid", () => {
    return request(app)
      .delete("/api/comments/invalidID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid data type");
      });
  });
});

describe("GET /api/users", () => {
  test("responds with 200 and an array containing data for all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        body.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});
