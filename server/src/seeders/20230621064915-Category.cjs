'use strict';
const { v4: uuidv4 } = require('uuid');
const { hash, genSalt } = require('bcrypt');

const Categories = [
  {
    id: 'fd4ead9c-b5d2-4098-aa23-cdae5bc985cf',
    name: 'Technology',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'c3163cf4-5bce-4ce0-900a-4ae3e89bc6ea',
    name: 'Health',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'd2cb7830-da2e-4984-af08-c7059394005e',
    name: 'Travel',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'fda9253e-ffd7-47fc-becb-058e8381e58c',
    name: 'Fashion',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories', Categories, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {});
  },
};
