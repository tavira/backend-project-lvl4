export default (app) => ({
  async getStatuses() {
    console.error(app.objection.models);
    return app.objection.models.status.query();
  },

  async addStatus(status) {
    return app.objection.models.status.query().insert(status);
  },

  async deleteById(id) {
    return app.objection.models.status.query().deleteById(id);
  },

  async findById(id) {
    return app.objection.models.status.query().findById(id);
  },

  async updateUser(id, payload) {
    const user = await app.objection.models.status.query().findById(id);
    return user.$query().patch(payload);
  },
});
