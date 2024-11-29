const { where, Op } = require("sequelize");
const { Game, User } = require("../models");

class gameController {
  static async add(req, res) {
    try {
      const { userId } = req.loginInfo;
      const { score } = req.body;

      const newGame = await Game.create({
        user_id: userId,
        score,
      });

      const foundUser = await User.findByPk(userId);
      const highscore = foundUser.highscore;

      if (score > highscore) {
        await User.update(
          { highscore: score },
          {
            where: { id: userId },
          }
        );
      }

      res.status(201).json({
        message: "Successfully create game",
        newGame,
      });
    } catch (error) {
      let status = 500;
      let message = "Internal server error";

      res.status(status).json({
        message: message,
      });
    }
  }

  static async tips(req, res) {
    try {
      const { GoogleGenerativeAI } = require("@google/generative-ai");

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = "Give me one brief tip for when playing a simon game";

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      res.status(200).json(text);
    } catch (error) {
      let status = 500;
      let message = "Internal server error";

      res.status(status).json({
        message: message,
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const game = await Game.findByPk(id);

      if (!game) {
        throw { name: "Not Found" };
      }

      await Game.destroy({
        where: {
          id,
        },
      });

      res.status(201).json({
        message: "Game deleted succesfully",
      });
    } catch (error) {
      let status = 500;
      let message = "Internal server error";

      if (error.name == "Not Found") {
        status = 404;
        message = "Data not found";
      }

      res.status(status).json({
        message: message,
      });
    }
  }
}

module.exports = { gameController };
