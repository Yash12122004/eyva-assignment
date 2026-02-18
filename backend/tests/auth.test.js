import request from "supertest";
import dotenv from "dotenv";
import app from "../src/app.js";
import pool from "../src/db.js";

dotenv.config({ path: ".env.test" });

beforeAll(async () => {
  await pool.query("DELETE FROM users");
});

afterAll(async () => {
  await pool.end();
});

describe("Auth API", () => {

  test("1. Should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "test@example.com",
        password: "password123",
        name: "Test User"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe("test@example.com");
  });

  test("2. Should not register duplicate email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "test@example.com",
        password: "password123",
        name: "Test User"
      });

    expect(res.statusCode).toBe(400);
  });

  test("3. Should login successfully", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "password123"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("4. Should reject wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "wrongpassword"
      });

    expect(res.statusCode).toBe(401);
  });

  test("5. Should reject invalid email format", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "not-an-email",
        password: "password123",
        name: "Bad User"
      });

    expect(res.statusCode).toBe(400);
  });

});
