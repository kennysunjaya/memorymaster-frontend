const { where } = require("sequelize");
const { User, Game } = require("../models");
const { v2: cloudinary } = require("cloudinary");

// Configuration
cloudinary.config({
  cloud_name: "dqejkayri",
  api_key: "339998198229525",
  api_secret: process.env.CLOUDINARY_PRIVATE_KEY, // Click 'View API Keys' above to copy your API secret
});

class userController {
  static async highscore(req, res) {
    try {
      const { userId } = req.loginInfo;
      const foundUser = await User.findByPk(userId);
      const highscore = foundUser.highscore;
      res.status(200).json({
        highscore,
      });
    } catch (error) {
      let status = 500;
      let message = "Internal server error";

      res.status(status).json({
        message: message,
      });
    }
  }

  static async users(req, res) {
    try {
      const users = await User.findAll({ order: [["highscore", "DESC"]] });
      res.status(200).json({ users });
    } catch (error) {
      let status = 500;
      let message = "Internal server error";

      res.status(status).json({
        message: message,
      });
    }
  }

  static async editProfile(req, res) {
    try {
      const { userId } = req.loginInfo;
      const { username } = req.body;

      const imageInBase64 = req.file.buffer.toString("base64");
      const base64Uri = `data:text/plain;base64,${imageInBase64}`;

      const result = await cloudinary.uploader.upload(base64Uri);
      const imgUrl = result.url;

      await User.update(
        {
          username,
          imgUrl,
        },
        {
          where: {
            id: userId,
          },
        }
      );

      res.status(200).json({
        message: "Profile updated successfully",
      });
    } catch (error) {
      console.log(error);

      let status = 500;
      let message = "Internal server error";

      res.status(status).json({
        message: message,
      });
    }
  }

  static async fetchUser(req, res) {
    try {
      const { userId } = req.loginInfo;
      const foundUser = await User.findByPk(userId, {
        include: [
          {
            model: Game,
            separate: true,
            order: [["createdAt", "DESC"]],
          },
        ],
      });

      res.status(200).json({
        user: foundUser,
      });
    } catch (error) {
      console.log(error);

      let status = 500;
      let message = "Internal server error";

      res.status(status).json({
        message: message,
      });
    }
  }
}

module.exports = { userController };
