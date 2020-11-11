const Sequelize = require('sequelize');

const setupDatabase = require('../lib/db');

module.exports = function setupUserModel(config) {
  const sequilize = setupDatabase(config);

  return sequilize.define('user', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    dni: {
      type: Sequelize.NUMBER,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });
};
