module.exports = function setupAuth(AuthModel, UserModel) {
  async function create(userId, auth) {
    const user = await UserModel.findByPk(userId);
    if (user) {
      Object.assign(auth, { userId: user.id });
      const result = await AuthModel.create(auth);
      return result.toJson();
    }
    return null;
  }

  function find(username) {
    const cond = {
      where: {
        username,
      },
    };

    return AuthModel.findOne(cond);
  }
  return {
    create,
    find,
  };
};
