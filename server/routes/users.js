// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const repo = app.container.repos('users');
      const users = await repo.getUsers();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      reply.render('users/new', { user: {} });
    })
    .post('/users', async (req, reply) => {
      try {
        const repo = app.container.repos('users');
        await repo.addUser(req.body.data);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.statusCode = 422;
        reply.render('users/new', { user: req.body.data, errors: data });
        return reply;
      }
    })
    .get('/users/:id/edit', { name: 'editUser' }, async (req, reply) => {
      if (req.isUnauthenticated()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.statusCode = 401;
        reply.render('welcome/index');
        return reply;
      }

      const id = Number(req.params.id);
      const authUserId = req.user.id;

      if (id !== authUserId) {
        req.flash('error', i18next.t('flash.users.update.otherUserError'));
        reply.statusCode = 403;
        reply.render('welcome/index');
        return reply;
      }

      try {
        const repo = app.container.repos('users');
        const user = await repo.findById(authUserId);
        reply.render('users/edit', { user });
        return reply;
      } catch (e) {
        return null;
      }
    })
    .patch('/users/:id', { name: 'patchUser' }, async (req, reply) => {
      if (req.isUnauthenticated()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.statusCode = 401;
        reply.render('welcome/index');
        return reply;
      }

      const id = Number(req.params.id);
      const authUserId = req.user.id;

      if (id !== authUserId) {
        req.flash('error', i18next.t('flash.users.update.otherUserError'));
        reply.statusCode = 403;
        reply.render('welcome/index');
        return reply;
      }

      try {
        const repo = app.container.repos('users');
        await repo.updateUser(id, req.body.data);
        const users = await repo.getUsers();

        reply.statusCode = 200;
        reply.render('users/index', { users });

        return reply;
      } catch (e) {
        req.flash('error', i18next.t('flash.users.update.error'));
        reply.statusCode = 422;
        reply.render('users/edit', { user: { id: req.params.id, ...req.body.data }, errors: e.data });
        return reply;
      }
    })
    .delete('/users/:id', { name: 'deleteUser' }, async (req, reply) => {
      if (req.isUnauthenticated()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.statusCode = 401;
        reply.render('welcome/index');
        return reply;
      }
      const id = Number(req.params.id);
      const authUserId = req.user.id;

      if (id !== authUserId) {
        req.flash('error', i18next.t('flash.users.delete.otherUserError'));
        reply.statusCode = 403;
        reply.render('welcome/index');
        return reply;
      }

      try {
        const repo = app.container.repos('users');
        await repo.deleteById(id);
        await req.logout();
        req.flash('success', i18next.t('flash.users.delete.success'));
        return reply.redirect(app.reverse('root'));
      } catch ({ data }) {
        reply.statusCode = 500;
        reply.render('welcome/index', { user: {}, errors: data });
        return reply;
      }
    });
};
