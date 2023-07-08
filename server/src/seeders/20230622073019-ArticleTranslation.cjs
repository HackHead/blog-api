'use strict';
const seed = require('../db/seed.cjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ArticleTranslations', seed.articleTranslations, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ArticleTranslations', null, {});
  },
};


// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await Promise.resolve();
//   },

//   down: async (queryInterface, Sequelize) => {
//     await Promise.resolve();
//   },
// };
