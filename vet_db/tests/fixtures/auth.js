const extend = require('./utils/extend');

const auth = {
  id: 1,
  userId: 1,
  username: 'test1',
  password: 'test123',
  state: false,
};
const all = [
  auth,
  extend(auth, { id: 2, username: 'test2', state: true }),
  extend(auth, { id: 3, userId: 2, username: 'test3', state: true }),
];

module.exports = {
  single: auth,
  all,
  findByUsername: (username) => all.find((user) => user.username === username),
};
