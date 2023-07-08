'use strict';
const seed = require('../db/seed.cjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories', seed.categories, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {});
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