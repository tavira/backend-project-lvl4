import getApp from '../../server';
import {
  getTestData,
  prepareData,
  getSessionCookie,
  login,
} from '../helpers';

describe('test users update', () => {
  let app;
  let knex;
  let models;
  const testData = getTestData();

  beforeAll(async () => {
    app = await getApp();
    knex = app.objection.knex;
    models = app.objection.models;
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    await prepareData(app);
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(() => {
    app.close();
  });

  it('delete: own account', async () => {
    const existingUserData = testData.users.existing;
    const responseSignIn = await login(app, existingUserData);
    const sessionCookie = getSessionCookie(responseSignIn);

    const { id } = await models.user.query().findOne({ email: existingUserData.email });

    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteUser', { id }),
      cookies: sessionCookie,
    });

    expect(response.statusCode).toBe(302);

    const deletedUser = await models.user.query().findOne({ email: existingUserData.email });
    expect(deletedUser).toBeUndefined();
  });

  it('delete: if forbbiden for not own account', async () => {
    const existingUserData = testData.users.existing;
    const responseSignIn = await login(app, existingUserData);
    const sessionCookie = getSessionCookie(responseSignIn);

    const existingUser = await models.user.query().findOne({ email: existingUserData.email });

    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteUser', { id: existingUser.id + 1 }),
      cookies: sessionCookie,
    });

    expect(response.statusCode).toBe(403);

    const deletedUser = await models.user.query().findOne({ email: existingUserData.email });
    expect(deletedUser).toEqual(existingUser);
  });

  it('delete: is forbidden for unauthenticated users', async () => {
    const existingUserData = testData.users.existing;
    const existingUser = await models.user.query().findOne({ email: existingUserData.email });

    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteUser', { id: 1 }),
    });

    expect(response.statusCode).toBe(401);

    const currentUser = await models.user.query().findOne({ email: existingUserData.email });
    expect(currentUser).toEqual(existingUser);
  });
});
