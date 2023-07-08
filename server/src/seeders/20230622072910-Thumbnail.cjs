'use strict';
const seed = require('../db/seed.cjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('Thumbnails', seed.thumbnails, {});
   },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('Thumbnails', null, {});
  }
};
