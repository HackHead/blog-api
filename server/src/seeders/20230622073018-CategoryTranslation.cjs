'use strict';
const seed = require('../db/seed.cjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('CategoryTranslations', seed.categoryTranslations, {});
  },

  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('CategoryTranslations', null, {});
  },
};

// module.exports = {
//   up: async (queryInterface) => {
//     await Promise.resolve()
//   },

//   down: async (queryInterface) => {
//     await Promise.resolve()
//   },
// };