"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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

    games.map((el) => {
      delete el.id;
      el.createdAt = el.updatedAt = new Date();
    });

    await queryInterface.bulkInsert("Games", games);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Games", null, {});
  },
};
