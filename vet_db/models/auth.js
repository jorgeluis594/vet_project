const Sequelize = require('sequelize');

const setupDatabase = require('../lib/db');

module.exports = function setupAuthModel(config) {
  const sequelize = setupDatabase(config);

  return sequelize.define('auth', {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    state: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });
};
