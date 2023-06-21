'use strict';
const { v4: uuidv4 } = require('uuid');
const { hash, genSalt } = require('bcrypt');

const Users = [
  {
    id: 'c0cb64a1-53e8-411b-9636-5976514c2186',
    first_name: 'John',
    last_name: 'Doe',
    full_name: 'John Doe',
    email: 'john.doe@gmail.com',
    password: 'password123'
  },
  {
    id: 'eb8a412f-8025-46dc-8b87-04542f431727',
    first_name: 'Alice',
    last_name: 'Smith',
    full_name: 'Alice Smith',
    email: 'alice.smith@yahoo.com',
    password: 'secret@123'
  },
  {
    id: 'fd9084b9-daa9-43eb-af0c-3b2f196a6be9',
    first_name: 'Michael',
    last_name: 'Johnson',
    full_name: 'Michael Johnson',
    email: 'michael.johnson@hotmail.com',
    password: '12345678'
  },
].map(async (user) => {
  const salt = await genSalt(10);
  const hashedPass = await hash(user.password, salt);

  user.createdAt = new Date();
  user.updatedAt = new Date();
  user.password = hashedPass;

  return user;
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('Users', await Promise.all(Users), {});
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('Users', null, {});
  }
};
