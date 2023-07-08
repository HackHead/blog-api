'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const domainsData = [
      {
        id: uuidv4(),
        ip_address: '192.168.0.1',
        url: 'https://example1.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        ip_address: '192.168.0.2',
        url: 'https://example2.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        ip_address: '192.168.0.3',
        url: 'https://example3.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('Domains', domainsData, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Domains', null, {});
  }
};
