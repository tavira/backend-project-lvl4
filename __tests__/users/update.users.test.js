import _ from 'lodash';
import getApp from '../../server';
import encrypt from '../../server/lib/secure.js';
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

  it('edit form is allowed for own account', async () => {
    const existingUser = testData.users.existing;
    const { id } = await models.user.query().findOne({ email: existingUser.email });

    const signInResponse = await login(app, existingUser);
    const sessionCookie = getSessionCookie(signInResponse);

    const editUserFormResponse = await app.inject({
      method: 'GET',
      url: app.reverse('editUser', { id }),
      cookies: sessionCookie,
    });

    expect(editUserFormResponse.statusCode).toBe(200);
  });

  it('edit form is forbidden for unauthenticated users', async () => {
    const editUserFormResponse = await app.inject({
      method: 'GET',
      url: app.reverse('editUser', { id: 1 }),
    });

    expect(editUserFormResponse.statusCode).toBe(401);
  });

  it('patch is forbidden for not own account', async () => {
    const existingUser = testData.users.existing;
    const updatedUser = testData.users.updated;

    const signInResponse = await login(app, existingUser);
    const sessionCookie = getSessionCookie(signInResponse);

    const { id } = await models.user.query().findOne({ email: existingUser.email });

    const patchUserResponse = await app.inject({
      method: 'PATCH',
      url: app.reverse('patchUser', { id: id + 1 }),
      payload: {
        data: updatedUser,
      },
      cookies: sessionCookie,
    });

    expect(patchUserResponse.statusCode).toBe(403);
  });

  test('patch for own account is allowed', async () => {
    const existingUser = testData.users.existing;
    const updatedUser = testData.users.updated;

    const signInResponse = await login(app, existingUser);
    const sessionCookie = getSessionCookie(signInResponse);

    const { id } = await models.user.query().findOne({ email: existingUser.email });

    const patchUserResponse = await app.inject({
      method: 'PATCH',
      url: app.reverse('patchUser', { id }),
      cookies: sessionCookie,
      payload: { data: updatedUser },
    });

    expect(patchUserResponse.statusCode).toBe(200);

    const updatedUserFromStorage = await models.user.query().findById(id);

    const expected = {
      ..._.omit(updatedUser, 'password'),
      passwordDigest: encrypt(updatedUser.password),
    };
    expect(updatedUserFromStorage).toMatchObject(expected);
  });

  it('patch is forbidden for unauthenticated users', async () => {
    const existingUser = testData.users.existing;
    const updatedUser = testData.users.updated;

    const { id } = await models.user.query().findOne({ email: existingUser.email });

    const patchUserResponse = await app.inject({
      method: 'PATCH',
      url: app.reverse('patchUser', { id }),
      payload: { data: updatedUser },
    });

    expect(patchUserResponse.statusCode).toBe(401);

    const userFromStorageAfterPatch = await models.user.query().findById(id);

    const expected = {
      ..._.omit(existingUser, 'password'),
      passwordDigest: encrypt(existingUser.password),
    };
    expect(userFromStorageAfterPatch).toMatchObject(expected);
  });

  it('edit form is forbidden for someone else\'s account', async () => {
    const existingUser = testData.users.existing;
    const signInResponse = await login(app, existingUser);
    const sessionCookie = getSessionCookie(signInResponse);

    const { id } = await models.user.query().findOne({ email: existingUser.email });

    const editFormResponse = await app.inject({
      method: 'GET',
      url: app.reverse('editUser', { id: id + 1 }),
      cookies: sessionCookie,
    });

    expect(editFormResponse.statusCode).toBe(403);
  });
});
