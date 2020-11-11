const debug = require('debug')('vet:db:example');

const db = require('../index');

async function run() {
  const config = {
    database: process.env.DB_NAME || 'vet_bd_dev',
    username: process.env.DB_USER || 'vet_dev',
    password: process.env.DB_PASS || '123456',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: (s) => {
      debug(s);
    },
  };
  const { User } = await db(config).catch(handleError);
  const user = await User.findById(1);
  console.log(user);
}

function handleError(error) {
  console.error(error.message);
  console.error(error.stack);
}

run();
