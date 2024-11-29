const { compare } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");
const { OAuth2Client } = require("google-auth-library");

class authController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) {
        throw { name: "noEmail" };
      }

      if (!password) {
        throw { name: "noPassword" };
      }

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        throw { name: "LoginError" };
      }

      const verify = compare(password, user.password);
      if (!verify) {
        throw { name: "LoginError" };
      }

      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
      };

      const access_token = signToken(payload);

      res.status(200).json({
        access_token,
      });
    } catch (error) {
      let status = 500;
      let message = "Internal server error";

      if (error.name == "noEmail") {
        status = 400;
        message = "Email is required";
      }
      if (error.name == "noPassword") {
        status = 400;
        message = "Password is required";
      }
      if (error.name == "LoginError") {
        status = 401;
        message = "Invalid Email/Password";
      }

      res.status(status).json({
        message: message,
      });
    }
  }

  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body;

      await User.create({ username, email, password });

      res.status(201).json({
        message: "User created succesfully",
      });
    } catch (error) {
      let status = 500;
      let message = "Internal server error";

      if (error.name == "SequelizeValidationError") {
        status = 400;
        message = error.errors[0].message;
      }

      res.status(status).json({
        message: message,
      });
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const { token } = req.headers;

      if (!token) {
        throw { name: "noToken" };
      }

      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      // Find ato create the user
      const [user, created] = await User.findOrCreate({
        where: { username: payload.email },
        defaults: {
          username: payload.email,
          email: payload.email,
          password: "password_google",
        },
        hooks: false,
      });

      // Buat access token
      const access_token = signToken({
        id: user.id,
        username: user.username,
        email: user.email,
      });

      res.status(200).json({ access_token });
    } catch (error) {
      let status = 500;
      let message = "Internal server error";

      if (error.name == "noToken") {
        status = 400;
        message = "Google token is required.";
      }

      res.status(status).json({
        message: message,
      });
    }
  }
}

module.exports = { authController };
