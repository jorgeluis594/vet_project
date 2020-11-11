const proxyquire = require('proxyquire');
const sinon = require('sinon');
const test = require('ava');

const userFixture = require('./fixtures/user');

const config = {
  logging() {},
};

const AuthStub = {
  belongsTo: sinon.spy(),
};

let sandbox = null;

let UserStub = null;
let db = null;

const single = { ...userFixture.single };
const id = 1;
const idArgs = {
  where: {
    id,
  },
};

test.beforeEach(async () => {
  sandbox = sinon.createSandbox();
  UserStub = {
    hasMany: sandbox.spy(),
    findByPk: sandbox.stub(),
    findOne: sandbox.stub(),
    update: sandbox.stub(),
  };

  UserStub.findOne
    .withArgs(idArgs)
    .returns(Promise.resolve(userFixture.findById(id)));

  UserStub.findByPk
    .withArgs(id)
    .returns(Promise.resolve(userFixture.findById(id)));

  UserStub.update.withArgs(single, idArgs).returns(Promise.resolve(single));

  const setupDatabase = proxyquire('../index', {
    './models/user': () => UserStub,
    './models/auth': () => AuthStub,
  });

  db = await setupDatabase(config);
});

test.afterEach(() => {
  // eslint-disable-next-line no-unused-expressions
  sandbox && sandbox.restore();
});

test('User', (t) => {
  t.truthy(db.User, 'User service should exist');
});

test.serial('Setup', (t) => {
  t.true(UserStub.hasMany.called, 'UserModel.hasMany was executed');
  t.true(AuthStub.belongsTo.called, 'AuthStub.belongsTo was executed');
  t.true(
    UserStub.hasMany.calledWith(AuthStub),
    'Arguments needs to be a model'
  );
  t.true(
    AuthStub.belongsTo.calledWith(UserStub),
    'Arguments needs to be a model'
  );
});

test.serial('User#findById', async (t) => {
  const user = await db.User.findById(id);

  t.true(UserStub.findByPk.called, 'findByPk should be called on model');
  t.true(UserStub.findByPk.calledOnce, 'findByPk should be called once');
  t.true(
    UserStub.findByPk.calledWith(id),
    `findByPk should be called with id=${id}`
  );

  t.deepEqual(user, userFixture.findById(id), 'should be the same');
});

test.serial('User#createOrdUpdate - user exists', async (t) => {
  const user = await db.User.createOrUpdate(single);

  t.true(UserStub.findByPk.called, 'findByPk should be called on model');
  t.true(UserStub.findByPk.calledTwice, 'findByPk should be called twice');
  t.true(UserStub.update.called, 'update should be called');
  t.true(UserStub.update.calledOnce, 'update should be called once');

  t.deepEqual(user, single, 'User should be the same');
});
