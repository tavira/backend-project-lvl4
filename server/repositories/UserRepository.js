export default (app) => ({
  async getUsers() {
    return app.objection.models.user.query();
  },

  async addUser(user) {
    return app.objection.models.user.query().insert(user);
  },

  async findById(id) {
    return app.objection.models.user.query().findById(id);
  },

  async updateUser(id, userInfo) {
    const user = await app.objection.models.user.query().findById(id);
    return user.$query().patch(userInfo);
  },

  async deleteById(id) {
    return app.objection.models.user.query().deleteById(id);
  },
});
