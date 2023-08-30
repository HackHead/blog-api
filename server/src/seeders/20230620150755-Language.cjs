'use strict';

const languages = [
  { id: '10e4b280-78c9-49ac-a2d4-2751f3d0cc63', "code": "de", "name": "German", createdAt: new Date(), updatedAt: new Date() },
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('Languages', languages, {});
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('Languages', null, {});
  }
};
