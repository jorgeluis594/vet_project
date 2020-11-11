const proxyquire = require('proxyquire');
const sinon = require('sinon');
const test = require('ava');

const authFixture = require('./fixtures/auth');

const single = { ...authFixture.single };

const config = {
  logging: () => {},
};

let db = null;

const userId = 1;

const newAuth = {
  username: 'test1',
  password: 'test123',
  state: false,
};

let sandbox = null;

// initializing Stubs
const UserStub = {
  hasMany: sinon.spy(),
  findByPk: sinon.stub().withArgs(userId).returns({ id: 1 }),
};

let AuthStub = null;

const username = 'test1';

test.beforeEach(async () => {
  sandbox = sinon.createSandbox();
  AuthStub = {
    belongsTo: sandbox.spy(),
    findOne: sandbox.stub(),
    create: sandbox.stub(),
  };

  // Method create
  AuthStub.create.withArgs(newAuth).returns(
    Promise.resolve({
      toJson() {
        return newAuth;
      },
    })
  );

  // Method FindOne
  AuthStub.findOne
    .withArgs({ where: { username } })
    .returns(Promise.resolve(single));

  // getting database service
  const setupDataBase = proxyquire('../index', {
    './models/auth': () => AuthStub,
    './models/user': () => UserStub,
  });
  db = await setupDataBase(config);
});

test.afterEach(() => {
  if (sandbox) sandbox.restore();
});

test('Auth', (t) => {
  t.truthy(db.Auth, 'Auth service should be exists');
});

test.serial('Setup#Auth', (t) => {
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

test.serial('Auth#find', async (t) => {
  const auth = await db.Auth.find(username);

  t.true(AuthStub.findOne.called, 'findOne should be called on model');
  t.true(AuthStub.findOne.calledOnce, 'findOne should be called once');
  t.true(
    AuthStub.findOne.calledWith({ where: { username } }),
    'findOne shuld be called with condition'
  );

  t.deepEqual(auth, authFixture.findByUsername(username), 'should be the same');
});

test.serial('Auth#create', async (t) => {
  const auth = await db.Auth.create(userId, newAuth);

  t.true(UserStub.findByPk.called, 'UserModel.findByPk shoyd be called');
  t.true(AuthStub.create.called, 'create should be called');
  t.true(AuthStub.create.calledOnce, 'create should be called');
  t.true(AuthStub.create.calledWith({ ...newAuth, userId }));

  t.deepEqual(auth, { ...newAuth, userId }, 'should be the same');
});
