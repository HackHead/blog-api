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
