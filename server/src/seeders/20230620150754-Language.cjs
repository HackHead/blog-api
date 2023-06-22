'use strict';
const seed = require('../db/seed.cjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('Languages', seed.languages, {});
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('Languages', null, {});
  }
};
