"use strict";

const { hash } = require("../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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

    users.map((el) => {
      delete el.id;
      el.password = hash(el.password);
      el.createdAt = el.updatedAt = new Date();
    });

    await queryInterface.bulkInsert("Users", users);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
