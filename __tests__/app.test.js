const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const endpoints = require("../endpoints.json");
const convertTimestampToDate = require("../db/seeds/utils");

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
      .get("/api/articles/123")
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
        });
        const sortedArticles = [...articles].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        expect(articles).toEqual(sortedArticles);
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
