import i18next from 'i18next';

export default (app) => {
  app
    .get('/statuses', { name: 'statuses' }, async (req, reply) => {
      const repo = app.container.repos('statuses');
      const statuses = await repo.getStatuses();
      reply.render('statuses/index', { statuses });
      return reply;
    })
    .get('/statuses/new', { name: 'newStatus' }, async (req, reply) => {
      reply.render('statuses/new', { status: {} });
      return reply;
    })
    .post('/statuses', { name: 'createStatus' }, async (req, reply) => {
      if (req.isUnauthenticated()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.statusCode = 401;
        reply.render('welcome/index');
        return reply;
      }

      try {
        const repo = app.container.repos('statuses');
        await repo.addStatus(req.body.data);
        req.flash('success', i18next.t('flash.statuses.create.success'));
        reply.redirect(app.reverse('statuses'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.statusCode = 422;
        reply.render('statuses/new', { status: req.body.data, errors: data });
        return reply;
      }
    })
    .delete('/statuses/:id', { name: 'deleteStatus' }, async (req, reply) => {
      if (req.isUnauthenticated()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.statusCode = 401;
        reply.render('welcome/index');
        return reply;
      }

      try {
        const id = Number(req.params.id);
        const repo = app.container.repos('statuses');
        await repo.deleteById(id);
        req.flash('success', i18next.t('flash.statuses.delete.success'));
        return reply.redirect(app.reverse('statuses'));
      } catch ({ data }) {
        reply.statusCode = 500;
        reply.render('welcome/index', { user: {} });
        return reply;
      }
    })
    .get('/statuses/:id/edit', { name: 'editStatus' }, async (req, reply) => {
      if (req.isUnauthenticated()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.statusCode = 401;
        reply.render('welcome/index');
        return reply;
      }

      try {
        const id = Number(req.params.id);
        const repo = app.container.repos('statuses');
        const status = await repo.findById(id);
        reply.render('statuses/edit', { status });
        return reply;
      } catch ({ data }) {
        reply.statusCode = 500;
        reply.render('welcome/index', { user: {} });
        return reply;
      }
    })
    .patch('/statuses/:id', { name: 'patchStatus' }, async (req, reply) => {
      if (req.isUnauthenticated()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.statusCode = 401;
        reply.render('welcome/index');
        return reply;
      }

      const id = Number(req.params.id);
      try {
        const repo = app.container.repos('statuses');
        await repo.updateUser(id, req.body.data);
        req.flash('success', i18next.t('flash.statuses.update.success'));
        reply.redirect(app.reverse('statuses'));
        return reply;
      } catch (e) {
        console.log(e);
        reply.statusCode = 500;
        reply.render('welcome/index', { user: {} });
        return reply;
      }
    });
};
