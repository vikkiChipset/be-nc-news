const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

beforeEach(() => seed(data));

afterAll(() => db.end());

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
