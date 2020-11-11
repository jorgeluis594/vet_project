module.exports = function setupUser(UserModel) {
  async function createOrUpdate(user) {
    const cond = {
      where: {
        id: user.id,
      },
    };

    const existingUser = await UserModel.findByPk(user.id);
    if (existingUser) {
      const updated = await UserModel.update(user, cond);
      return updated ? UserModel.findByPk(user.id) : existingUser;
    }

    const result = await UserModel.create(user);
    return result.toJSON();
  }

  function findById(id) {
    return UserModel.findByPk(id);
  }

  return {
    createOrUpdate,
    findById,
  };
};
