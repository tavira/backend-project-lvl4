import getApp from '../server/index.js';
import {
  getSessionCookie, getTestData, login, prepareData,
} from './helpers';

describe('test statuses', () => {
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

  it('index', async () => {
    const existingUser = testData.users.existing;
    const signInResponse = await login(app, existingUser);
    const sessionCookie = getSessionCookie(signInResponse);

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('statuses'),
      cookies: sessionCookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const existingUser = testData.users.existing;
    const signInResponse = await login(app, existingUser);
    const sessionCookie = getSessionCookie(signInResponse);

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newStatus'),
      cookies: sessionCookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const existingUser = testData.users.existing;
    const signInResponse = await login(app, existingUser);
    const sessionCookie = getSessionCookie(signInResponse);

    const newStatus = testData.statuses.new;

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('statuses'),
      payload: {
        data: newStatus,
      },
      cookies: sessionCookie,
    });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(app.reverse('statuses'));

    const recordedStatus = await models.status.query().findOne({ name: newStatus.name });
    expect(recordedStatus).not.toBeUndefined();
  });

  it('edit', async () => {
    const existingUser = testData.users.existing;
    const signInResponse = await login(app, existingUser);
    const sessionCookie = getSessionCookie(signInResponse);

    const status = await models.status.query()
      .findOne({ name: testData.statuses.previouslyAdded.name });

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editStatus', { id: status.id }),
      cookies: sessionCookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('patch', async () => {
    const existingUser = testData.users.existing;
    const signInResponse = await login(app, existingUser);
    const sessionCookie = getSessionCookie(signInResponse);

    const previouslyAddedStatus = await models.status.query()
      .findOne({ name: testData.statuses.previouslyAdded.name });

    const newStatusData = testData.statuses.new;

    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('patchStatus', { id: previouslyAddedStatus.id }),
      payload: {
        data: newStatusData,
      },
      cookies: sessionCookie,
    });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(app.reverse('statuses'));

    const updatedStatus = await models.status.query()
      .findOne({ id: previouslyAddedStatus.id });

    expect(updatedStatus.name).toBe(newStatusData.name);
  });

  it('delete', async () => {
    const existingUser = testData.users.existing;
    const signInResponse = await login(app, existingUser);
    const sessionCookie = getSessionCookie(signInResponse);

    const previouslyAddedStatus = await models.status.query()
      .findOne({ name: testData.statuses.previouslyAdded.name });

    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteStatus', { id: previouslyAddedStatus.id }),
      cookies: sessionCookie,
    });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(app.reverse('statuses'));

    const deletedStatus = await models.status.query().findOne({ id: previouslyAddedStatus.id });
    expect(deletedStatus).toBeUndefined();
  });

  it.todo('disallow status deleting if there are related tasks');

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
