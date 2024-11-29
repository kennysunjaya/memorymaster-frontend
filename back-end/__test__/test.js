const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { hash } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

beforeAll(async () => {
  const users = [
    {
      username: "user1",
      email: "user1@mail.com",
      password: "user1",
      imgUrl: "https://upload.wikimedia.org/wikipedia/en/6/6f/KennyMcCormick.png",
      highscore: 0,
    },
    {
      username: "user2",
      email: "user2@mail.com",
      password: "user2",
      imgUrl: "https://upload.wikimedia.org/wikipedia/en/6/6f/KennyMcCormick.png",
      highscore: 1,
    },
  ];

  const games = [
    {
      user_id: 1,
      score: 0,
    },
    {
      user_id: 2,
      score: 1,
    },
  ];

  users.map((el) => {
    delete el.id;
    el.password = hash(el.password);
    el.createdAt = el.updatedAt = new Date();
  });
  games.map((el) => {
    delete el.id;
    el.createdAt = el.updatedAt = new Date();
  });

  await sequelize.queryInterface.bulkInsert("Users", users);
  await sequelize.queryInterface.bulkInsert("Games", games);
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Games", null, { truncate: true, cascade: true, restartIdentity: true });
  await sequelize.queryInterface.bulkDelete("Users", null, { truncate: true, cascade: true, restartIdentity: true });
});

describe("POST /login", () => {
  describe("POST /login - succeed", () => {
    test("It should return message and access token", async () => {
      const body = { email: "user1@mail.com", password: "user1" };
      const response = await request(app).post("/login").send(body);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("access_token", expect.any(String));
    });
  });
  describe("POST /login - fail", () => {
    test("It should return an object with error message", async () => {
      const body = { email: "", password: "hashedpassword123" };
      const response = await request(app).post("/login").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    test("It should return an object with error message", async () => {
      const body = { email: "admin@example.com", password: "" };
      const response = await request(app).post("/login").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    test("It should return an object with error message", async () => {
      const body = { email: "invalidEmail@example.com", password: "hashedpassword123" };
      const response = await request(app).post("/login").send(body);

      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    test("It should return an object with error message", async () => {
      const body = { email: "admin@example.com", password: "incorrectpassword" };
      const response = await request(app).post("/login").send(body);

      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });
});

describe("POST /register", () => {
  describe("POST /register - succeed", () => {
    test("It should create a user and return success message", async () => {
      const body = {
        username: "newuser",
        email: "newuser@mail.com",
        password: "password123",
      };
      const response = await request(app).post("/register").send(body);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });

  describe("POST /register - fail", () => {
    test("It should return 400 when email is missing", async () => {
      const body = {
        username: "newuser",
        password: "password123",
      };
      const response = await request(app).post("/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    test("It should return 400 when password is missing", async () => {
      const body = {
        username: "newuser",
        email: "newuser@mail.com",
      };
      const response = await request(app).post("/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    test("It should return 400 when username is missing", async () => {
      const body = {
        email: "newuser@mail.com",
        password: "password123",
      };
      const response = await request(app).post("/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    test("It should return 400 when email is invalid", async () => {
      const body = {
        username: "newuser",
        email: "invalidemail",
        password: "password123",
      };
      const response = await request(app).post("/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });
});

describe("GET /tips", () => {
  describe("GET /tips - succeed", () => {
    test("It should return a tip string", async () => {
      const payload = {
        id: 1,
        username: "user1",
        email: "user1@mail.com",
      };

      const access_token = signToken(payload);

      const response = await request(app).get("/tips").set("Authorization", `Bearer ${access_token}`);

      expect(response.status).toBe(200);
      expect(typeof response.body).toBe("string");
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /tips - fail", () => {
    test("It should return 401 when there is no access token", async () => {
      const response = await request(app).get("/tips");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });
});

describe("GET /users", () => {
  describe("GET /users - succeed", () => {
    test("It should return a list of users ordered by highscore", async () => {
      const payload = {
        id: 1,
        username: "user1",
        email: "user1@mail.com",
      };

      const access_token = signToken(payload);

      const response = await request(app).get("/users").set("Authorization", `Bearer ${access_token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("users", expect.any(Array));
      expect(response.body.users.length).toBeGreaterThan(0);
    });
  });

  describe("GET /users - fail", () => {
    test("It should return 401 when there is no access token", async () => {
      const response = await request(app).get("/users");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });
});

describe("DELETE /games/:id", () => {
  describe("DELETE /games/:id - succeed", () => {
    test("It should delete a game and return success message", async () => {
      const payload = {
        id: 1,
        username: "user1",
        email: "user1@mail.com",
      };

      const access_token = signToken(payload);

      const gameId = 1;

      const response = await request(app).delete(`/game/${gameId}`).set("Authorization", `Bearer ${access_token}`);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });

  describe("DELETE /games/:id - fail", () => {
    test("It should return 404 when game is not found", async () => {
      const payload = {
        id: 1,
        username: "user1",
        email: "user1@mail.com",
      };

      const access_token = signToken(payload);

      const nonExistentGameId = 999;

      const response = await request(app).delete(`/game/${nonExistentGameId}`).set("Authorization", `Bearer ${access_token}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });
});
