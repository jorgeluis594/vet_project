const debug = require('debug')('vet:db:setup');

const db = require('./index');

async function setup() {
  const config = {
    database: process.env.DB_NAME || 'vet_bd_dev',
    username: process.env.DB_USER || 'vet_dev',
    password: process.env.DB_PASS || '123456',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: (s) => {
      debug(s);
    },
    setup: true,
  };
  await db(config).catch(handleFatalError);

  console.log('Success');
  process.exit(0);
}

function handleFatalError(err) {
  console.error(err.message);
  console.error(err.stack);
  process.exit(1);
}

setup();
