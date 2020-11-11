const defaults = require('defaults');

const setupDatabase = require('./lib/db');
const setupUserModel = require('./models/user');
const setupAuthModel = require('./models/auth');

const setupUser = require('./lib/user');
const setupAuth = require('./lib/auth');

module.exports = async function (config) {
  // eslint-disable-next-line no-param-reassign
  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000,
    },
    query: {
      raw: true,
    },
  });

  const sequelize = setupDatabase(config);
  const UserModel = setupUserModel(config);
  const AuthModel = setupAuthModel(config);

  UserModel.hasMany(AuthModel);
  AuthModel.belongsTo(UserModel);

  await sequelize.authenticate();

  if (config.setup) {
    await sequelize.sync({ force: true });
  }

  const User = setupUser(UserModel);
  const Auth = setupAuth(AuthModel, UserModel);
  return {
    User,
    Auth,
  };
};
