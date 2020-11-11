const extend = require('./utils/extend');

const user = {
  id: 1,
  email: 'test1@test.com',
  name: 'testname',
  lastname: 'testlastname',
  dni: 12554667,
  phone: 768768997,
  address: 'addresstest 123',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const users = [
  user,
  extend(user, { id: 2, name: 'test2', dni: 76576476 }),
  extend(user, { id: 3, name: 'test3', dni: 87998798 }),
  extend(user, { id: 4, name: 'test5', dni: 787897, lastname: 'othername' }),
];

module.exports = {
  single: user,
  all: users,
  findById: (id) => users.find((obj) => obj.id === id),
};
